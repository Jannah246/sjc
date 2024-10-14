import { createObjectId, dayToMinutes } from "../helpers";
import db from "../models";
import { IInternetPackage } from "../models/internet_package.model";
import InternetPackageAssignClient, {
  IInternetPackageAssignClient,
} from "../models/internet_package_assign_client.model";
import { InternetPackageType } from "../types/enums";
import { Obj } from "../types/interfaces";
import { IDbAssignedClientPackage } from "../types/interfaces/IDbAssignedClientsPackage";
import { IDbInternetPackageAssignClient } from "../types/interfaces/IDbInternetPackageAssignClient";

const internetPackageModel = db.internetPackageModel;
const InternetPackageAssignClientModel = db.InternetPackageAssignClientModel;

export const checkPackageCode = async (
  package_code: string,
  id?: string
): Promise<IInternetPackage | null> => {
  const filter: Obj = {
    package_code: package_code,
    package_status: {
      $ne: 0,
    },
  };
  if (id) {
    filter._id = { $ne: createObjectId(id) };
  }

  const result = await internetPackageModel.findOne(filter);
  return result;
};

export const createInternetPackage = async (
  internetPackage: Obj
): Promise<IInternetPackage | null> => {
  const data = internetPackage as IInternetPackage;
  data.type = InternetPackageType.FIXED_DURATION;
  data.duration = dayToMinutes(internetPackage.duration);
  data.package_status = 1;
  const result = await internetPackageModel.create(data);
  return result;
};

export const updateInternetPackage = async (
  id: string,
  internetPackage: Obj
): Promise<void> => {
  const data = internetPackage as IInternetPackage;
  data.duration = dayToMinutes(internetPackage.duration);
  await internetPackageModel.updateOne({ _id: id }, data);
};

export const getInternetPackageById = async (
  id: string
): Promise<IInternetPackage | null> => {
  const result = await internetPackageModel.findOne({
    _id: id,
    package_status: 1,
  });
  return result;
};
export const checkAssignedInternetPackageByAdmin = async (
  client_id: string,
  internet_package_id: string
): Promise<IInternetPackageAssignClient | null> => {
  const result = await InternetPackageAssignClient.findOne({
    client_id: client_id,
    internet_package_id: internet_package_id,
  });
  return result;
};

export const getInternetPackageByIdWithoutStatus = async (
  id: string
): Promise<IInternetPackage | null> => {
  const result = await internetPackageModel.findOne({ _id: id });
  return result;
};

export const getAllInternetPackage = async (
  package_status: string
): Promise<IInternetPackage[] | []> => {
  const filter = {
    package_status: package_status
      ? parseInt(package_status)
      : {
          $ne: 0,
        },
  };

  const result = await internetPackageModel.find(filter);
  return result;
};

export const getAssignClientByPackageIdAndClientId = async (
  client_id: string,
  internet_package_id: string
): Promise<IInternetPackageAssignClient | null> => {
  const result = await InternetPackageAssignClientModel.findOne({
    client_id: client_id,
    internet_package_id: internet_package_id,
  });
  return result;
};

export const assignClients = async (
  objAssignClients: any[]
): Promise<any[] | []> => {
  const result = await InternetPackageAssignClientModel.insertMany(
    objAssignClients
  );
  return result;
};

export const updatePackageStatus = async (
  id: string,
  package_status: number
): Promise<void> => {
  await internetPackageModel.updateOne(
    { _id: id },
    { package_status: package_status }
  );
};

export const isPackageCodeFound = async (
  code: string
): Promise<IInternetPackage | null> => {
  const result = await internetPackageModel.findOne({
    package_code: code,
    status: 1,
  });
  return result;
};

export const assignedPackageListClientWise = async (
  clientId: string,
  status: string
): Promise<IDbInternetPackageAssignClient[] | []> => {
  const filter = {
    package_status: status
      ? parseInt(status)
      : {
          $ne: 0,
        },
  };

  const result = await InternetPackageAssignClientModel.aggregate([
    {
      $match: { client_id: createObjectId(clientId) },
    },
    {
      $lookup: {
        from: "internet_packages",
        localField: "internet_package_id",
        foreignField: "_id",
        as: "internet_package",
        pipeline: [
          {
            $match: filter,
          },
        ],
      },
    },
    {
      $unwind: "$internet_package",
    },
  ]);
  return result;
};

export const assignedClientsListPackageWise = async (
  internet_package_id: string,
  status?: string
): Promise<IDbAssignedClientPackage[] | []> => {
  const filter = {
    package_status: status
      ? parseInt(status)
      : {
          $ne: 0,
        },
  };

  const result = await InternetPackageAssignClientModel.aggregate([
    {
      $match: { internet_package_id: createObjectId(internet_package_id) },
    },
    {
      $lookup: {
        from: "internet_packages",
        localField: "internet_package_id",
        foreignField: "_id",
        as: "internet_package",
        pipeline: [
          {
            $match: filter,
          },
        ],
      },
    },
    {
      $unwind: "$internet_package",
    },
    {
      $lookup: {
        from: "clients",
        localField: "client_id",
        foreignField: "_id",
        as: "client",
      },
    },
    {
      $unwind: "$client",
    },
  ]);
  return result;
};
