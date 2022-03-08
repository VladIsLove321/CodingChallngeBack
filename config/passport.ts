import { Strategy } from "passport-local";
import { User } from "../user/model";
import { getUserDataByEmail, getUserDataById } from "../user/repository";
import { extractUserPublicData } from "../user/service";
import { validPassword } from "../utils/passwordUtils";

type PassportCB = (err: any, user?: Express.User | false | null) => void;

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

export const verifyCallback = async (
  email: string,
  password: string,
  done: PassportCB
) => {
  try {
    const user = await getUserDataByEmail(email);
    if (!user) {
      return done(null, false);
    }
    const isValid = validPassword(password, user.hash, user.salt);

    if (isValid) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error);
  }
};

export const serializeUser = (user: User, done: PassportCB) => {
  done(null, user.id);
};

export const deserializeUser = async (userId: string, done: PassportCB) => {
  try {
    const user = await getUserDataById(userId);
    done(null, user);
  } catch (error) {
    done(error);
  }
};

export const strategy = new Strategy(customFields, verifyCallback);
