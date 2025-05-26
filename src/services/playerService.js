import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger.js";
import fs from "fs/promises";

const prisma = new PrismaClient();

export class PlayerService {
  async findPlayers(params) {
    const { page, limit, search, sortBy, sortOrder } = params;
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

      return {
        data: filteredPlayers,
        meta: {
          total: search ? filteredPlayers.length : total,
          page,
          limit,
        },
      };
    } catch (err) {
      if (err.code === "P2009" || err.code === "P2012") {
        throw new Error(`Invalid sort field: ${sortBy}`);
      }
      throw err;
    }
  }

  async findPlayerById(id) {
    const player = await prisma.player.findUnique({
      where: { playerid: parseInt(id) },
    });

    if (!player) {
      throw new Error("Player not found");
    }

    return player;
  }

  async getPlayerImageUrl(playerId, req) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return `${baseUrl}/img/${playerId}.png`;
  }

  async checkImageExists(imagePath) {
    try {
      await fs.access(imagePath);
      return true;
    } catch {
      return false;
    }
  }
}
