import { NextFunction, Request, Response } from "express";
import logger from "./logger";
import jwt from "jsonwebtoken";
import config from "./config";

const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (
  error: { name: string; message: string },
  request: Request,
  response: Response,
  next: NextFunction
) => {
  logger.error(error.message);

  logger.error(error.name);
  if (error.name === "CastError") {
    response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    response
      .status(400)
      .json({ error: "expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    response.status(401).json({ error: "invalid token" });
  } else if (error.name === "TokenExpiredError") {
    response.status(401).json({ error: "invalid token" });
  }

  next(error);
};


export const withUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req;
    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ error: "missing token" });
    } else {
      const decodedToken = jwt.verify(token, config.JWT_SECRET);
      const csrfToken = req.headers["X-CSRF-Token"];
      if (
        typeof decodedToken === "object" &&
        decodedToken.id &&
        decodedToken.csrf == csrfToken
      ) {
        authReq.userId = decodedToken.id;
        next();
      } else {
        res.status(401).json({ error: "invalid token" });
      }
    }
  } catch (error) {
    res.status(401).json({ error: "invalid token" });
  }
};

export default { requestLogger, unknownEndpoint, errorHandler };