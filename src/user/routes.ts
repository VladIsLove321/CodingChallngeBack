import express from "express";
import { requireAuth } from "../middleware/authMiddleware";
import * as UserController from "./controller";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validateRequest";
import passport from "passport";

const router = express.Router();

router.post(
  "/api/login",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("password must be provided"),
  ],
  validateRequest,
  UserController.loginUser
);

router.post(
  "/api/register",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("fullName")
      .isLength({ min: 5 })
      .withMessage("Name must be at least 5 char"),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at leat 8 char")
      .matches(/\d/)
      .withMessage("Password must contain a number")
      .matches(/[a-zA-z]/)
      .withMessage("Password must contain a character"),
  ],
  validateRequest,
  UserController.registerUser
);

router.get("/api/logout", UserController.logoutUser);

router.get("/api/user", requireAuth, UserController.getUserPublicData);

export { router as createTicketRouter };
