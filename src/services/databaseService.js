import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger.js";

class DatabaseService {
  constructor() {
    if (!DatabaseService.instance) {
      this.prisma = new PrismaClient();
      DatabaseService.instance = this;
      logger.info("Database connection initialized");
    }
    return DatabaseService.instance;
  }

  async disconnect() {
    await this.prisma.$disconnect();
    logger.info("Database connection closed");
  }

  getPrisma() {
    return this.prisma;
  }
}

export const databaseService = new DatabaseService();
