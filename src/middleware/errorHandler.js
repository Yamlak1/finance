import { ZodError } from "zod";

export function notFoundHandler(_req, _res, next) {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError || err.statusCode === 400) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.issues ?? [{ message: err.message }]
    });
  }

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: err.message || "Internal server error"
  });
}
