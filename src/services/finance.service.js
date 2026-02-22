import { prisma } from "../config/prisma.js";
import { AppError } from "../middleware/appError.js";

export async function createUser(username) {
  return prisma.user.create({
    data: { username }
  });
}

export async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}

export async function loginByUsername(username) {
  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user) {
    throw new AppError("Invalid username", 404);
  }

  return user;
}

async function ensureUserExists(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User not found", 404);
  }
}

function buildDateFilter(start, end) {
  if (!start && !end) {
    return undefined;
  }

  const dateFilter = {};

  if (start) {
    dateFilter.gte = new Date(start);
  }

  if (end) {
    dateFilter.lte = new Date(end);
  }

  return dateFilter;
}

export async function createTransaction(userId, payload) {
  await ensureUserExists(userId);

  return prisma.transaction.create({
    data: {
      userId,
      amount: payload.amount,
      type: payload.type,
      category: payload.category,
      description: payload.description,
      date: new Date(payload.date)
    }
  });
}

export async function getTransactions(userId, query) {
  await ensureUserExists(userId);

  const where = {
    userId,
    date: buildDateFilter(query.start, query.end)
  };

  return prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    take: query.limit,
    skip: query.offset
  });
}

export async function updateTransaction(userId, txId, payload) {
  await ensureUserExists(userId);

  const existing = await prisma.transaction.findFirst({
    where: { id: txId, userId }
  });

  if (!existing) {
    throw new AppError("Transaction not found", 404);
  }

  return prisma.transaction.update({
    where: { id: txId },
    data: {
      amount: payload.amount,
      type: payload.type,
      category: payload.category,
      description: payload.description,
      date: new Date(payload.date)
    }
  });
}

export async function deleteTransaction(userId, txId) {
  await ensureUserExists(userId);

  const existing = await prisma.transaction.findFirst({
    where: { id: txId, userId }
  });

  if (!existing) {
    throw new AppError("Transaction not found", 404);
  }

  await prisma.transaction.delete({
    where: { id: txId }
  });
}

export async function getSummary(userId, query) {
  await ensureUserExists(userId);

  const dateFilter = buildDateFilter(query.start, query.end);
  const baseWhere = {
    userId,
    date: dateFilter
  };

  const [incomeAgg, expenseAgg, grouped] = await Promise.all([
    prisma.transaction.aggregate({
      where: { ...baseWhere, type: "income" },
      _sum: { amount: true }
    }),
    prisma.transaction.aggregate({
      where: { ...baseWhere, type: "expense" },
      _sum: { amount: true }
    }),
    prisma.transaction.groupBy({
      by: ["category", "type"],
      where: baseWhere,
      _sum: { amount: true },
      orderBy: [{ category: "asc" }, { type: "asc" }]
    })
  ]);

  const totalIncome = Number(incomeAgg._sum.amount ?? 0);
  const totalExpenses = Number(expenseAgg._sum.amount ?? 0);

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    byCategory: grouped.map((item) => ({
      category: item.category,
      type: item.type,
      total: Number(item._sum.amount ?? 0)
    }))
  };
}
