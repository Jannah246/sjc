import mongoose, { Types, Document, Schema } from "mongoose";
import { Obj, ObjectID } from "../types/interfaces";
export interface IUserRecharge extends Document {
  _id: ObjectID;
  user_id: ObjectID;
  created_by: ObjectID;
  created_by_type: string;
  role_id: ObjectID;
  camp_id: ObjectID;
  client_id: ObjectID;
  type: string;
  recharge_amount: number;
  service_amount: number;
  payable_amount: number;
  status: number;
  transaction_id: string;
  createdAt: Date;
  updatedAt: Date;
  refund_details: Obj;
}
const schema: Schema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "pos" },

    created_by_type: {
      type: String,
      required: true,
    },

    role_id: { type: mongoose.Schema.Types.ObjectId, ref: "role" },

    camp_id: { type: mongoose.Schema.Types.ObjectId, ref: "camp" },

    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "client" },

    type: {
      type: String,
      required: true,
      default: 0,
    },
    recharge_amount: {
      type: Number,
      required: true,
    },
    service_amount: {
      type: Number,
      required: true,
    },
    payable_amount: {
      type: Number,
      required: true,
    },
    // 0=delete,1=active,2=pending,3=block
    status: {
      type: Number,
      enum: [0, 1, 2, 3],
      required: true,
    },
    transaction_id: {
      type: String,
      required: true,
    },

    refund_details: {
      type: mongoose.Schema.Types.Mixed,
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

const UserRecharge = mongoose.model<IUserRecharge>("user_recharge", schema);
export default UserRecharge;
