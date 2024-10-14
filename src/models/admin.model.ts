import mongoose, { Types, Document, Schema } from "mongoose";
import { ObjectID } from "../types/interfaces";
export interface IAdmin extends Document {
  _id: ObjectID;
  email: string;
  password: string;
  deleted_at: Date;
  role_id: ObjectID;
  createdAt: Date;
  updatedAt: Date;
}
const schema: Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    deleted_at: {
      type: Date,
    },
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: "roles" },
  },
  { timestamps: true }
);

schema.method("toJSON", function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __v, _id, ...object } = this.toObject() as any;
  object.id = _id;
  return object;
});

const Admin = mongoose.model<IAdmin>("admin", schema);
export default Admin;
