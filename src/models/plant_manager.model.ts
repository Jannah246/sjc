import mongoose from "mongoose";
import { ObjectID } from "../types/interfaces";

export interface IPlantManager extends Document {
  _id: ObjectID;
  client_id: ObjectID | null;
  role_id: ObjectID;
  full_name: string;
  email: string;
  password: string;
  location_name: string;
  type: string;
  commission_pct: Number;
  status: Number;
  createdAt: Date;
  updatedAt: Date;
  deleted_at: Date;
}

const schema = new mongoose.Schema(
  {
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "clients" },

    role_id: { type: mongoose.Schema.Types.ObjectId, ref: "roles" },

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

    location_name: {
      type: String,
    },

    type: {
      type: String,
      enum: ["commission", "direct"],
      default: "commission",
      required: true,
    },

    commission_pct: {
      type: Number,
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

const PlantManager = mongoose.model<IPlantManager>("plant_manager", schema);
export default PlantManager;
