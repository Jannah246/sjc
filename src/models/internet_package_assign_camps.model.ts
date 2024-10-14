import mongoose from "mongoose";
import { ObjectID } from "../types/interfaces";

export interface IInternetPackageAssignCamps extends Document {
  _id: ObjectID;
  package_id: ObjectID;
  camp_id: ObjectID;
  camp_attach_uuid: String;
  status: Number;
  deleted_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema(
  {
    package_id: { type: mongoose.Schema.Types.ObjectId, ref: "clients" },
    camp_id: { type: mongoose.Schema.Types.ObjectId, ref: "internet_packages" },

    camp_attach_uuid: {
      type: String, //auto unique code (16)
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

const InternetPackageAssignClient = mongoose.model<IInternetPackageAssignCamps>(
  "internet_package_assign_camps",
  schema
);
export default InternetPackageAssignClient;
