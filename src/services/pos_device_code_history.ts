import db from "../models";
import { IPosDeviceCode } from "../models/pos_device_code.model";
import { IPosDeviceCodeHistory } from "../models/pos_device_code_history.model";
import { Obj, ObjectID } from "../types/interfaces";

const posDeviceCodeHistoryModel = db.posDeviceCodeHistoryModel;

export const createPosDeviceHistory = async (
  deviceCodeId: ObjectID,
  deviceCodeHistoryObj: Obj
): Promise<IPosDeviceCodeHistory> => {
  const posDeviceCodeHistory = deviceCodeHistoryObj as IPosDeviceCodeHistory;
  posDeviceCodeHistory.pos_dc_id = deviceCodeId;
  posDeviceCodeHistory.code_status = 1;
  const result = await posDeviceCodeHistoryModel.create(posDeviceCodeHistory);
  return result;
};

export const deactivatePosDeviceCodeHistory = async (
  id: ObjectID
): Promise<void> => {
  await posDeviceCodeHistoryModel.updateOne({ _id: id }, { code_status: 3 });
};

export const getDeviceCodeHistory = async (
  deviceCodeId: ObjectID
): Promise<IPosDeviceCodeHistory | null> => {
  const result = await posDeviceCodeHistoryModel.findOne({
    pos_dc_id: deviceCodeId,
    code_status: 1,
  });
  return result;
};

export const getDeviceByMacAddress = async (
  mac: string
): Promise<IPosDeviceCodeHistory | null> => {
  const result = await posDeviceCodeHistoryModel.findOne({
    device_mac_address: mac,
    code_status: 1,
  });
  return result;
};
