import "reflect-metadata";
import "dotenv/config";
import { app } from "./app";
import { createConnection } from "typeorm";
import { User } from "./user/model";

const main = async () => {
  try {
    await createConnection({
      type: "postgres",
      database: "database_app_development",
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      synchronize: true,
      entities: [User],
    });
    console.log("connected to DB");
    app.listen(process.env.PORT, (): void => {
      console.log(`Connected successfully on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

main();
