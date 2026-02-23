import app from "./app.js";
import { config } from "./config/env.js";
import { prisma } from "./config/prisma.js";

const server = app.listen(9837, () => {
  console.log(`Server running on port 9837`);
});

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
