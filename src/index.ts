import express from "express";
import cors from "cors";
import { AppDataSource } from "./database/connect";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route";
import homeRoute from "./routes/home.route";

dotenv.config();
const app = express();
const PORT = 10000;
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/home", homeRoute);

const startApp = async () => {
  try {
    const connection = await AppDataSource.initialize();
    if (connection) {
      app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
      });
    } else {
      console.log("fail");
    }
  } catch (err) {
    console.log(err);
  }
};

startApp();
