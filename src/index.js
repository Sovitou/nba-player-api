import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import YAML from "yaml";
import { logger } from "./utils/logger.js";
import playerRoutes from "./routes/players.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/img", express.static(path.join(__dirname, "../img")));
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

const swaggerDoc = YAML.parse(await readFile("./docs/swagger.yaml", "utf8"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use("/api/players", playerRoutes);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
