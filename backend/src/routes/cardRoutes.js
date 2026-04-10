import express from "express";
const router = express.Router();


import {
  createCard,
  updateCard,
  getCard,
  moveCard,
  deleteCard
} from "../controllers/cardController.js";

router.post("/", createCard);
router.patch("/:id", updateCard);
router.get("/:id", getCard);
router.patch("/:id/move", moveCard);
router.delete("/:id", deleteCard);

export default router;
