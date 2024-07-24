import { ErrorRequestHandler } from "express";
import { logger } from "../loggers/logger";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.log("error", err.message);
  res.status(500).send("Internal Server Error");
};
