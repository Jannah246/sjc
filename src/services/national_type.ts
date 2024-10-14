import { createObjectId } from "../helpers";
import { Obj } from "../types/interfaces";
import db from "../models";
import { INationalType } from "../models/national_type.model";

const nationalTypeModel = db.nationalTypeModel;

export const createNationalType = async (
  nationalType: Obj
): Promise<INationalType | null> => {
  const nationalTypeData = nationalType as INationalType;
  nationalTypeData.status = 1;
  return await nationalTypeModel.create(nationalTypeData);
};

export const checkUniqueName = async (
  name: string,
  id?: string
): Promise<INationalType | null> => {
  const filter: Obj = {
    name: name,
    status: {
      $ne: 0,
    },
  };
  if (id) {
    filter._id = { $ne: createObjectId(id) };
  }

  return await nationalTypeModel.findOne(filter);
};

export const getAllNationalTypes = async (
  status?: string
): Promise<INationalType[] | []> => {
  const filter = {
    status: status
      ? parseInt(status)
      : {
          $ne: 0,
        },
  };

  const results = await nationalTypeModel.find(filter);
  return results;
};

export const getNationalTypeById = async (
  id: string
): Promise<INationalType | null> => {
  return await nationalTypeModel.findOne({ _id: id, status: 1 });
};

export const getNationalTypeByIdWithoutStatus = async (
  id: string
): Promise<INationalType | null> => {
  return await nationalTypeModel.findOne({ _id: id });
};

export const updateStatus = async (
  id: string,
  status: number
): Promise<void> => {
  await nationalTypeModel.updateOne({ _id: id }, { status: status });
  return;
};

export const updateNationalType = async (
  id: string,
  nationalType: Obj
): Promise<void> => {
  const nationalTypeData = nationalType as INationalType;
  await nationalTypeModel.updateOne({ _id: id }, nationalTypeData);
  return;
};
