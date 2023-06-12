import { TypeOf, array, number, object, string, z } from "zod";
import { PropertyType } from "../../entitites/home.entity";

export class Image {
  url: string;
}

const imageSchema = object({
  url: string({
    required_error: "urlImage is required",
  }),
});

export const createHomeSchema = object({
  body: object({
    address: string({
      required_error: "address is required",
    }),
    numberOfBedrooms: number({
      required_error: "numberOfBedrooms is required",
    }),
    numberOfBathrooms: number({
      required_error: "numberOfBathrooms is required",
    }),
    city: string({
      required_error: "city is required",
    }),
    price: number({
      required_error: "price is required",
    }),
    landSize: number({
      required_error: "landSize is required",
    }),
    propertyType: z.nativeEnum(PropertyType, {
      required_error: "propertyType is required",
    }),
    images: array(imageSchema, {
      required_error: "images is required",
    }),
  }),
});

export type CreateHomeDto = TypeOf<typeof createHomeSchema>;
