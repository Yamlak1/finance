import {
  createTransaction,
  createUser,
  deleteTransaction,
  getSummary,
  getTransactions,
  getUserById,
  loginByUsername,
  updateTransaction
} from "../services/finance.service.js";

export async function createUserController(req, res, next) {
  try {
    const user = await createUser(req.body.username);
    res.status(201).json(user);
  } catch (error) {
    if (error.code === "P2002") {
      error.statusCode = 400;
      error.message = "Username already exists";
    }
    next(error);
  }
}

export async function getUserController(req, res, next) {
  try {
    const user = await getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function loginController(req, res, next) {
  try {
    const user = await loginByUsername(req.body.username);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function createTransactionController(req, res, next) {
  try {
    const transaction = await createTransaction(req.params.userId, req.body);
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
}

export async function getTransactionsController(req, res, next) {
  try {
    const transactions = await getTransactions(req.params.userId, req.query);
    res.json(transactions);
  } catch (error) {
    next(error);
  }
}

export async function updateTransactionController(req, res, next) {
  try {
    const updated = await updateTransaction(req.params.userId, req.params.txId, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteTransactionController(req, res, next) {
  try {
    await deleteTransaction(req.params.userId, req.params.txId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getSummaryController(req, res, next) {
  try {
    const summary = await getSummary(req.params.userId, req.query);
    res.json(summary);
  } catch (error) {
    next(error);
  }
}
