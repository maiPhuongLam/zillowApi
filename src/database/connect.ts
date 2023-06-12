import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { UserEntity } from "../entitites/user.entity";
import { HomeEntity } from "../entitites/home.entity";
import { ImageEntity } from "../entitites/image.entity";
dotenv.config();
const port = +process.env.PORT!;
const password = process.env.PASSWORD!;
const database = process.env.DB_NAME!;
export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: port,
  username: "root",
  password: password,
  database: database,
  synchronize: true,
  logging: false,
  entities: [UserEntity, HomeEntity, ImageEntity],
});

// export const connect = async () => {
//   console.log(+process.env.PORT!, process.env.PASSWORD, process.env.DB_NAME);
//   const connection = await AppDataSource.initialize();
//   console.log(connection);
//   if (!connection) {
//     console.log("Connect db fail");
//     return;
//   }
//   console.log("Connect db success");
//   return connection;
// };
