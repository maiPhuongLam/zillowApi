import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterDto } from "../dtos/auth/register.dto";
import { UserType } from "../entitites/user.entity";
import * as bcrypt from "bcrypt";
import { GenerateProductKeyDto } from "../dtos/auth/generate-product-key.dto";
import { LoginDto } from "../dtos/auth/login.dto";

export class AuthController {
  constructor(private readonly authService: AuthService) {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.generateProductKey = this.generateProductKey.bind(this);
  }

  async register(
    req: Request<RegisterDto["params"], {}, RegisterDto["body"]>,
    res: Response
  ) {
    try {
      const { userType } = req.params;
      if (userType !== UserType.BUYER) {
        if (!req.body.productKey) {
          return res.status(401).json("Yêu cầu là trái phép");
        }

        const validProductKey = `${req.body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
        const isValidProductKey = await bcrypt.compare(
          validProductKey,
          req.body.productKey!
        );

        if (!isValidProductKey) {
          return res.status(401).json("Yêu cầu là trái phép");
        }
      }

      const { statusCode, data }: { statusCode: number; data: string } =
        await this.authService.register(req.body, userType);

      res.status(statusCode).json(data);
    } catch (err: any) {
      res.status(500).json(err.message);
    }
  }

  async login(req: Request<{}, {}, LoginDto["body"]>, res: Response) {
    try {
      const { email, password } = req.body;
      const { statusCode, data } = await this.authService.login({
        email,
        password,
      });
      res.status(statusCode).json(data);
    } catch (err: any) {
      res.status(500).json(err.message);
    }
  }

  async generateProductKey(
    req: Request<{}, {}, GenerateProductKeyDto["body"]>,
    res: Response
  ) {
    try {
      const { email, userType } = req.body;
      const { statusCode, data } = await this.authService.generateProductKey(
        email,
        userType
      );
      return res.status(statusCode).json(data);
    } catch (err: any) {
      res.status(500).json(err.message);
    }
  }
}
