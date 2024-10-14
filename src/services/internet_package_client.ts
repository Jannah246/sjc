import { createObjectId, minutesToDay } from "../helpers";
import db from "../models";

import { IInternetPackageAssignCamps } from "../models/internet_package_assign_camps.model";
import { IInternetPackageClient } from "../models/internet_package_client.model";
import { Obj, ObjectID } from "../types/interfaces";
import { IDbInternetPackageAssignCamp } from "../types/interfaces/IDbInternetPackageAssignCamp";
import { IDbInternetPackageAssignClient } from "../types/interfaces/IDbInternetPackageAssignClient";

const InternetPackageClientModel = db.InternetPackageClientModel;
const InternetPackageAssignCampsModel = db.InternetPackageAssignCampsModel;

export const createInternetPackageClient = async (
  internetPackageClient: Obj
): Promise<IInternetPackageClient | null> => {
  const data = internetPackageClient as IInternetPackageClient;
  data.package_status = 1;
  const result = await InternetPackageClientModel.create(data);
  return result;
};

export const updateInternetPackageClient = async (
  id: string,
  internetPackageClient: Obj
): Promise<void> => {
  const data = internetPackageClient as IInternetPackageClient;
  await InternetPackageClientModel.updateOne({ _id: id }, data);
};

export const getInternetPackageClientById = async (
  id: string,
  client_id: string
): Promise<IInternetPackageClient | null> => {
  const result = await InternetPackageClientModel.findOne({
    _id: id,
    package_status: 1,
    client_id: client_id,
  });
  return result;
};

export const getInternetPackageClientByIdWithoutStatus = async (
  id: string
): Promise<IInternetPackageClient | null> => {
  const result = await InternetPackageClientModel.findOne({ _id: id });
  return result;
};

export const updatePackageStatus = async (
  id: string,
  package_status: number
): Promise<void> => {
  await InternetPackageClientModel.updateOne(
    { _id: id },
    { package_status: package_status }
  );
};

export const getAllInternetPackagesClient = async (
  filter: Obj
): Promise<Obj[] | []> => {
  const internetPackageClient = await InternetPackageClientModel.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "internet_packages",
        localField: "internet_package_id",
        foreignField: "_id",
        as: "internet_package",
      },
    },
    {
      $unwind: "$internet_package",
    },
  ]);
  const results = [];
  for (const element of internetPackageClient) {
    const obj: Obj = {};
    obj.id = element._id;
    obj.client_id = element.client_id;
    obj.internet_package_id = element.internet_package_id;
    obj.package_name = element.package_name;
    obj.package_code = element.package_code;
    obj.package_speed = element.package_speed;
    obj.package_status = element.package_status;
    obj.package_price = element.package_price;
    obj.created_at = element.createdAt;
    obj.updated_at = element.updatedAt;
    obj.deleted_at = element.deleted_at;
    obj.original_package_name = "";
    obj.original_package_code = "";
    obj.original_package_speed = "";
    obj.original_package_status = "";
    obj.original_duration = "";
    obj.original_type = "";
    obj.original_volume = "";
    obj.original_download_bandwidth = "";
    obj.original_upload_bandwidth = "";
    if (element.internet_package) {
      obj.original_package_name = element.internet_package.package_name;
      obj.original_package_code = element.internet_package.package_code;
      obj.original_package_speed = element.internet_package.package_speed;
      obj.original_package_status = element.internet_package.package_status;
      obj.original_duration = minutesToDay(element.internet_package.duration);
      obj.original_type = element.internet_package.type;
      obj.original_volume = element.internet_package.volume;
      obj.original_download_bandwidth =
        element.internet_package.download_bandwidth;
      obj.original_upload_bandwidth = element.internet_package.upload_bandwidth;
    }

    results.push(obj);
  }

  return results;
};

export const getAssignCampsByPackageIdAndCampId = async (
  client_id: string,
  package_id: string
): Promise<IInternetPackageAssignCamps | null> => {
  const result = await InternetPackageAssignCampsModel.findOne({
    camp_id: client_id,
    package_id: package_id,
  });
  return result;
};

export const assignCamps = async (
  objAssignCamps: any[]
): Promise<any[] | []> => {
  const result = await InternetPackageAssignCampsModel.insertMany(
    objAssignCamps
  );
  return result;
};

export const assignedPackageListCampsWise = async (
  camp_ids: string[],
  status: string
): Promise<IDbInternetPackageAssignCamp[] | []> => {
  const filter: Obj = {
    camp_id: {
      $in: camp_ids,
    },
    status: status ? parseInt(status) : { $ne: 0 },
  };
  const result = await InternetPackageAssignCampsModel.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "internet_package_clients",
        localField: "package_id",
        foreignField: "_id",
        as: "internet_package_client",
        pipeline: [
          {
            $lookup: {
              from: "internet_packages",
              localField: "internet_package_id",
              foreignField: "_id",
              as: "internet_package",
              pipeline: [],
            },
          },
          {
            $unwind: "$internet_package",
          },
        ],
      },
    },
    {
      $unwind: "$internet_package_client",
    },
    {
      $lookup: {
        from: "camps",
        localField: "camp_id",
        foreignField: "_id",
        as: "camp",
      },
    },
    {
      $unwind: "$camp",
    },
  ]);
  return result;
};
export const assignedPackageListClientPackageWise = async (
  package_id: string,
  status: string,
  client_id: string
): Promise<IDbInternetPackageAssignCamp[] | []> => {
  const filter: Obj = {
    package_id: createObjectId(package_id),
    status: status ? parseInt(status) : { $ne: 0 },
  };

  const result = await InternetPackageAssignCampsModel.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "internet_package_clients",
        localField: "package_id",
        foreignField: "_id",
        as: "internet_package_client",
        pipeline: [
          {
            $match: {
              client_id: createObjectId(client_id),
            },
          },
          {
            $lookup: {
              from: "internet_packages",
              localField: "internet_package_id",
              foreignField: "_id",
              as: "internet_package",
              pipeline: [],
            },
          },
          {
            $unwind: "$internet_package",
          },
        ],
      },
    },
    {
      $unwind: "$internet_package_client",
    },
    {
      $lookup: {
        from: "camps",
        localField: "camp_id",
        foreignField: "_id",
        as: "camp",
      },
    },
    {
      $unwind: "$camp",
    },
  ]);
  return result;
};

export const getInternetPackageForPosOrder = async (
  camp_id: ObjectID
): Promise<IDbInternetPackageAssignCamp[] | []> => {
  const filter: Obj = {
    camp_id: camp_id,
    status: 1,
  };
  const result = await InternetPackageAssignCampsModel.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "internet_package_clients",
        localField: "package_id",
        foreignField: "_id",
        as: "internet_package_client",
        pipeline: [
          {
            $match: {
              package_status: 1,
            },
          },
          {
            $lookup: {
              from: "internet_packages",
              localField: "internet_package_id",
              foreignField: "_id",
              as: "internet_package",
              pipeline: [
                {
                  $match: {
                    package_status: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$internet_package",
          },
        ],
      },
    },
    {
      $unwind: "$internet_package_client",
    },
    {
      $lookup: {
        from: "camps",
        localField: "camp_id",
        foreignField: "_id",
        as: "camp",
        pipeline: [
          {
            $project: {
              _id: 1,
              camp_name: 1,
              camp_address: 1,
              camp_city: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$camp",
    },
  ]);
  return result;
};

export const getInternetPackageFromCampAndPackageId = async (
  camp_id: ObjectID,
  package_id: ObjectID
): Promise<IDbInternetPackageAssignCamp | null> => {
  const filter: Obj = {
    camp_id: camp_id,
    package_id: package_id,
    status: 1,
  };
  const result = await InternetPackageAssignCampsModel.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "internet_package_clients",
        localField: "package_id",
        foreignField: "_id",
        as: "internet_package_client",
        pipeline: [
          {
            $match: {
              package_status: 1,
            },
          },
          {
            $lookup: {
              from: "internet_packages",
              localField: "internet_package_id",
              foreignField: "_id",
              as: "internet_package",
              pipeline: [
                {
                  $match: {
                    package_status: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$internet_package",
          },
        ],
      },
    },
    {
      $unwind: "$internet_package_client",
    },
  ]);
  if (!result || !result.length) {
    return null;
  }

  return result[0];
};
