import { playerIdSchema } from "../middleware/validation.js";
import { logger } from "../utils/logger.js";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPlayerById = async (req, res) => {
  try {
    const { error } = playerIdSchema.validate({ id: req.params.id });
    if (error) {
      logger.error(`Validation error: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }

    const player = await prisma.player.findUnique({
      where: { playerid: parseInt(req.params.id) },
    });

    if (!player) {
      logger.warn(`Player not found: ${req.params.id}`);
      return res.status(404).json({ error: "Player not found" });
    }

    res.json(player);
  } catch (err) {
    logger.error(`Error fetching player ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
