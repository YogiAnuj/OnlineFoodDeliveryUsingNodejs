import express from "express";
import App from "./services/ExpressApp";
import dbConnection from "./services/Database";
import { PORT } from "./config";
import dotenv from "dotenv";

const startServer = async () => {
  dotenv.config({ path: "./src/config/config.env" });
  const app = express();

  await dbConnection();
  await App(app);

  app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
};

startServer();
