import request from "supertest";
import { app } from "../../app";
import { User } from "../model";
import * as userRepository from "../../user/repository";
import * as passwordUtils from "../../utils/passwordUtils";

it("login route returns 200 on correct user email and password and sets cookie", async () => {
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
  };
  const getUserDataByEmailSpy = jest
    .spyOn(userRepository, "getUserDataByEmail")
    .mockResolvedValue(savedUserData);
  const validPasswordSpy = jest
    .spyOn(passwordUtils, "validPassword")
    .mockReturnValue(true);
  const res = await request(app).post("/api/login").send(userInput).expect(200);
  expect(res.headers["set-cookie"][0].includes("connect.sid=s%")).toBe(true);
  expect(res.body).toEqual({
    success: true,
    message: "authentication succeeded",
  });
  expect(getUserDataByEmailSpy).toBeCalledTimes(1);
  expect(validPasswordSpy).toBeCalledTimes(1);
});

it("login route returns 400 on incorrect user password and does not set cookie", async () => {
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
  };
  const getUserDataByEmailSpy = jest
    .spyOn(userRepository, "getUserDataByEmail")
    .mockResolvedValue(savedUserData);
  const validPasswordSpy = jest
    .spyOn(passwordUtils, "validPassword")
    .mockReturnValue(false);
  const res = await request(app).post("/api/login").send(userInput).expect(400);
  expect(res.headers["set-cookie"]).toBe(undefined);
  expect(res.body).toEqual({
    success: false,
    message: "authentication failed",
  });
  expect(getUserDataByEmailSpy).toBeCalledTimes(1);
  expect(validPasswordSpy).toBeCalledTimes(1);
});
it("login route returns 400 on incorrect user email and does not set cookie", async () => {
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
  };
  const getUserDataByEmailSpy = jest
    .spyOn(userRepository, "getUserDataByEmail")
    .mockResolvedValue(undefined);
  const validPasswordSpy = jest
    .spyOn(passwordUtils, "validPassword")
    .mockReturnValue(true);
  const res = await request(app).post("/api/login").send(userInput).expect(400);
  expect(res.headers["set-cookie"]).toBe(undefined);
  expect(res.body).toEqual({
    success: false,
    message: "authentication failed",
  });
  expect(getUserDataByEmailSpy).toBeCalledTimes(1);
  expect(validPasswordSpy).toBeCalledTimes(0);
});
