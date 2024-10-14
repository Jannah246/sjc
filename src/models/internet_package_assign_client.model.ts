import mongoose from "mongoose";
import { ObjectID } from "../types/interfaces";

export interface IInternetPackageAssignClient extends Document {
  _id: ObjectID;
  client_id: ObjectID;
  internet_package_id: ObjectID;
  attached_uuid: String;
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
    attached_uuid: {
      type: String, //auto unique code (16)
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

const InternetPackageAssignClient =
  mongoose.model<IInternetPackageAssignClient>(
    "internet_package_assign_client",
    schema
  );
export default InternetPackageAssignClient;
