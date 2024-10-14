import { IInternetPackage } from "../../models/internet_package.model";
import { ObjectID } from "./db";

interface IClient {
  full_name: String;
  email: String;
  password: string;
  business_name: String;
  phone: String;
  business_address: String;
  city: String;
  country: String;
}

export interface IDbAssignedClientPackage {
  _id: ObjectID;
  client_id: ObjectID;
  internet_package_id: ObjectID;
  attached_uuid: String;
  deleted_at: Date;
  createdAt: Date;
  updatedAt: Date;
  internet_package: IInternetPackage;
  client: IClient;
}
