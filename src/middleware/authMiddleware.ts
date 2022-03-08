import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../utils/errors/notAuthorizedError";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    throw new NotAuthorizedError();
  }
};
