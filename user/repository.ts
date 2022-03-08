import { getRepository, QueryFailedError } from "typeorm";
import { BadRequestError } from "../utils/errors/badRequestError";
import { User } from "./model";

export const saveNewUser = async (
  userData: Omit<User, "id">
): Promise<User> => {
  try {
    const { email, fullName, salt, hash } = userData;
    const newUser = new User();
    newUser.email = email;
    newUser.fullName = fullName;
    newUser.salt = salt;
    newUser.hash = hash;
    let userRepository = getRepository(User);
    let user = await userRepository.save(newUser);
    return user;
  } catch (err: any) {
    if (err.code === "23505") {
      throw new BadRequestError("Email in use");
    } else {
      throw err;
    }
  }
};

export const getUserDataById = async (
  userId: string
): Promise<User | undefined> => {
  let userRepository = getRepository(User);
  return await userRepository.findOne(userId);
};

export const getUserDataByEmail = async (
  email: string
): Promise<User | undefined> => {
  let userRepository = getRepository(User);
  return await userRepository.findOne({ email: email });
};
