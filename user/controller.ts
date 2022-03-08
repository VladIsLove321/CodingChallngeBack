import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { User } from "./model";
import * as UserService from "./service";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fullName, email, password } = req.body;
  await UserService.registerUser({
    fullName,
    email,
    password,
  });
  authenticate(req, res, next);
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  authenticate(req, res, next);
};

export const logoutUser = async (req: Request, res: Response) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      throw err;
    }
    res.clearCookie(process.env.COOKIE_NAME!);
    res.status(200).send();
  });
};

export const getUserPublicData = async (req: Request, res: Response) => {
  const id = req.session.passport.user;
  try {
    const userData = await UserService.getUserPublicData(id);
    res.send({ user: userData });
  } catch (error) {}
};

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("local", function (err, user: User) {
    if (err) {
      throw err;
    }
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "authentication failed" });
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        throw loginErr;
      }
      return res.send({
        user: UserService.extractUserPublicData(user),
        success: true,
        message: "authentication succeeded",
      });
    });
  })(req, res, next);
};
