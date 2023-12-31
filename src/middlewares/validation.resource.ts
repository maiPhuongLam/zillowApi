import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

const validationResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      return next();
    } catch (error: any) {
      return res.status(400).send(error.errors);
    }
  };

export default validationResource;
