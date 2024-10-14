import mongoose from "mongoose";
import { ObjectID } from "../types/interfaces";

export interface IRole extends Document {
  _id: ObjectID;
  name: string;
  slug: string;
  deleted_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    deleted_at: Date,
  },
  { timestamps: true }
);

schema.method("toJSON", function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __v, _id, ...object } = this.toObject() as any;
  object.id = _id;

  return object;
});

const Role = mongoose.model<IRole>("role", schema);
export default Role;
