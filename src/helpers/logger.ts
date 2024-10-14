import winston from "winston";

import { Env } from "../types/enums";

const customFormatter = winston.format((info) => {
  if (info instanceof Error) {
    const data =
      info.stack
        ?.toString()
        .replace(/Error: /gi, "")
        .replace(/\s+/gi, " ")
        .replace(/\n/gi, "") || {};
    info.message = data.toString();
    return info;
  }

  return info;
});

const formatter = (): winston.Logform.Format => {
  return winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize(),
    customFormatter(),
    winston.format.simple()
  );
};

export const logger = winston.createLogger({
  level: "debug",
  format: formatter(),
  transports: [new winston.transports.Console()],
});

if (process.env.NODE_ENV === Env.PROD || process.env.NODE_ENV === Env.STAGE) {
  const prodConfig = new winston.transports.Console({
    format: formatter(),
    level: "warn",
  });

  logger.add(prodConfig);
}
