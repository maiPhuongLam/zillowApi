import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { UserEntity } from "../entitites/user.entity";
import { AppDataSource } from "../database/connect";
import validationResource from "../middlewares/validation.resource";

import { generateProductKeySchema } from "../dtos/auth/generate-product-key.dto";
import { getHomesSchema } from "../dtos/home/get-homes.dto";
import { createHomeSchema } from "../dtos/home/create-home.dto";
import { HomeController } from "../controllers/home.controller";
import { HomeService } from "../services/home.service";
import { HomeEntity } from "../entitites/home.entity";
import { ImageEntity } from "../entitites/image.entity";
import isAuth from "../middlewares/is-auth";
const homeController = new HomeController(
  new HomeService(
    AppDataSource.getRepository(HomeEntity),
    AppDataSource.getRepository(ImageEntity)
  )
);
const homeRoute = Router();

homeRoute.get("/", validationResource(getHomesSchema), homeController.getHomes);
homeRoute.post(
  "/",
  isAuth,
  validationResource(createHomeSchema),
  homeController.addHome
);

export default homeRoute;
