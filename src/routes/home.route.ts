import { Router } from "express";
import { AppDataSource } from "../database/connect";
import validationResource from "../middlewares/validation.resource";

import { getHomesSchema } from "../dtos/home/get-homes.dto";
import { createHomeSchema } from "../dtos/home/create-home.dto";
import { HomeController } from "../controllers/home.controller";
import { HomeService } from "../services/home.service";
import { HomeEntity } from "../entitites/home.entity";
import { ImageEntity } from "../entitites/image.entity";
import isAuth from "../middlewares/is-auth";
import { getHomeByIdSchema } from "../dtos/home/get-home-by-id.dto";
import { updateHomeSchema } from "../dtos/home/update-home.dto";
import { deleteHomeSchema } from "../dtos/home/delete-home.dto";
const homeController = new HomeController(
  new HomeService(
    AppDataSource.getRepository(HomeEntity),
    AppDataSource.getRepository(ImageEntity)
  )
);
const homeRoute = Router();

homeRoute.get("/", validationResource(getHomesSchema), homeController.getHomes);
homeRoute.get(
  "/:id",
  validationResource(getHomeByIdSchema),
  homeController.getHome
);
homeRoute.post(
  "/",
  isAuth,
  validationResource(createHomeSchema),
  homeController.addHome
);
homeRoute.patch(
  "/:id",
  isAuth,
  validationResource(updateHomeSchema),
  homeController.updateHome
);

homeRoute.delete(
  "/:id",
  isAuth,
  validationResource(deleteHomeSchema),
  homeController.deleteHome
);

export default homeRoute;
