import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { playerIdSchema } from "../middleware/validation.js";
import { logger } from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getPlayerImage = async (req, res) => {
  try {
    const { error } = playerIdSchema.validate({ id: req.params.id });
    if (error) {
      logger.error(`Validation error: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }

    const imagePath = path.join(__dirname, "../../img", `${req.params.id}.png`);
    const imageExists = await fs
      .access(imagePath)
      .then(() => true)
      .catch(() => false);

    if (!imageExists) {
      logger.warn(`Image not found for player ${req.params.id}`);
      return res
        .status(404)
        .json({ error: `Image not found for player ID ${req.params.id}` });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/img/${
      req.params.id
    }.png`;
    res.json({ imageUrl });
  } catch (err) {
    logger.error(
      `Error fetching image for player ${req.params.id}: ${err.message}`
    );
    res.status(500).json({ error: "Internal server error" });
  }
};
