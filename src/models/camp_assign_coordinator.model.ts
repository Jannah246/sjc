import mongoose, { Document, Schema } from "mongoose";
import { ObjectID } from "../types/interfaces";
export interface ICampAssignCoordinator extends Document {
  _id: ObjectID;
  camp_id: ObjectID;
  coordinator_id: ObjectID;
  status: Number;
  deleted_at: Date;
  createdAt: Date;
  updatedAt: Date;
}
const schema: Schema = new mongoose.Schema(
  {
    camp_id: { type: mongoose.Schema.Types.ObjectId, ref: "camp" },

    coordinator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coordinator",
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

const CampAssignCoordinator = mongoose.model<ICampAssignCoordinator>(
  "cam_assign_coordinator",
  schema
);
export default CampAssignCoordinator;
