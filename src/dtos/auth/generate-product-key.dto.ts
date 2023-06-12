import { UserType } from "../../entitites/user.entity";
import { TypeOf, object, string, z } from "zod";

export const generateProductKeySchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not valid email"),
    userType: z.nativeEnum(UserType, {
      required_error: "userType is required",
    }),
  }),
});

export type GenerateProductKeyDto = TypeOf<typeof generateProductKeySchema>;
