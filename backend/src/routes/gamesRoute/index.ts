import {Router} from "express";
import controllers from "../../controllers";

const {listGames, newGame} = controllers;

const router = Router();

router
.route('/')
.get(listGames)
.post(newGame);

export default router;