import db from "../models";
import { ICampAssignPosDevice } from "../models/camp_assign_pos_device.model";
import { Obj } from "../types/interfaces";

const campAssignPosDeviceModel = db.campAssignPosDeviceModel;

export const isCampAssignToDeviceModel = async (
  poc_dc_id: string,
  camp_id: string
): Promise<ICampAssignPosDevice | null> => {
  const result = await campAssignPosDeviceModel.findOne({
    pos_dc_id: poc_dc_id,
    camp_id: camp_id,
    status: 1,
  });
  return result;
};

export const assignCampToDeviceCode = async (
  obj: Obj
): Promise<ICampAssignPosDevice> => {
  const result = await campAssignPosDeviceModel.create(obj);
  return result;
};
