import { playerQuerySchema } from "../middleware/validation.js";
import { logger } from "../utils/logger.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const searchPlayerFiltering = async (req, res) => {
  try {
    const { error, value } = playerQuerySchema.validate(req.query);
    if (error) {
      logger.error(`Validation error: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }

    const { page, limit, search, sortBy, sortOrder } = value;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
          ],
        }
      : {};

    try {
      const [players, total] = await Promise.all([
        prisma.player.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        prisma.player.count({ where }),
      ]);

      const filteredPlayers = search
        ? players.filter(
            (player) =>
              player.firstName?.toLowerCase().includes(search.toLowerCase()) ||
              player.lastName?.toLowerCase().includes(search.toLowerCase())
          )
        : players;

      res.json({
        data: filteredPlayers,
        meta: {
          total: search ? filteredPlayers.length : total,
          page,
          limit,
        },
      });
    } catch (err) {
      // Handle database-specific errors
      if (err.code === "P2009" || err.code === "P2012") {
        logger.error(`Invalid sort field: ${sortBy}`);
        return res.status(400).json({ error: `Invalid sort field: ${sortBy}` });
      }
      throw err; // Let the outer catch handle other errors
    }
  } catch (err) {
    logger.error(`Error fetching players: ${err.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
