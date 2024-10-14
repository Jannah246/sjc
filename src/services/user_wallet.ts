import db from "../models";
import { IUserCamp } from "../models/user_camp.model";
import { IUserWallet } from "../models/user_wallet.model";
import { ObjectID } from "../types/interfaces";

const userWalletModel = db.userWalletModel;

export const createWallet = async (obj: IUserWallet): Promise<IUserWallet> => {
  return await userWalletModel.create(obj);
};

export const updateWalletAmount = async (
  id: ObjectID,
  amount: number
): Promise<void> => {
  await userWalletModel.updateOne({ _id: id }, { wallet_amount: amount });
};

export const walletAvailableForUserAndClient = async (
  client_id: string,
  user_id: string
): Promise<IUserWallet | null> => {
  const result = await userWalletModel.findOne({
    user_id: user_id,
    client_id: client_id,
    status: 1,
  });
  return result;
};

export const increaseAmount = async (
  user_Id: string,
  client_id: string,
  amount: number
): Promise<void> => {
  await userWalletModel.updateOne(
    { user_id: user_Id, client_id: client_id, status: 1 },
    { $inc: { wallet_amount: amount } }
  );
};
