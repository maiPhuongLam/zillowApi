import { TypeOf, object, string } from "zod";

export const loginSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not valid email"),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password to short"),
  }),
});

export type LoginDto = TypeOf<typeof loginSchema>;
