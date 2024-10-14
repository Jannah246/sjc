import { createObjectId, generateHash } from "../helpers";
import db from "../models";
import { IClient } from "../models/client.model";
import { ObjectID, Obj } from "../types/interfaces";

const clientModel = db.clientModel;

export const getClientByEmail = async (
  email: string
): Promise<IClient | null> => {
  const result = await clientModel.findOne({ email: email, status: 1 });
  return result;
};
export const checkEmail = async (
  email: string,
  id?: string
): Promise<IClient | null> => {
  const filter: Obj = {
    email: email,
    status: {
      $ne: 0,
    },
  };
  if (id) {
    filter._id = { $ne: createObjectId(id) };
  }

  const result = await clientModel.findOne(filter);
  return result;
};
export const getClientWithRole = async (
  _id: ObjectID
): Promise<IClient[] | []> => {
  const result = await clientModel.aggregate([
    {
      $match: { $and: [{ _id: _id }, { status: 1 }] },
    },
    {
      $lookup: {
        from: "roles",
        localField: "role_id",
        foreignField: "_id",
        pipeline: [{ $project: { name: 1 } }],
        as: "roles",
      },
    },
    {
      $match: {
        "roles.name": "Client Admin",
      },
    },
    { $unwind: "$roles" },
  ]);
  return result;
};

export const createClient = async (
  roleId: ObjectID,
  client: Obj
): Promise<IClient | null> => {
  const user = client as IClient;
  user.status = 1;
  user.role_id = roleId;
  user.password = generateHash(user.password);
  const result = await clientModel.create(user);
  return result;
};

export const updateClient = async (id: string, client: Obj): Promise<void> => {
  const user = client as IClient;
  user.password = generateHash(user.password);
  await clientModel.updateOne({ _id: id }, user);
};

export const updateStatus = async (
  id: string,
  status: number
): Promise<void> => {
  await clientModel.updateOne({ _id: id }, { status: status });
};

export const getAllClient = async (
  status?: string
): Promise<IClient[] | []> => {
  const filter = {
    status: status
      ? parseInt(status)
      : {
          $ne: 0,
        },
  };

  const result = await clientModel.find(filter, { password: 0 });
  return result;
};

export const getClientById = async (id: string): Promise<IClient | null> => {
  const result = await clientModel.findOne({ _id: id, status: 1 });
  return result;
};

export const getClientByIdWithoutStatus = async (
  id: string
): Promise<IClient | null> => {
  const result = await clientModel.findOne({ _id: id });
  return result;
};

export const updateOne = async (_id: ObjectID, obj: Obj): Promise<void> => {
  await clientModel.updateOne({ _id: _id }, obj);
};

export const checkClientsByIds = async (clientIds: any[]): Promise<boolean> => {
  const getClients = await clientModel.find({
    _id: {
      $in: clientIds,
    },
    status: 1,
  });
  if (clientIds.length !== getClients.length) {
    return false;
  }
  return true;
};

export const getExpireSubscriptionClient = async (
  date: Date
): Promise<IClient[] | []> => {
  const result = await clientModel.find({
    subscription_end: { $lt: date },
    status: 1,
  });
  return result;
};

export const getAllCampClientWise = async (): Promise<Obj[] | []> => {
  const result = await clientModel.aggregate([
    {
      $match: { status: 1 },
    },
    {
      $lookup: {
        from: "camps",
        localField: "_id",
        foreignField: "client_id",
        as: "camps",
        pipeline: [
          {
            $match: {
              status: 1,
            },
          },
          {
            $addFields: {
              id: "$_id",
            },
          },
        ],
      },
    },

    {
      $project: {
        id: "$_id",
        _id: 0,
        full_name: 1,
        camps: 1,
      },
    },
    {
      $unset: ["camps.__v", "camps._id"],
    },
  ]);
  return result;
};
