import { ZodError } from "zod";

export function validate(schema, target = "body") {
  return (req, _res, next) => {
    try {
      req[target] = schema.parse(req[target]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        error.statusCode = 400;
      }
      next(error);
    }
  };
}
