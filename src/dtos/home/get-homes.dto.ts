import { TypeOf, number, object, string, z } from "zod";
import { PropertyType } from "../../entitites/home.entity";

export const getHomesSchema = object({
  query: object({
    city: string({
      required_error: "address is required",
    }).optional(),
    price: object({
      lessThan: number().optional(),
      moreThan: number().optional(),
    }).optional(),
    propertyType: z
      .nativeEnum(PropertyType, {
        required_error: "propertyType is required",
      })
      .optional(),
  }),
});

export type GetHomesDto = TypeOf<typeof getHomesSchema>;
