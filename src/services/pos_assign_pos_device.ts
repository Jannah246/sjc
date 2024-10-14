import db from "../models";
import { ICampAssignPosDevice } from "../models/camp_assign_pos_device.model";
import { IPosAssignPosDevice } from "../models/pos_assign_pos_device.model";
import { Obj } from "../types/interfaces";

const posAssignPosDeviceModel = db.posAssignPosDeviceModel;

export const isPosAssignToDeviceModel = async (
  poc_dc_id: string,
  pos_id: string
): Promise<IPosAssignPosDevice | null> => {
  const result = await posAssignPosDeviceModel.findOne({
    pos_dc_id: poc_dc_id,
    pos_id: pos_id,
    status: 1,
  });
  return result;
};

export const assignPosToDeviceCode = async (
  obj: Obj
): Promise<IPosAssignPosDevice> => {
  const result = await posAssignPosDeviceModel.create(obj);
  return result;
};
