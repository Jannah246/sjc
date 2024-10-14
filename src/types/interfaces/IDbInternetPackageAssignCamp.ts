import { ICamp } from "../../models/camp.model";
import { IInternetPackage } from "../../models/internet_package.model";
import { ObjectID } from "./db";

export interface InternetPackageClient {
  _id: ObjectID;
  client_id: ObjectID;
  internet_package_id: ObjectID;
  package_name: string;
  package_code: string;
  package_speed: string;
  package_price: number;
  package_status: number;
  deleted_at: Date;
  createdAt: Date;
  updatedAt: Date;
  internet_package: IInternetPackage;
}
export interface IDbInternetPackageAssignCamp {
  _id: ObjectID;
  package_id: ObjectID;
  camp_id: ObjectID;
  camp_attach_uuid: String;
  status: Number;
  deleted_at: Date;
  createdAt: Date;
  updatedAt: Date;
  internet_package_client: InternetPackageClient;
  camp: ICamp;
}
