import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
};

// Cached across hot reloads in dev and across warm serverless instances in prod.
export const prisma = globalThis.prisma || createPrismaClient();
globalThis.prisma = prisma;
