import mongoose from "mongoose";
import { ObjectID } from "../types/interfaces";

export interface INationalType extends Document {
  _id: ObjectID;
  name: string;
  status: Number;
  createdAt: Date;
  updatedAt: Date;
  deleted_at: Date;
}

const schema = new mongoose.Schema(
  {
    name: {
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

const NationalType = mongoose.model<INationalType>("national_type", schema);

export default NationalType;
