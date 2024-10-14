import db from "../models";
import { IOrderInternetPackage } from "../models/order_internet_package.model";
import { OrderStatus } from "../types/enums";
import { Obj, ObjectID } from "../types/interfaces";

const orderInternetPackageModel = db.orderInternetPackageModel;

export const createOrderInternetPackage = async (
  obj: IOrderInternetPackage
): Promise<IOrderInternetPackage> => {
  return await orderInternetPackageModel.create(obj);
};

export const activeInternetPackageForUser = async (
  user_id: string
): Promise<IOrderInternetPackage | null> => {
  const result = await orderInternetPackageModel.findOne({
    user_id: user_id,
    order_status: OrderStatus.active,
  });
  return result;
};

export const expireInternetPackage = async (id: ObjectID): Promise<void> => {
  await orderInternetPackageModel.updateOne(
    { _id: id },
    { order_status: OrderStatus.expire, expired_on: new Date() }
  );
};

export const getExpireInternetPackage = async (
  date: Date
): Promise<IOrderInternetPackage[] | []> => {
  const result = await orderInternetPackageModel.find({
    package_expiry_date: { $lte: date },
    order_status: OrderStatus.active,
  });
  return result;
};

export const getUpcomingPendingPlanOfUser = async (
  user_id: ObjectID
): Promise<IOrderInternetPackage | null> => {
  const result = await orderInternetPackageModel
    .find({ user_id: user_id, order_status: OrderStatus.pending })
    .sort({ purchase_date: 1 })
    .limit(1);
  if (!result || !result.length) {
    return null;
  }
  return result[0];
};

export const updateInternetPackage = async (
  id: ObjectID,
  obj: Obj
): Promise<void> => {
  await orderInternetPackageModel.updateOne({ _id: id }, obj);
};

export const getManualPendingPackage = async (
  user_id: string,
  order_id: string
): Promise<IOrderInternetPackage | null> => {
  const result = await orderInternetPackageModel.findOne({
    user_id: user_id,
    order_status: OrderStatus.pending,
    _id: order_id,
  });
  return result;
};

export const getInternetPackageForUser = async (
  user_id: ObjectID,
  order_status?: string
): Promise<Obj[] | []> => {
  const filter: Obj = {
    user_id: user_id,
  };
  if (order_status) {
    filter.order_status = parseInt(order_status);
  }

  const result = await orderInternetPackageModel.aggregate([
    {
      $match: filter,
    },

    {
      $lookup: {
        from: "camps",
        localField: "camp_id",
        foreignField: "_id",
        as: "order_from_camp_detail",
        pipeline: [
          {
            $addFields: {
              id: "$_id",
            },
          },
          {
            $project: {
              _id: 0,
              id: 1,
              camp_name: 1,
              camp_address: 1,
              camp_city: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$order_from_camp_detail",
    },
    {
      $lookup: {
        from: "user_registers",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $addFields: {
              id: "$_id",
            },
          },
          {
            $project: {
              _id: 0,
              id: 1,
              name: 1,
              uuid: 1,
              phone: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$user",
    },
    {
      $addFields: {
        id: "$_id",
      },
    },
    {
      $unset: ["__v", "order_from_camp_detail.__v", "_id", "user.__v"],
    },
  ]);
  return result;
};

export const getInternetPackageForCamp = async (
  camp_id: ObjectID,
  order_status?: string
): Promise<Obj[] | []> => {
  const filter: Obj = {
    camp_id: camp_id,
  };
  if (order_status) {
    filter.order_status = parseInt(order_status);
  }

  const result = await orderInternetPackageModel.aggregate([
    {
      $match: filter,
    },

    {
      $lookup: {
        from: "camps",
        localField: "camp_id",
        foreignField: "_id",
        as: "order_from_camp_detail",
        pipeline: [
          {
            $addFields: {
              id: "$_id",
            },
          },
          {
            $project: {
              _id: 0,
              id: 1,
              camp_name: 1,
              camp_address: 1,
              camp_city: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$order_from_camp_detail",
    },
    {
      $lookup: {
        from: "user_registers",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $addFields: {
              id: "$_id",
            },
          },
          {
            $project: {
              _id: 0,
              id: 1,
              name: 1,
              uuid: 1,
              phone: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$user",
    },
    {
      $addFields: {
        id: "$_id",
      },
    },
    {
      $unset: ["__v", "order_from_camp_detail.__v", "_id", "user.__v"],
    },
  ]);
  return result;
};

export const getInternetPackageFromOrderId = async (
  id: ObjectID,
  user_id: ObjectID
): Promise<Obj | null> => {
  const result = await orderInternetPackageModel.aggregate([
    {
      $match: { _id: id, user_id: user_id },
    },

    {
      $lookup: {
        from: "camps",
        localField: "camp_id",
        foreignField: "_id",
        as: "order_from_camp_detail",
        pipeline: [
          {
            $addFields: {
              id: "$_id",
            },
          },
          {
            $project: {
              _id: 0,
              id: 1,
              camp_name: 1,
              camp_address: 1,
              camp_city: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$order_from_camp_detail",
    },
    {
      $lookup: {
        from: "user_registers",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $addFields: {
              id: "$_id",
            },
          },
          {
            $project: {
              _id: 0,
              id: 1,
              name: 1,
              uuid: 1,
              phone: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$user",
    },
    {
      $addFields: {
        id: "$_id",
      },
    },
    {
      $unset: ["__v", "order_from_camp_detail.__v", "_id", "user.__v"],
    },
  ]);

  if (!result || !result.length) {
    return null;
  }
  return result[0];
};

export const getInternetPackageForClient = async (
  client_id: ObjectID,
  order_status?: string
): Promise<Obj[] | []> => {
  const filter: Obj = {};
  if (order_status) {
    filter.order_status = parseInt(order_status);
  }

  const result = await orderInternetPackageModel.aggregate([
    {
      $match: filter,
    },

    {
      $lookup: {
        from: "camps",
        localField: "camp_id",
        foreignField: "_id",
        as: "order_from_camp_detail",
        pipeline: [
          {
            $match: {
              client_id: client_id,
            },
          },
          {
            $addFields: {
              id: "$_id",
            },
          },
          {
            $project: {
              _id: 0,
              id: 1,
              camp_name: 1,
              camp_address: 1,
              camp_city: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$order_from_camp_detail",
    },
    {
      $lookup: {
        from: "user_registers",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $addFields: {
              id: "$_id",
            },
          },
          {
            $project: {
              _id: 0,
              id: 1,
              name: 1,
              uuid: 1,
              phone: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$user",
    },
    {
      $addFields: {
        id: "$_id",
      },
    },
    {
      $unset: ["__v", "order_from_camp_detail.__v", "_id", "user.__v"],
    },
  ]);
  return result;
};

export const getInternetPackageForAccountant = async (
  accountant_id: ObjectID,
  order_status?: string
): Promise<Obj[] | []> => {
  const filter: Obj = {};
  if (order_status) {
    filter.order_status = parseInt(order_status);
  }

  const result = await orderInternetPackageModel.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "cam_assign_accountants",
        localField: "camp_id",
        foreignField: "camp_id",
        as: "assign_accountant_details",
        pipeline: [
          {
            $match: {
              accountant_id: accountant_id,
              status: 1,
            },
          },
          {
            $addFields: {
              assign_id: "$_id",
            },
          },
          {
            $project: {
              _id: 0,
              assign_id: 1,
              camp_id: 1,
              accountant_id: 1,
              status: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$assign_accountant_details",
    },

    {
      $lookup: {
        from: "camps",
        localField: "camp_id",
        foreignField: "_id",
        as: "order_from_camp_detail",
        pipeline: [
          {
            $addFields: {
              id: "$_id",
            },
          },
          {
            $project: {
              _id: 0,
              id: 1,
              camp_name: 1,
              camp_address: 1,
              camp_city: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$order_from_camp_detail",
    },
    {
      $lookup: {
        from: "user_registers",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $addFields: {
              id: "$_id",
            },
          },
          {
            $project: {
              _id: 0,
              id: 1,
              name: 1,
              uuid: 1,
              phone: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$user",
    },
    {
      $addFields: {
        id: "$_id",
      },
    },
    {
      $unset: ["__v", "order_from_camp_detail.__v", "_id", "user.__v"],
    },
  ]);
  return result;
};

export const getInternetPackageForCoordinator = async (
  coordinator_id: ObjectID,
  order_status?: string
): Promise<Obj[] | []> => {
  const filter: Obj = {};
  if (order_status) {
    filter.order_status = parseInt(order_status);
  }

  const result = await orderInternetPackageModel.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "cam_assign_coordinators",
        localField: "camp_id",
        foreignField: "camp_id",
        as: "assign_coordinator_details",
        pipeline: [
          {
            $match: {
              coordinator_id: coordinator_id,
              status: 1,
            },
          },
          {
            $addFields: {
              assign_id: "$_id",
            },
          },
          {
            $project: {
              _id: 0,
              assign_id: 1,
              camp_id: 1,
              coordinator_id: 1,
              status: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$assign_coordinator_details",
    },

    {
      $lookup: {
        from: "camps",
        localField: "camp_id",
        foreignField: "_id",
        as: "order_from_camp_detail",
        pipeline: [
          {
            $addFields: {
              id: "$_id",
            },
          },
          {
            $project: {
              _id: 0,
              id: 1,
              camp_name: 1,
              camp_address: 1,
              camp_city: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$order_from_camp_detail",
    },
    {
      $lookup: {
        from: "user_registers",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $addFields: {
              id: "$_id",
            },
          },
          {
            $project: {
              _id: 0,
              id: 1,
              name: 1,
              uuid: 1,
              phone: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$user",
    },
    {
      $addFields: {
        id: "$_id",
      },
    },
    {
      $unset: ["__v", "order_from_camp_detail.__v", "_id", "user.__v"],
    },
  ]);
  return result;
};
