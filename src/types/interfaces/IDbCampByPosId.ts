import { ICamp } from "../../models/camp.model";
import { ObjectID } from "./db";

export interface IDbCampByPosId {
  campAssignPosId: ObjectID;
  camp_id: ObjectID;
  pos_id: ObjectID;
  camp_category: number;
  status: number;
  camp: ICamp;
}
