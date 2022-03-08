import request from "supertest";
import { app } from "../../../app";
import { User } from "../model";
import * as userRepository from "../repository";
import * as passwordUtils from "../../utils/passwordUtils";

it("register route returns 200 on success and authorize user", async () => {
  const savedUserData = <User>{
    id: 1,
    email: "test@test.com",
    fullName: "fullName",
    hash: "hash",
    salt: "salt",
  };
  const userInput = {
    email: "test@test.com",
    fullName: "fullName",
    password: "password1",
  };
  const saveNewUserSpy = jest
    .spyOn(userRepository, "saveNewUser")
    .mockResolvedValue(savedUserData);
  const genPasswordSpy = jest
    .spyOn(passwordUtils, "genPassword")
    .mockReturnValue({
      hash: "hash",
      salt: "salt",
    });
  jest
    .spyOn(userRepository, "getUserDataByEmail")
    .mockResolvedValue(savedUserData);
  jest.spyOn(passwordUtils, "validPassword").mockReturnValue(true);

  await request(app).post("/api/register").send(userInput).expect(200);
  expect(saveNewUserSpy).toBeCalledTimes(1);
  expect(saveNewUserSpy).toBeCalledWith({
    email: "test@test.com",
    fullName: "fullName",
    hash: "hash",
    salt: "salt",
  });
  expect(genPasswordSpy).toBeCalledTimes(1);
  expect(genPasswordSpy).toBeCalledWith(userInput.password);
});

it("register route returns 400 and err message if password is less than 8 char, user should not be saved", async () => {
  const savedUserData = <User>{
    id: 1,
    email: "test@test.com",
    fullName: "fullName",
    hash: "hash",
    salt: "salt",
  };
  const userInput = {
    email: "test@test.com",
    fullName: "fullName",
    password: "pass1",
  };
  const saveNewUserSpy = jest
    .spyOn(userRepository, "saveNewUser")
    .mockResolvedValue(savedUserData);
  const genPasswordSpy = jest
    .spyOn(passwordUtils, "genPassword")
    .mockReturnValue({
      hash: "hash",
      salt: "salt",
    });

  const res = await request(app)
    .post("/api/register")
    .send(userInput)
    .expect(400);
  expect(res.body).toEqual({
    errors: [{ message: "Password must be at leat 8 char", field: "password" }],
  });
  expect(saveNewUserSpy).toBeCalledTimes(0);
  expect(genPasswordSpy).toBeCalledTimes(0);
});

it("register route returns 400 and err message if password doesn't have char in it, user should not be saved", async () => {
  const savedUserData = <User>{
    id: 1,
    email: "test@test.com",
    fullName: "fullName",
    hash: "hash",
    salt: "salt",
  };
  const userInput = {
    email: "test@test.com",
    fullName: "fullName",
    password: "123456789",
  };
  const saveNewUserSpy = jest
    .spyOn(userRepository, "saveNewUser")
    .mockResolvedValue(savedUserData);
  const genPasswordSpy = jest
    .spyOn(passwordUtils, "genPassword")
    .mockReturnValue({
      hash: "hash",
      salt: "salt",
    });

  const res = await request(app)
    .post("/api/register")
    .send(userInput)
    .expect(400);
  expect(res.body).toEqual({
    errors: [
      { message: "Password must contain a character", field: "password" },
    ],
  });
  expect(saveNewUserSpy).toBeCalledTimes(0);
  expect(genPasswordSpy).toBeCalledTimes(0);
});

it("register route returns 400 and err message if password doesn't have number in it, user should not be saved", async () => {
  const savedUserData = <User>{
    id: 1,
    email: "test@test.com",
    fullName: "fullName",
    hash: "hash",
    salt: "salt",
  };
  const userInput = {
    email: "test@test.com",
    fullName: "fullName",
    password: "password",
  };
  const saveNewUserSpy = jest
    .spyOn(userRepository, "saveNewUser")
    .mockResolvedValue(savedUserData);
  const genPasswordSpy = jest
    .spyOn(passwordUtils, "genPassword")
    .mockReturnValue({
      hash: "hash",
      salt: "salt",
    });

  const res = await request(app)
    .post("/api/register")
    .send(userInput)
    .expect(400);
  expect(res.body).toEqual({
    errors: [{ message: "Password must contain a number", field: "password" }],
  });
  expect(saveNewUserSpy).toBeCalledTimes(0);
  expect(genPasswordSpy).toBeCalledTimes(0);
});

it("register route returns 400 and err message if fullName is less than 5 char, user should not be saved", async () => {
  const savedUserData = <User>{
    id: 1,
    email: "test@test.com",
    fullName: "fullName",
    hash: "hash",
    salt: "salt",
  };
  const userInput = {
    email: "test@test.com",
    fullName: "name",
    password: "password1",
  };
  const saveNewUserSpy = jest
    .spyOn(userRepository, "saveNewUser")
    .mockResolvedValue(savedUserData);
  const genPasswordSpy = jest
    .spyOn(passwordUtils, "genPassword")
    .mockReturnValue({
      hash: "hash",
      salt: "salt",
    });

  const res = await request(app)
    .post("/api/register")
    .send(userInput)
    .expect(400);
  expect(res.body).toEqual({
    errors: [{ message: "Name must be at least 5 char", field: "fullName" }],
  });
  expect(saveNewUserSpy).toBeCalledTimes(0);
  expect(genPasswordSpy).toBeCalledTimes(0);
});
it("register route returns 400 and err message if email is not correct, user should not be saved", async () => {
  const savedUserData = <User>{
    id: 1,
    email: "test@test.com",
    fullName: "fullName",
    hash: "hash",
    salt: "salt",
  };
  const userInput = {
    email: "test",
    fullName: "fullName",
    password: "password1",
  };
  const saveNewUserSpy = jest
    .spyOn(userRepository, "saveNewUser")
    .mockResolvedValue(savedUserData);
  const genPasswordSpy = jest
    .spyOn(passwordUtils, "genPassword")
    .mockReturnValue({
      hash: "hash",
      salt: "salt",
    });

  const res = await request(app)
    .post("/api/register")
    .send(userInput)
    .expect(400);
  expect(res.body).toEqual({
    errors: [{ message: "Email must be valid", field: "email" }],
  });
  expect(saveNewUserSpy).toBeCalledTimes(0);
  expect(genPasswordSpy).toBeCalledTimes(0);
});
