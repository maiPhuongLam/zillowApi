import { TypeOf, object, string } from "zod";
import { UserType } from "../../entitites/user.entity";
import { z } from "zod";

const body = {
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not valid email"),
    name: string({
      required_error: "name is required",
    }),
    phone: string({
      required_error: "phone is required",
    }).regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
    password: string({
      required_error: "Password is required",
    }).min(5, "Password to short"),
    productKey: string().optional(),
  }),
};

export const registerSchema = z.object({
  ...body,
  params: object({
    userType: z.nativeEnum(UserType),
  }),
});

export type RegisterDto = TypeOf<typeof registerSchema>;
