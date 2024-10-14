import mongoose from "mongoose";
import { ObjectID } from "../types/interfaces";

export interface IInvestors extends Document {
  _id: ObjectID;
  role_id: ObjectID;
  client_id: ObjectID | null;
  full_name: string;
  email: string;
  password: string;
  status: Number;
  deleted_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema(
  {
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: "roles" },
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "clients" },

    full_name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
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

const IInvestors = mongoose.model<IInvestors>("investors", schema);
export default IInvestors;
