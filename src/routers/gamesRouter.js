import { Router } from "express";
import { getGames, createGame } from "../controllers/gamesController.js";
import gamesValidation from "../middlewares/gamesMiddleware.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", gamesValidation, createGame);

export default gamesRouter;