import { TypeOf, number, object, string, z } from "zod";
import { PropertyType } from "../../entitites/image.entity";

const homeServiceResponseSChema = z.object({
  image: z.string(),
  id: z.number(),
  address: z.string(),
  numberOfBedrooms: z.number(),
  numberOfBathrooms: z.number(),
  city: z.string(),
  landSize: z.number(),
  price: z.number(),
  propertyType: z.nativeEnum(PropertyType),
});

export type HomeServiceResponseDataDto = TypeOf<
  typeof homeServiceResponseSChema
>;
