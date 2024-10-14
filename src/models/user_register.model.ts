import mongoose, { Types } from "mongoose";
import { ObjectID } from "../types/interfaces";
export interface IUser extends Document {
  _id: ObjectID;
  client_id: ObjectID;
  username: string;
  name: string;
  email: string;
  password: string;
  country_code: number;
  phone: string;
  age: number;
  gender: string;
  country_id: ObjectID;
  home_address: string;
  blood_group: string;
  company_name: string;
  job_title: string;
  passport_no: string;
  uuid: string;
  driver_licence_no: string;
  visa_number: string;
  national_id_type: ObjectID;
  national_id: string;
  user_image: string;
  passport_image: string;
  building_no: string;
  room_no: string;
  api_token: string;
  created_by: ObjectID;
  status: number;
  otp: number;
  has_transfer_request: number;
  wallet_balance: number;
  block: string;
  block_building: string;
  floor_no: string;
  device_mac_id: string;
  new_phone: string;
  createdAt: Date;
  updatedAt: Date;
  is_new_user: boolean;
}

const schema = new mongoose.Schema(
  {
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "client" },
    user_name: {
      default: "",
      type: String,
    },
    name: {
      default: "",
      type: String,
    },
    email: {
      default: "",
      type: String,
    },
    password: {
      default: "",
      type: String,
    },
    country_code: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      default: 0,
      type: Number,
    },
    gender: {
      default: "",
      type: String,
    },

    country_id: { type: mongoose.Schema.Types.ObjectId, ref: "countries" },

    home_address: {
      default: "",
      type: String,
    },
    blood_group: {
      default: "",
      type: String,
    },
    company_name: {
      default: "",
      type: String,
    },
    job_title: {
      default: "",
      type: String,
    },
    passport_no: {
      default: "",
      type: String,
    },
    uuid: {
      default: "",
      type: String,
    },
    driver_licence_no: {
      default: "",
      type: String,
    },
    visa_number: {
      default: "",
      type: String,
    },
    national_id_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "national_type",
    },

    national_id: {
      default: "",
      type: String,
    },
    user_image: {
      default: "",
      type: String,
    },
    passport_image: {
      default: "",
      type: String,
    },
    building_no: {
      default: "",
      type: String,
    },
    room_no: {
      default: "",
      type: String,
    },
    api_token: {
      default: "",
      type: String,
    },

    created_by: { type: mongoose.Schema.Types.ObjectId },

    // 0=delete,1=active,2=pending,3=block,4=deActive,5=Unverified
    status: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      required: true,
    },
    otp: {
      type: Number,
    },
    has_transfer_request: {
      type: Number,
      default: 0,
      required: true,
    },
    wallet_balance: {
      default: 0.0,
      type: Number,
    },
    block: {
      default: "",
      type: String,
    },
    block_building: {
      default: "",
      type: String,
    },
    floor_no: {
      default: "",
      type: String,
    },
    device_mac_id: {
      default: "",
      type: String,
    },
    new_phone: {
      default: "0",
      type: String,
    },
    is_new_user: {
      default: "",
      type: Boolean,
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

const UserRegister = mongoose.model<IUser>("user_register", schema);
export default UserRegister;
