import mongoose, { Types, Document, Schema } from "mongoose";
import { ObjectID } from "../types/interfaces";
export interface IUserCamp extends Document {
  _id: ObjectID;
  user_id: ObjectID;
  camp_id: ObjectID;
  client_id: ObjectID;
  created_by: ObjectID;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}
const schema: Schema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    camp_id: { type: mongoose.Schema.Types.ObjectId, ref: "camp" },
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "client" },
    created_by: { type: mongoose.Schema.Types.ObjectId },
    // 0=delete,1=assign,2=unAssign ,3=Pending
    status: {
      type: Number,
      enum: [0, 1, 2, 3],
      required: true,
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

const userCamp = mongoose.model<IUserCamp>("user_camp", schema);
export default userCamp;
