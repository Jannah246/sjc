import db from "../models";
import { IRole } from "../models/role.model";
import { ObjectID } from "../types/interfaces";

const roleModel = db.roleModel;

export const getRoleById = async (_id: ObjectID): Promise<IRole | null> => {
  const result = await roleModel.findById(_id);
  return result;
};

export const getRoleBySlug = async (slug: string): Promise<IRole | null> => {
  const result = await roleModel.findOne({ slug: slug });
  return result;
};
