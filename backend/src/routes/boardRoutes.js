import express from "express";
const router = express.Router();

import {
  getBoards,
  createBoard,
  getBoard
} from "../controllers/boardController.js";

router.get("/", getBoards);
router.post("/", createBoard);
router.get("/:id", getBoard);

export default router;