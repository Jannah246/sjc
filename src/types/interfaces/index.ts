/* eslint-disable @typescript-eslint/no-explicit-any */
type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[];

type CustomOrigin = (
  requestOrigin: string | undefined,
  callback: (err: Error | null, origin?: StaticOrigin) => void
) => void;

export type CorsOptions = {
  credentials: boolean;
  origin: StaticOrigin | CustomOrigin;
};

export type Obj<T = any> = Record<string, T>;

export * from "./db";
