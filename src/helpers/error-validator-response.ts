import { Obj } from "../types/interfaces";

export const errorValidatorResponse = (details: Obj) => {
  const validationObject: Obj = {};
  for (let index = 0; index < details.length; index++) {
    const v = details[index];
    validationObject[v.path[0]] = v.message.replace(/"/g, "");
  }
  return validationObject;
};
