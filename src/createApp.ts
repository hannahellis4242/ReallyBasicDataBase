import express, { Express, Handler, json } from "express";
import router from "./routes/router";
import { BAD_REQUEST } from "http-status";

const jsonBodyParser: Handler = (req, res, next) => {
  json()(req, res, (err) => {
    if (err) {
      return res.sendStatus(BAD_REQUEST); // Bad request
    }
    next();
  });
};

const createApp = async (): Promise<Express> => {
  const app = express();
  app.use(jsonBodyParser);

  app.use(await router());

  return app;
};

export default createApp;
