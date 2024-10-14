import { IInternetPackage } from "../../models/internet_package.model";
import { ObjectID } from "./db";

export interface IDbInternetPackageAssignClient {
  _id: ObjectID;
  client_id: ObjectID;
  internet_package_id: ObjectID;
  attached_uuid: String;
  deleted_at: Date;
  createdAt: Date;
  updatedAt: Date;
  internet_package: IInternetPackage;
}
