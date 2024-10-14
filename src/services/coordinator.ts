import { createObjectId, generateHash } from "../helpers";
import db from "../models";
import { ICoordinator } from "../models/coordinator.model";
import { Obj, ObjectID } from "../types/interfaces";

const coordinatorModel = db.coordinatorModel;

export const createCoordinator = async (
  role_id: ObjectID,
  coordinator: Obj
): Promise<ICoordinator | null> => {
  const coordinatorData = coordinator as ICoordinator;
  coordinatorData.role_id = role_id;
  coordinatorData.status = 1;
  coordinatorData.password = generateHash(coordinatorData.password);
  return await coordinatorModel.create(coordinatorData);
};

export const checkEmail = async (
  email: string,
  id?: string
): Promise<ICoordinator | null> => {
  const filter: Obj = {
    email: email,
    status: {
      $ne: 0,
    },
  };
  if (id) {
    filter._id = { $ne: createObjectId(id) };
  }

  return await coordinatorModel.findOne(filter);
};

export const updateCoordinator = async (
  id: string,
  coordinator: Obj
): Promise<void> => {
  const coordinatorData = coordinator as ICoordinator;
  coordinatorData.password = generateHash(coordinatorData.password);
  await coordinatorModel.updateOne({ _id: id }, coordinatorData);
  return;
};

export const updateStatus = async (
  id: string,
  status: number
): Promise<void> => {
  await coordinatorModel.updateOne({ _id: id }, { status: status });
  return;
};

export const getAllCoordinator = async (
  filter: Obj
): Promise<ICoordinator[] | []> => {
  const results = await coordinatorModel.find(filter, { password: 0 });
  return results;
};

export const getCoordinatorById = async (
  id: string,
  client_id: string
): Promise<ICoordinator | null> => {
  return await coordinatorModel.findOne(
    { _id: id, client_id: client_id, status: 1 },
    { password: 0 }
  );
};

export const getCoordinatorByIdWithoutStatus = async (
  id: string,
  client_id: string
): Promise<ICoordinator | null> => {
  return await coordinatorModel.findOne({ _id: id, client_id: client_id });
};

export const getCoordinatorCount = async (
  clientId: string
): Promise<Number> => {
  const result = await coordinatorModel.count({
    client_id: clientId,
    status: {
      $ne: 0,
    },
  });
  return result;
};

export const getCoordinatorByEmail = async (
  email: string
): Promise<ICoordinator | null> => {
  const result = await coordinatorModel.findOne({ email: email, status: 1 });
  return result;
};

export const getCoordinatorByIdWithPassword = async (
  id: string,
  client_id: string
): Promise<ICoordinator | null> => {
  return await coordinatorModel.findOne({
    _id: id,
    client_id: client_id,
    status: 1,
  });
};

export const updateOne = async (_id: ObjectID, obj: Obj): Promise<void> => {
  await coordinatorModel.updateOne({ _id: _id }, obj);
};
