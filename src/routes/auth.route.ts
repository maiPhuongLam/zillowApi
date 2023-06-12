import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { UserEntity } from "../entitites/user.entity";
import { AppDataSource } from "../database/connect";
import validationResource from "../middlewares/validation.resource";
import { loginSchema } from "../dtos/auth/login.dto";
import { registerSchema } from "../dtos/auth/register.dto";
import { generateProductKeySchema } from "../dtos/auth/generate-product-key.dto";
const authController = new AuthController(
  new AuthService(AppDataSource.getRepository(UserEntity))
);
const authRoute = Router();

authRoute.post(
  "/register/:userType",
  validationResource(registerSchema),
  authController.register
);
authRoute.post("/login", validationResource(loginSchema), authController.login);
authRoute.post(
  "/key",
  validationResource(generateProductKeySchema),
  authController.generateProductKey
);

export default authRoute;
