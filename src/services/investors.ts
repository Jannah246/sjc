import { createObjectId, generateHash } from "../helpers";
import db from "../models";
import { IInvestors } from "../models/investors.model";
import { Obj, ObjectID } from "../types/interfaces";

const investorsModel = db.investorsModel;

export const createInvestor = async (
  role_id: ObjectID,
  investor: Obj
): Promise<IInvestors | null> => {
  const investorData = investor as IInvestors;
  investorData.role_id = role_id;
  investorData.status = 1;
  investorData.password = generateHash(investorData.password);
  return await investorsModel.create(investorData);
};

export const checkEmail = async (
  email: string,
  id?: string
): Promise<IInvestors | null> => {
  const filter: Obj = {
    email: email,
    status: {
      $ne: 0,
    },
  };

  if (id) {
    filter._id = { $ne: createObjectId(id) };
  }

  return await investorsModel.findOne(filter);
};

export const getInvestorById = async (
  id: string,
  client_id: string
): Promise<IInvestors | null> => {
  return await investorsModel.findOne(
    { _id: id, client_id: client_id, status: 1 },
    { password: 0 }
  );
};

export const getInvestorByIdWithoutStatus = async (
  id: string,
  client_id: string
): Promise<IInvestors | null> => {
  return await investorsModel.findOne({ _id: id, client_id: client_id });
};

export const getAllInvestors = async (
  filter: Obj
): Promise<IInvestors[] | []> => {
  const results = await investorsModel.find(filter, { password: 0 });
  return results;
};

export const updateInvestor = async (
  id: string,
  investor: Obj
): Promise<void> => {
  const investorData = investor as IInvestors;
  investorData.password = generateHash(investorData.password);
  await investorsModel.updateOne({ _id: id }, investorData);
  return;
};

export const updateStatus = async (
  id: string,
  status: number
): Promise<void> => {
  await investorsModel.updateOne({ _id: id }, { status: status });
  return;
};

export const getInvestorByEmail = async (
  email: string
): Promise<IInvestors | null> => {
  const result = await investorsModel.findOne({ email: email, status: 1 });
  return result;
};

export const getInvestorByIdWithPassword = async (
  id: string,
  client_id: string
): Promise<IInvestors | null> => {
  return await investorsModel.findOne({
    _id: id,
    client_id: client_id,
    status: 1,
  });
};

export const updateOne = async (_id: ObjectID, obj: Obj): Promise<void> => {
  await investorsModel.updateOne({ _id: _id }, obj);
};
