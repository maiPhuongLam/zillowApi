import { TypeOf, string, object } from "zod";

export const deleteHomeSchema = object({
  params: object({
    id: string({
      required_error: "address is required",
    }),
  }),
});

export type DeleteHomeDto = TypeOf<typeof deleteHomeSchema>;
