import mongoose, { Types, Document, Schema } from "mongoose";
import { ObjectID } from "../types/interfaces";
export interface IPosDeviceCodeHistory extends Document {
  _id: ObjectID;
  pos_dc_id: ObjectID;
  device_name: string;
  device_model: string;
  device_mac_address: string;
  code_status: Number;
  deleted_at: Date;
  createdAt: Date;
  updatedAt: Date;
}
const schema: Schema = new mongoose.Schema(
  {
    pos_dc_id: { type: mongoose.Schema.Types.ObjectId, ref: "pos_device_code" },

    device_name: {
      type: String,
      required: true,
    },

    device_model: {
      type: String,
      required: true,
    },

    device_mac_address: {
      type: String,
      required: true,
    },

    // 0=delete,1=active,2=pending ,3=InActive
    code_status: {
      type: Number,
      enum: [0, 1, 2, 3],
      required: true,
    },

    deleted_at: {
      type: Date,
    },
  },
  { timestamps: true }
);

schema.method("toJSON", function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __v, _id, ...object } = this.toObject() as any;
  object.id = _id;
  return object;
});

const PosDeviceCodeHistory = mongoose.model<IPosDeviceCodeHistory>(
  "pos_device_code_history",
  schema
);
export default PosDeviceCodeHistory;
