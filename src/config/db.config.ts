import { isDev, isProd, logger } from "../helpers";

export const getMongoURL = (env: NodeJS.ProcessEnv): string => {
  const MONGO_URL =
    env.MONGO_URL || isProd()
      ? env.MONGO_URL
      : "mongodb://localhost:27017/searchngo";
  if (!MONGO_URL) {
    logger.error("Please provide mongo-url");
    process.exit(1);
  }

  if (isDev()) {
    logger.info(`Mongodb URL: ${MONGO_URL}`);
  }

  return MONGO_URL;
};
