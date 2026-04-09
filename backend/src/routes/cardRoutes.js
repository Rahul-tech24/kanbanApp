import express from "express";
const router = express.Router();


import {
  createCard,
  updateCard,
  getCard, moveCard
} from "../controllers/cardController.js";

router.post("/", createCard);
router.patch("/:id", updateCard);
router.get("/:id", getCard);
router.patch("/:id/move", moveCard);

export default router;