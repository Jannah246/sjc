import { Obj } from "../types/interfaces";

export const formatResponse = (
  status: number,
  error: boolean,
  message: string | Obj,
  data: unknown
): Obj => {
  return {
    status: status,
    error: error,
    message: message,
    data: data,
  };
};
