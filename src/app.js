import express from "express";
import cors from "cors";
import financeRoutes from "./routes/finance.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: "https://finance-frontend-dvbchhdyp-yamlak1s-projects.vercel.app"
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", financeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
