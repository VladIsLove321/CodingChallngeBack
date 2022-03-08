import express, { Application } from "express";
import "express-async-errors";
import session from "express-session";
import pgSimple from "connect-pg-simple";
import cors from "cors";
import passport from "passport";
import {
  deserializeUser,
  serializeUser,
  strategy,
} from "./src/config/passport";
import { createTicketRouter } from "./src/user/routes";
import { errorHandler } from "./src/middleware/errorHandler";
import { NotFoundError } from "./src/utils/errors/notFoundError";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
const PGStore = pgSimple(session);

app.use(
  session({
    name: process.env.COOKIE_NAME,
    store:
      process.env.ENV !== "TEST"
        ? new PGStore({
            disableTouch: true,
            createTableIfMissing: true,
            conObject: {
              user: process.env.DB_USERNAME,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_NAME,
            },
          })
        : undefined,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);

passport.use(strategy);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.use(passport.initialize());
app.use(passport.session());

app.use(createTicketRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
