import { Router } from "express";
import { z } from "zod";
import {
  createTransactionController,
  createUserController,
  deleteTransactionController,
  loginController,
  getSummaryController,
  getTransactionsController,
  getUserController,
  updateTransactionController
} from "../controllers/finance.controller.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const uuidParamSchema = z.object({
  id: z.string().uuid()
});

const userIdParamSchema = z.object({
  userId: z.string().uuid()
});

const transactionParamSchema = z.object({
  userId: z.string().uuid(),
  txId: z.string().uuid()
});

const createUserSchema = z.object({
  username: z.string().min(3).max(30)
});

const transactionSchema = z.object({
  amount: z.coerce.number().finite(),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1).max(100),
  description: z.string().max(500).default(""),
  date: z.coerce.date()
});

const txListQuerySchema = z.object({
  start: z.coerce.date().optional(),
  end: z.coerce.date().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0)
});

const summaryQuerySchema = z.object({
  start: z.coerce.date().optional(),
  end: z.coerce.date().optional()
});

router.post("/users", validate(createUserSchema), createUserController);
router.post("/login", validate(createUserSchema), loginController);
router.get("/users/:id", validate(uuidParamSchema, "params"), getUserController);

router.post(
  "/users/:userId/transactions",
  validate(userIdParamSchema, "params"),
  validate(transactionSchema),
  createTransactionController
);

router.get(
  "/users/:userId/transactions",
  validate(userIdParamSchema, "params"),
  validate(txListQuerySchema, "query"),
  getTransactionsController
);

router.put(
  "/users/:userId/transactions/:txId",
  validate(transactionParamSchema, "params"),
  validate(transactionSchema),
  updateTransactionController
);

router.delete(
  "/users/:userId/transactions/:txId",
  validate(transactionParamSchema, "params"),
  deleteTransactionController
);

router.get(
  "/users/:userId/summary",
  validate(userIdParamSchema, "params"),
  validate(summaryQuerySchema, "query"),
  getSummaryController
);

export default router;
