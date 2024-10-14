/* eslint-disable @typescript-eslint/no-unused-vars */
import cors from "cors";
import express, { Request, Response } from "express";
import expressStatusMonitor from "express-status-monitor";
import Http, { Server } from "http";
import mongoose from "mongoose";
import * as fs from "fs";

import path from "path";
import SourceMapSupport from "source-map-support";

import { getMongoURL } from "./config/db.config";
import { isProd, logger } from "./helpers";
import router from "./routes";
import { CorsOptions } from "./types/interfaces";
import {
  expireClientSubscriptionCron,
  expireInternetPackageCron,
} from "./helpers/cronJob";

const ENV = process.env;
const PORT = ENV.PORT || 3019;

export default async (): Promise<Server | void> => {
  try {
    if (!ENV.NODE_ENV) {
      logger.error("NODE_ENV not found");
      logger.error(
        "Please execute following command: mkdir src/env && cp .env.sample src/env/.env"
      );
      process.exit(101);
    }

    mongoose.set("strictQuery", false);
    await mongoose.connect(getMongoURL(ENV));
    const app = express();
    app.use(expressStatusMonitor());

    SourceMapSupport.install();

    const whitelist = [ENV.CORS_DOMAIN];

    const whitelistQA = [ENV.CORS_DOMAIN];

    const corsOptions: CorsOptions = {
      origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
          callback(null, true);
        } else {
          callback(new Error("UNAUTHORIZED!"));
        }
      },
      credentials: true,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const corsOptionsQA: CorsOptions = {
      origin: (origin, callback) => {
        if (whitelistQA.indexOf(origin) !== -1 || origin === undefined) {
          callback(null, true);
        } else {
          callback(new Error("UNAUTHORIZED!"));
        }
      },

      credentials: true,
    };

    const server = Http.createServer(app);
    server.setTimeout(600000);

    app.use((req, res, next) => {
      res.setTimeout(600000, function () {
        logger.error("Request has timed out.");
        res.status(408).send("Request has timed out.");
      });

      next();
    });

    app.use(cors(isProd() ? corsOptions : { origin: "*" }));

    app.use(express.json({ limit: "2gb" }));
    app.use(express.urlencoded({ limit: "2gb", extended: false }));
    app.use(express.json());
    //app.use('/public', express.static(path.join(__dirname, '../public')));
    app.use("/public", express.static(path.join(__dirname, "../../public")));
    app.use("/", router);
    app.all("*", (req: Request, res: Response) =>
      res.send(
        `Welcome to searchngo APIs in ${process.env.NODE_ENV} environment.`
      )
    );

    // app.use((e, req, res: Response, next) => {
    //   const status = e?.type === Status.UNAUTHORISED || e.name === ErrorTypes.UNAUTHORISED_ERROR ? 401 : e?.status ?? 400;
    //   const message = status === 401 ? 'Please Sign In again!' : e?.message ?? 'Uh Oh! Something went wrong. Please try again later!';
    //   return res.status(status).send(formatResponse(500, false, message, {}));
    // });

    const dir = "./public/uploads/user/profile";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    server.listen(PORT, () =>
      console.log(`Server is live at localhost:${PORT}`)
    );
  } catch (err) {
    logger.debug(`Failed to connect to database. ${err}`);
  }

  //Cron file
  expireInternetPackageCron.start();
  expireClientSubscriptionCron.start();
};
