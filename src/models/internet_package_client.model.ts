import mongoose from "mongoose";
import { ObjectID } from "../types/interfaces";

export interface IInternetPackageClient extends Document {
  _id: ObjectID;
  client_id: ObjectID;
  internet_package_id: ObjectID;
  package_name: string;
  package_code: string;
  package_speed: string;
  package_price: Number;
  package_status: Number;
  deleted_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema(
  {
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "clients" },
    internet_package_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "internet_packages",
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

    package_price: {
      type: Number,
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

const InternetPackageClient = mongoose.model<IInternetPackageClient>(
  "internet_package_client",
  schema
);
export default InternetPackageClient;
