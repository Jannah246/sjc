import db from "../models";
import { IUserRecharge } from "../models/user_recharge.model";

const userRechargeModel = db.userRechargeModel;

export const createUserRecharge = async (
  obj: IUserRecharge
): Promise<IUserRecharge> => {
  return await userRechargeModel.create(obj);
};

export const getRechargeHistoryByUserId = async (
  id: string,
  status?: string
): Promise<IUserRecharge[] | []> => {
  const filter = {
    user_id: id,
    status: status
      ? parseInt(status)
      : {
          $ne: 0,
        },
  };
  const result = await userRechargeModel.find(filter);
  return result;
};
