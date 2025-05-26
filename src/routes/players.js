import { Router } from "express";
import { searchPlayerFiltering } from "../controllers/searchPlayerFiltering.js";
import { getPlayerById } from "../controllers/getPlayerById.js";
import { getPlayerImage } from "../controllers/getPlayerImage.js";

const router = Router();

router.get("/", searchPlayerFiltering);

router.get("/:id", getPlayerById);

router.get("/:id/image", getPlayerImage);

export default router;
