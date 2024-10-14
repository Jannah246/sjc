import mongoose from "mongoose";
import { ObjectID } from "../types/interfaces";

export interface IInternetPackage extends Document {
  _id: ObjectID;
  package_name: string;
  type: string;
  duration: number;
  volume: number;
  download_bandwidth: number;
  upload_bandwidth: number;
  package_speed: string;
  package_code: string;
  package_status: number;
  deleted_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema(
  {
    package_name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

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

    package_speed: {
      type: String,
      required: true,
    },

    package_code: {
      type: String,
      required: true,
    },

    // 0=delete,1=active,2=pending,3=block
    package_status: {
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

const InternetPackage = mongoose.model<IInternetPackage>(
  "internet_package",
  schema
);
export default InternetPackage;
