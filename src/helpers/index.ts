import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import mongoose, { isValidObjectId } from "mongoose";

import { Env } from "../types/enums";
import { ObjectID } from "../types/interfaces";
import * as fs from "fs/promises";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import dayjs from "dayjs";

export const getEnv = (): string => process.env.NODE_ENV || Env.DEV;
export const isDev = (): boolean => process.env.NODE_ENV !== Env.PROD;
export const isProd = (): boolean => process.env.NODE_ENV === Env.PROD;
export const isStage = (): boolean => process.env.NODE_ENV === Env.STAGE;

export const normalizePort = (val: string): number | string | boolean => {
  const port = parseInt(val, 10);
  return isNaN(port) ? val : port >= 0 ? port : false;
};

export const createObjectId = (id: string): ObjectID =>
  new mongoose.Types.ObjectId(id);

export const generateHash = (password: string): string => {
  return hashSync(password, genSaltSync(8));
};

export const validPassword = (
  inputPassword: string,
  password: string
): boolean => {
  return compareSync(inputPassword, password);
};

export const parseToSimpleObj = (object: Object): any => {
  return JSON.parse(JSON.stringify(object));
};

export const hasDuplicate = (array: any[]): boolean => {
  return new Set(array).size !== array.length;
};

export const checkAllIdValid = (ids: any[]): boolean => {
  for (let index = 0; index < ids.length; index++) {
    const element = ids[index];
    if (!isValidObjectId(element)) {
      return false;
      break;
    }
  }
  return true;
};

export const convertsObjectIds = (ids: any[]): any[] => {
  const newIds = [];
  for (let index = 0; index < ids.length; index++) {
    const element = ids[index];
    newIds.push(createObjectId(element));
  }
  return newIds;
};

export const generateRandomDeviceCode = (): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = process.env.POS_DEVICE_CODE_LENGTH
    ? parseInt(process.env.POS_DEVICE_CODE_LENGTH)
    : 16;
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const generateRandomPackageCode = (): string => {
  const characters = "0123456789";
  const length = process.env.INTERNET_PACKAGE_CODE_LENGTH
    ? parseInt(process.env.INTERNET_PACKAGE_CODE_LENGTH)
    : 16;
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const deleteFile = async (path: string): Promise<void> => {
  try {
    await fs.unlink(path);
  } catch (e) {}
};

export const generateOtp = (): number => {
  const otp = Math.floor(Math.random() * 90000) + 10000;
  return otp;
};

export const sendOtp = async (phoneNumber: string, otp: string) => {
  try {
    if (process.env.NODE_ENV === "development") {
      return true;
    } else {
      const requestBody = {
        uip_head: {
          METHOD: "SMS_SEND_REQUEST",
          SERIAL: 1,
          TIME: dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss"),
          CHANNEL: process.env.OTP_CHANNEL,
          AUTH_KEY: process.env.OTP_AUTH_KEY,
        },
        uip_body: {
          uip_version: 2,
          SMS_CONTENT: `Hello! Your verification code is ${otp}. Please enter this code to proceed. Note: This code will expire in 10 minutes.`,
          DESTINATION_ADDR: [phoneNumber],
          ORIGINAL_ADDR: "WL-SMS",
        },
      };

      const config: AxiosRequestConfig = {
        method: "post",
        url: process.env.OTP_URL,
        headers: {
          "Content-Type": "application/json",
        },
        data: requestBody,
      };

      console.log(requestBody);
      const { data }: AxiosResponse = await axios(config);
      console.log(data);
      if (data.uip_head.RESULT_CODE === 1) {
        return data;
      } else {
        console.log(data.uip_head.RESULT_DESC);
        throw new Error("OTP not sended.");
      }
    }
  } catch (e) {
    throw e;
  }
};

export const minuteInMilleSeconds = (minute: number): number => {
  return minute * 60 * 1000;
};

export const minutesToDay = (minutes: number): number => {
  return minutes / 1440;
};

export const dayToMinutes = (day: number): number => {
  return day * 1440;
};

export const userDir = "./public/uploads/user/profile/";

export const IMAGE_SUPPORTED_FORMATS = ["image/png", "image/jpg", "image/jpeg"];

export const getUrlOfProfileImage = (name: string): string => {
  return process.env.BASE_URL + `/public/uploads/user/profile/` + name;
};
export const getUrlForMongodb =
  process.env.BASE_URL + `/public/uploads/user/profile/`;

export const MAX_DAY = 3650;
export const MAX_KB = 2147483647;

export * from "./format-response";
export * from "./logger";
export * from "./message";
