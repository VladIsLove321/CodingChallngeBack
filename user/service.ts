import { genPassword } from "../utils/passwordUtils";
import { User } from "./model";
import * as UserRepository from "./repository";

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

interface UserPublic {
  fullName: string;
}

export const registerUser = async (data: RegisterData): Promise<UserPublic> => {
  const { fullName, email, password } = data;
  const { salt, hash } = genPassword(password);
  const userData = await UserRepository.saveNewUser({
    email,
    fullName,
    salt,
    hash,
  });
  return extractUserPublicData(userData);
};

export const getUserPublicData = async (
  userId: string
): Promise<UserPublic | undefined> => {
  let userData = await UserRepository.getUserDataById(userId);
  if (!userData) {
    return undefined;
  }
  return extractUserPublicData(userData);
};

export const extractUserPublicData = (userData: User): UserPublic => {
  return { fullName: userData?.fullName };
};
