import { createObjectId } from "../helpers";
import db from "../models";
import { ICamp } from "../models/camp.model";
import { Obj, ObjectID } from "../types/interfaces";

const campModel = db.campModel;

export const checkCampName = async (
  camp_name: string,
  id?: string
): Promise<ICamp | null> => {
  const filter: Obj = {
    camp_name: camp_name,
    status: {
      $ne: 0,
    },
  };
  if (id) {
    filter._id = { $ne: createObjectId(id) };
  }

  const result = await campModel.findOne(filter);
  return result;
};

export const createCamp = async (
  clientId: string,
  camp: Obj
): Promise<ICamp | null> => {
  const obj = camp as ICamp;
  obj.client_id = createObjectId(clientId);
  obj.status = 1;
  obj.router_ssid = obj.router_ssid ? obj.router_ssid : "";
  obj.router_secondary_ip = obj.router_secondary_ip
    ? obj.router_secondary_ip
    : "";
  obj.router_pass = obj.router_pass ? obj.router_pass : "";
  obj.router_secret = obj.router_secret ? obj.router_secret : "";
  obj.router_alias = obj.router_alias ? obj.router_alias : "";
  obj.router_hostname = obj.router_hostname ? obj.router_hostname : "";
  obj.camp_uuid = obj.camp_uuid ? obj.camp_uuid : "";
  const result = await campModel.create(obj);
  return result;
};

export const updateCamp = async (id: string, client: Obj): Promise<void> => {
  const obj = client as ICamp;
  obj.router_ssid = obj.router_ssid ? obj.router_ssid : "";
  obj.router_secondary_ip = obj.router_secondary_ip
    ? obj.router_secondary_ip
    : "";
  obj.router_pass = obj.router_pass ? obj.router_pass : "";
  obj.router_secret = obj.router_secret ? obj.router_secret : "";
  obj.router_alias = obj.router_alias ? obj.router_alias : "";
  obj.router_hostname = obj.router_hostname ? obj.router_hostname : "";
  obj.camp_uuid = obj.camp_uuid ? obj.camp_uuid : "";
  await campModel.updateOne({ _id: id }, obj);
};

export const getCampById = async (id: string): Promise<ICamp | null> => {
  const result = await campModel.findOne({ _id: id, status: 1 });
  return result;
};

export const getCampByIdWithoutStatus = async (
  id: string
): Promise<ICamp | null> => {
  const result = await campModel.findOne({ _id: id });
  return result;
};

export const updateStatus = async (
  id: string,
  status: number
): Promise<void> => {
  await campModel.updateOne({ _id: id }, { status: status });
};

export const getAllCamps = async (
  id: string,
  status?: string
): Promise<ICamp[] | []> => {
  const filter = {
    client_id: id,
    status: status
      ? parseInt(status)
      : {
          $ne: 0,
        },
  };
  const result = await campModel.find(filter);
  return result;
};

export const getCampsCount = async (clientId: string): Promise<Number> => {
  const result = await campModel.count({
    client_id: clientId,
    status: {
      $ne: 0,
    },
  });
  return result;
};

export const getCampByClientIdAndId = async (
  clientId: string,
  id: string
): Promise<ICamp | null> => {
  const result = await campModel.findOne({
    _id: id,
    client_id: clientId,
    status: 1,
  });
  return result;
};

export const getCampByClientId = async (
  clientId: string
): Promise<ICamp[] | []> => {
  const result = await campModel.find({ client_id: clientId, status: 1 });
  return result;
};

export const getCampByMacAddress = async (
  mac: string
): Promise<ICamp | null> => {
  const result = await campModel.findOne({
    router_mac_address: mac,
    status: 1,
  });
  return result;
};

export const checkCampsByIdsFromClient = async (
  campIds: any[],
  client_id: string
): Promise<boolean> => {
  const filter: Obj = {
    _id: {
      $in: campIds,
    },
    status: 1,
  };
  if (client_id) {
    filter.client_id = client_id;
  }
  const getCamps = await campModel.find(filter);

  if (campIds.length !== getCamps.length) {
    return false;
  }

  return true;
};

export const getCampByLocationApi = async (): Promise<ICamp | null> => {
  const result = await campModel.findOne({ status: 1 });
  return result;
};

export const getCampAssignDeviceDetails = async (
  campId: ObjectID,
  clientId: ObjectID
): Promise<Obj[]> => {
  const filter = {
    _id: campId,
    status: 1,
    client_id: clientId,
  };
  const result = await campModel.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "cam_assign_pos_devices",
        localField: "_id",
        foreignField: "camp_id",
        as: "camp_assign_pos_device",
        pipeline: [
          {
            $match: {
              status: 1,
            },
          },
          {
            $lookup: {
              from: "pos_device_codes",
              localField: "pos_dc_id",
              foreignField: "_id",
              as: "pos_device_code",
            },
          },
          { $unwind: "$pos_device_code" },
          {
            $addFields: {
              assigned_id: "$_id",
            },
          },
        ],
      },
    },
    {
      $addFields: {
        id: "$_id",
      },
    },
    {
      $unset: [
        "__v",
        "camp_assign_pos_device.pos_device_code.__v",
        "camp_assign_pos_device.__v",
        "_id",
        "camp_assign_pos_device.pos_device_code._id",
        "camp_assign_pos_device._id",
      ],
    },
  ]);
  return result;
};

export const getBaseCampUserDetails = async (
  client_id: ObjectID,
  camp_id: string
): Promise<Obj[] | []> => {
  const filter: Obj = {
    client_id: client_id,
    status: 1,
  };
  if (camp_id) {
    filter._id = createObjectId(camp_id);
  }

  const result = await campModel.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "user_camps",
        localField: "_id",
        foreignField: "camp_id",
        as: "user_camp",
        pipeline: [
          {
            $match: {
              status: 1,
            },
          },
          {
            $lookup: {
              from: "user_registers",
              localField: "user_id",
              foreignField: "_id",
              pipeline: [
                {
                  $match: {
                    status: 1,
                  },
                },
                {
                  $project: {
                    id: "$_id",
                    _id: 0,
                    name: 1,
                    uuid: 1,
                    device_mac_id: 1,
                    status: 1,
                    phone: 1,
                  },
                },
              ],
              as: "user",
            },
          },
          { $unwind: "$user" },
          {
            $project: {
              assign_id: "$_id",
              _id: 0,
              user_id: 1,
              camp_id: 1,
              client_id: 1,
              status: 1,
              user: 1,
            },
          },
        ],
      },
    },

    {
      $project: {
        id: "$_id",
        _id: 0,
        camp_name: 1,
        camp_address: 1,
        camp_city: 1,
        status: 1,
        user_camp: 1,
      },
    },
  ]);
  return result;
};
