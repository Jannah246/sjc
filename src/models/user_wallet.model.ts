import mongoose, { Document, Schema } from "mongoose";
import { ObjectID } from "../types/interfaces";
export interface IUserWallet extends Document {
  _id: ObjectID;
  user_id: ObjectID;
  client_id: ObjectID;
  wallet_amount: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}
const schema: Schema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "client" },

    wallet_amount: {
      type: Number,
      required: true,
    },

    // 0=delete,1=active,2=pending,3=block
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

const userWallet = mongoose.model<IUserWallet>("user_wallet", schema);
export default userWallet;
