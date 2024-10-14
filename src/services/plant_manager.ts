import { createObjectId, generateHash } from "../helpers";
import db from "../models";
import { IPlantManager } from "../models/plant_manager.model";
import { Obj, ObjectID } from "../types/interfaces";

const plantManagerModel = db.plantManagerModel;

export const createPlantManager = async (
  role_id: ObjectID,
  plantManager: Obj
): Promise<IPlantManager | null> => {
  const plantManagerData = plantManager as IPlantManager;
  plantManagerData.client_id = null;
  plantManagerData.role_id = role_id;
  plantManagerData.status = 1;
  plantManagerData.password = generateHash(plantManagerData.password);
  return await plantManagerModel.create(plantManagerData);
};

export const checkEmail = async (
  email: string,
  id?: string
): Promise<IPlantManager | null> => {
  const filter: Obj = {
    email: email,
    status: {
      $ne: 0,
    },
  };

  if (id) {
    filter._id = { $ne: createObjectId(id) };
  }

  return await plantManagerModel.findOne(filter);
};

export const getPlantManagerById = async (
  id: string
): Promise<IPlantManager | null> => {
  return await plantManagerModel.findOne(
    { _id: id, client_id: null, status: 1 },
    { password: 0 }
  );
};

export const getPlantManagerByIdWithoutStatus = async (
  id: string
): Promise<IPlantManager | null> => {
  return await plantManagerModel.findOne({ _id: id, client_id: null });
};

export const getAllPlantManager = async (
  filter: Obj
): Promise<IPlantManager[] | []> => {
  const results = await plantManagerModel.find(filter, { password: 0 });
  return results;
};

export const updateStatus = async (
  id: string,
  status: number
): Promise<void> => {
  await plantManagerModel.updateOne({ _id: id }, { status: status });
  return;
};

export const updatePlantManager = async (
  id: string,
  plantManager: Obj
): Promise<void> => {
  const plantManagerData = plantManager as IPlantManager;
  plantManagerData.password = generateHash(plantManagerData.password);
  await plantManagerModel.updateOne({ _id: id }, plantManagerData);
  return;
};

export const getPlantManagerByEmail = async (
  email: string
): Promise<IPlantManager | null> => {
  const result = await plantManagerModel.findOne({ email: email, status: 1 });
  return result;
};

export const getPlantManagerByIdWithPassword = async (
  id: string
): Promise<IPlantManager | null> => {
  return await plantManagerModel.findOne({
    _id: id,
    client_id: null,
    status: 1,
  });
};

export const updateOne = async (_id: ObjectID, obj: Obj): Promise<void> => {
  await plantManagerModel.updateOne({ _id: _id }, obj);
};
