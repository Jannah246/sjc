import mongoose, { Types, Document, Schema } from "mongoose";
import { ObjectID } from "../types/interfaces";
import { string } from "joi";
export interface IOrderInternetPackage extends Document {
  _id: ObjectID;
  order_number: string;
  user_id: ObjectID;
  package_id: ObjectID;
  package_name: string;
  package_code: string;
  package_speed: string;
  package_amount: number;
  duration: number;
  volume: number;
  download_bandwidth: number;
  upload_bandwidth: number;
  package_type: string;
  package_expiry_date: Date | null;
  purchase_date: Date;
  package_start_date: Date | null;
  expired_on: Date;
  tax_amount: number;
  sub_total: number;
  payable_amount: number;
  order_status: number;
  created_by: ObjectID;
  created_by_type: string;
  camp_id: ObjectID;
  createdAt: Date;
  updatedAt: Date;
}
const schema: Schema = new mongoose.Schema(
  {
    order_number: {
      type: String,
      required: true,
    },

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

    package_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "internet_package_client",
    },

    package_name: {
      type: String,
      required: true,
    },

    package_code: {
      type: String,
      required: true,
    },

    package_speed: {
      type: String,
      required: true,
    },

    package_amount: {
      type: Number,
      required: true,
    },

    //Duration in minutes
    duration: {
      type: Number,
      required: true,
    },

    volume: {
      type: Number,
      required: true,
    },

    download_bandwidth: {
      type: Number,
      required: true,
      default: 0,
    },

    upload_bandwidth: {
      type: Number,
      required: true,
      default: 0,
    },

    package_type: {
      type: String,
      required: true,
    },

    package_expiry_date: {
      type: Date,
    },

    purchase_date: {
      type: Date,
      required: true,
    },

    package_start_date: {
      type: Date,
    },

    expired_on: {
      type: Date,
    },

    tax_amount: {
      default: 0,
      type: Number,
      required: true,
    },

    sub_total: {
      type: Number,
      required: true,
    },

    payable_amount: {
      type: Number,
      required: true,
    },

    //1=active,2=pending,3=expired
    order_status: {
      type: Number,
      enum: [0, 1, 2, 3],
      required: true,
    },

    created_by: { type: mongoose.Schema.Types.ObjectId },

    created_by_type: {
      type: String,
      required: true,
    },

    camp_id: { type: mongoose.Schema.Types.ObjectId },
  },

  { timestamps: true }
);

schema.method("toJSON", function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __v, _id, ...object } = this.toObject() as any;
  object.id = _id;
  return object;
});

const orderInternetPackage = mongoose.model<IOrderInternetPackage>(
  "order_internet_package",
  schema
);
export default orderInternetPackage;
