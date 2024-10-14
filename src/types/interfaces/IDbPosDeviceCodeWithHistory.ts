import { ObjectID } from "./db";

interface IPosDeviceCodeHistory {
  _id: ObjectID;
  pos_dc_id: ObjectID;
  device_name: string;
  device_model: string;
  device_mac_address: string;
  code_status: string;
  deleted_at: Date;
  createdAt: Date;
  updatedAt: Date;
  length: string;
}

export interface IDbPosDeviceCodeWithHistory {
  _id: ObjectID;
  is_used: Number;
  client_id: ObjectID;
  status: Number;
  pos_device_code: string;
  deleted_at: Date;
  createdAt: Date;
  updatedAt: Date;
  pos_device_code_history: IPosDeviceCodeHistory;
}
