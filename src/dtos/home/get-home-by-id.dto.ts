import { TypeOf, number, object, string } from "zod";

export const getHomeByIdSchema = object({
  params: object({
    id: string({
      required_error: "param: id is required",
    }),
  }),
});

export type GetHomeByIdDto = TypeOf<typeof getHomeByIdSchema>;
