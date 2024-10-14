import { createObjectId, generateHash } from "../helpers";
import db from "../models";
import { IAccountant } from "../models/accountant.model";
import { Obj, ObjectID } from "../types/interfaces";

const accountantModel = db.accountantModel;

export const createAccountant = async (
  role_id: ObjectID,
  accountant: Obj
): Promise<IAccountant | null> => {
  const accountantData = accountant as IAccountant;
  accountantData.role_id = role_id;
  accountantData.status = 1;
  accountantData.password = generateHash(accountantData.password);
  return await accountantModel.create(accountantData);
};

export const checkEmail = async (
  email: string,
  id?: string
): Promise<IAccountant | null> => {
  const filter: Obj = {
    email: email,
    status: {
      $ne: 0,
    },
  };
  if (id) {
    filter._id = { $ne: createObjectId(id) };
  }

  return await accountantModel.findOne(filter);
};

export const getAccountantById = async (
  id: string,
  client_id: string
): Promise<IAccountant | null> => {
  return await accountantModel.findOne(
    { _id: id, client_id: client_id, status: 1 },
    { password: 0 }
  );
};

export const getAccountantByIdWithoutStatus = async (
  id: string,
  client_id: string
): Promise<IAccountant | null> => {
  return await accountantModel.findOne({ _id: id, client_id: client_id });
};

export const updateAccountant = async (
  id: string,
  accountant: Obj
): Promise<void> => {
  const accountantData = accountant as IAccountant;
  accountantData.password = generateHash(accountantData.password);
  await accountantModel.updateOne({ _id: id }, accountantData);
  return;
};

export const getAllAccountant = async (
  filter: Obj
): Promise<IAccountant[] | []> => {
  const result = await accountantModel.find(filter, { password: 0 });
  return result;
};

export const updateStatus = async (
  id: string,
  status: number
): Promise<void> => {
  await accountantModel.updateOne({ _id: id }, { status: status });
  return;
};

export const getAccountantCount = async (clientId: string): Promise<Number> => {
  const result = await accountantModel.count({
    client_id: clientId,
    status: {
      $ne: 0,
    },
  });
  return result;
};

export const getAccountantByEmail = async (
  email: string
): Promise<IAccountant | null> => {
  const result = await accountantModel.findOne({ email: email, status: 1 });
  return result;
};

export const getAccountantByIdWithPassword = async (
  id: string,
  client_id: string
): Promise<IAccountant | null> => {
  return await accountantModel.findOne({
    _id: id,
    client_id: client_id,
    status: 1,
  });
};

export const updateOne = async (_id: ObjectID, obj: Obj): Promise<void> => {
  await accountantModel.updateOne({ _id: _id }, obj);
};
