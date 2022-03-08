import { User } from "../../user/model";
import * as userRepository from "../../user/repository";
import * as passwordUtils from "../../utils/passwordUtils";
import { verifyCallback } from "../passport";

it("verify callback should return no error and user data if user email and password is correct", async () => {
  const savedUserData = <User>{
    id: 1,
    email: "test@test.com",
    fullName: "fullName",
    hash: "hash",
    salt: "salt",
  };
  const userInput = {
    email: "test@test.com",
    password: "password1",
    done: jest.fn(),
  };
  const getUserDataByEmailSpy = jest
    .spyOn(userRepository, "getUserDataByEmail")
    .mockResolvedValue(savedUserData);
  const validPasswordSpy = jest
    .spyOn(passwordUtils, "validPassword")
    .mockReturnValue(true);

  await verifyCallback(userInput.email, userInput.password, userInput.done);
  expect(userInput.done).toBeCalledTimes(1);
  expect(userInput.done).toBeCalledWith(null, savedUserData);
  expect(getUserDataByEmailSpy).toBeCalledTimes(1);
  expect(getUserDataByEmailSpy).toBeCalledWith(userInput.email);
  expect(validPasswordSpy).toBeCalledTimes(1);
  expect(validPasswordSpy).toBeCalledWith(
    userInput.password,
    savedUserData.hash,
    savedUserData.salt
  );
});
it("verify callback should return error if no user in db", async () => {
  const savedUserData = undefined;
  const userInput = {
    email: "test@test.com",
    password: "password1",
    done: jest.fn(),
  };
  const getUserDataByEmailSpy = jest
    .spyOn(userRepository, "getUserDataByEmail")
    .mockResolvedValue(savedUserData);
  const validPasswordSpy = jest
    .spyOn(passwordUtils, "validPassword")
    .mockReturnValue(true);

  await verifyCallback(userInput.email, userInput.password, userInput.done);
  expect(userInput.done).toBeCalledTimes(1);
  expect(userInput.done).toBeCalledWith(null, false);
  expect(getUserDataByEmailSpy).toBeCalledTimes(1);
  expect(getUserDataByEmailSpy).toBeCalledWith(userInput.email);
  expect(validPasswordSpy).toBeCalledTimes(0);
});
it("verify callback should return error if password is not correct", async () => {
  const savedUserData = <User>{
    id: 1,
    email: "test@test.com",
    fullName: "fullName",
    hash: "hash",
    salt: "salt",
  };
  const userInput = {
    email: "test@test.com",
    password: "password1",
    done: jest.fn(),
  };
  const getUserDataByEmailSpy = jest
    .spyOn(userRepository, "getUserDataByEmail")
    .mockResolvedValue(savedUserData);
  const validPasswordSpy = jest
    .spyOn(passwordUtils, "validPassword")
    .mockReturnValue(false);

  await verifyCallback(userInput.email, userInput.password, userInput.done);
  expect(userInput.done).toBeCalledTimes(1);
  expect(userInput.done).toBeCalledWith(null, false);
  expect(getUserDataByEmailSpy).toBeCalledTimes(1);
  expect(getUserDataByEmailSpy).toBeCalledWith(userInput.email);
  expect(validPasswordSpy).toBeCalledTimes(1);
  expect(validPasswordSpy).toBeCalledWith(
    userInput.password,
    savedUserData.hash,
    savedUserData.salt
  );
});
