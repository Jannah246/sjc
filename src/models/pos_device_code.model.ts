import mongoose, { Types, Document, Schema } from "mongoose";
import { ObjectID } from "../types/interfaces";
export interface IPosDeviceCode extends Document {
  _id: ObjectID;
  pos_device_code: string;
  client_id: ObjectID;
  is_used: Number;
  status: Number;
  deleted_at: Date;
  createdAt: Date;
  updatedAt: Date;
}
const schema: Schema = new mongoose.Schema(
  {
    pos_device_code: {
      type: String,
      required: true,
    },

    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "client" },

    //1 =used, 0 =not used
    is_used: {
      type: Number,
      enum: [0, 1],
      required: true,
      default: 0,
    },

    // 0=delete,1=active,2=pending,3=block
    status: {
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

const PosDeviceCode = mongoose.model<IPosDeviceCode>("pos_device_code", schema);
export default PosDeviceCode;
