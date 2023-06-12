import { UserEntity, UserType } from "../entitites/user.entity";
import { AppDataSource } from "../database/connect";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { AuthServiceDataDto } from "../dtos/auth/auth-service-response.dto";

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  constructor(private readonly userRepository: Repository<UserEntity>) {}

  private generateJwt(email: string, id: number, userType: UserType) {
    const token = jwt.sign(
      {
        userType,
        email,
        id,
      },
      process.env.JSON_TOKEN_KEY!,
      {
        expiresIn: 360000,
      }
    );

    return token;
  }

  public async register(
    { email, password, name, phone }: RegisterData,
    userType: UserType
  ): Promise<{ statusCode: number; data: AuthServiceDataDto }> {
    const userExist = await this.userRepository.findOne({ where: { email } });
    if (userExist) {
      return {
        statusCode: 200,
        data: "Email đã được dùng để đăng ký tài khoản khác",
      };
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      phone,
      userType,
    });

    await this.userRepository.save(user);

    const token = await this.generateJwt(user.name, user.id, userType);

    return { statusCode: 201, data: token };
  }

  public async login({
    email,
    password,
  }: LoginData): Promise<{ statusCode: number; data: AuthServiceDataDto }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return { statusCode: 404, data: "Email không chính xác" };
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      return { statusCode: 400, data: "Mat khẩu không chính xác" };
    }

    const token = await this.generateJwt(user.email, user.id, user.userType);

    return { statusCode: 201, data: token };
  }

  async generateProductKey(
    email: string,
    userType: UserType
  ): Promise<{ statusCode: number; data: AuthServiceDataDto }> {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    const salt = await bcrypt.genSalt();
    const key = await bcrypt.hash(string, salt);
    return { statusCode: 200, data: key };
  }
}
