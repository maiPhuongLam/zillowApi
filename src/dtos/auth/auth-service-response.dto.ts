import { TypeOf, number, object, string, z } from "zod";

export const authServiceDataSChema = z.string({
  required_error: "Name is required",
  invalid_type_error: "Name must be a string",
});

export type AuthServiceDataDto = TypeOf<typeof authServiceDataSChema>;
