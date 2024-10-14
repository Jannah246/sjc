import { createObjectId } from "../helpers";
import db from "../models";
import { IPosDeviceCode } from "../models/pos_device_code.model";
import { Obj, ObjectID } from "../types/interfaces";
import { IDbPosDeviceCodeWithHistory } from "../types/interfaces/IDbPosDeviceCodeWithHistory";

const posDeviceCodeModel = db.posDeviceCodeModel;

export const isDeviceCodeFound = async (
  code: string
): Promise<IPosDeviceCode | null> => {
  const result = await posDeviceCodeModel.findOne({ pos_device_code: code });
  return result;
};

export const deviceCodeAvailableForActive = async (
  clientId: string,
  code: string
): Promise<IPosDeviceCode | null> => {
  const result = await posDeviceCodeModel.findOne({
    client_id: clientId,
    pos_device_code: code,
  });
  return result;
};

export const createDeviceCode = async (obj: Obj): Promise<IPosDeviceCode> => {
  const result = await posDeviceCodeModel.create(obj);
  return result;
};

export const activeDeviceCode = async (id: ObjectID): Promise<void> => {
  await posDeviceCodeModel.updateOne({ _id: id }, { is_used: 1 });
};

export const deactivateDeviceCode = async (id: ObjectID): Promise<void> => {
  await posDeviceCodeModel.updateOne({ _id: id }, { is_used: 0 });
};

export const getAllDeviceCode = async (
  status?: string
): Promise<IPosDeviceCode[] | []> => {
  const filter = {
    status: status
      ? parseInt(status)
      : {
          $ne: 0,
        },
  };

  const result = await posDeviceCodeModel.find(filter);
  return result;
};

export const getDeviceCodeWithHistory = async (
  status?: string
): Promise<IDbPosDeviceCodeWithHistory[] | []> => {
  const filter = {
    status: status
      ? parseInt(status)
      : {
          $ne: 0,
        },
  };
  const result = await posDeviceCodeModel.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "pos_device_code_histories",
        localField: "_id",
        foreignField: "pos_dc_id",
        as: "pos_device_code_history",
        pipeline: [
          {
            $match: {
              code_status: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$pos_device_code_history",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);
  return result;
};
export const getDeviceCodeWithHistoryByClient = async (
  clientId: string,
  status?: string
): Promise<IDbPosDeviceCodeWithHistory[] | []> => {
  const filter = {
    status: status
      ? parseInt(status)
      : {
          $ne: 0,
        },
    client_id: createObjectId(clientId),
  };

  const result = await posDeviceCodeModel.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "pos_device_code_histories",
        localField: "_id",
        foreignField: "pos_dc_id",
        as: "pos_device_code_history",
        pipeline: [
          {
            $match: {
              code_status: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$pos_device_code_history",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);
  return result;
};

export const getPosDeviceCodeById = async (
  id: string
): Promise<IPosDeviceCode | null> => {
  const result = await posDeviceCodeModel.findOne({ _id: id, status: 1 });
  return result;
};

export const getPosDeviceCodeByIdWithoutStatus = async (
  id: string
): Promise<IPosDeviceCode | null> => {
  const result = await posDeviceCodeModel.findOne({ _id: id });
  return result;
};

export const updateStatus = async (
  id: string,
  status: number
): Promise<void> => {
  await posDeviceCodeModel.updateOne({ _id: id }, { status: status });
};

export const deviceCodeAvailableForPos = async (
  clientId: string,
  deviceCode: string
): Promise<IPosDeviceCode | null> => {
  const result = await posDeviceCodeModel.findOne({
    pos_device_code: deviceCode,
    client_id: clientId,
    status: 1,
    is_used: 1,
  });
  return result;
};
