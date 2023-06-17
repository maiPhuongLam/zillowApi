import { TypeOf, array, number, object, string, z } from "zod";
import { PropertyType } from "../../entitites/home.entity";

export class Image {
  url: string;
}

export const updateHomeSchema = object({
  params: object({
    id: string({
      required_error: "address is required",
    }),
  }),
  body: object({
    address: string({
      required_error: "address is required",
    }).optional(),
    numberOfBedrooms: number({
      required_error: "numberOfBedrooms is required",
    }).optional(),
    numberOfBathrooms: number({
      required_error: "numberOfBathrooms is required",
    }).optional(),
    city: string({
      required_error: "city is required",
    }).optional(),
    price: number({
      required_error: "price is required",
    }).optional(),
    landSize: number({
      required_error: "landSize is required",
    }).optional(),
    propertyType: z
      .nativeEnum(PropertyType, {
        required_error: "propertyType is required",
      })
      .optional(),
  }),
});

export type UpdateHomeDto = TypeOf<typeof updateHomeSchema>;
