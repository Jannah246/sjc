import mongoose, { Types, Document, Schema } from "mongoose";
import { ObjectID } from "../types/interfaces";
export interface IPos extends Document {
  _id: ObjectID;
  client_id: ObjectID;
  role_id: ObjectID;
  full_name: string;
  email: string;
  password: string;
  ip_mac: string;
  status: Number;
  deleted_at: Date;
  createdAt: Date;
  updatedAt: Date;
}
const schema: Schema = new mongoose.Schema(
  {
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "client" },
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: "roles" },
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    ip_mac: {
      type: String,
      required: true,
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

const Pos = mongoose.model<IPos>("pos", schema);
export default Pos;
