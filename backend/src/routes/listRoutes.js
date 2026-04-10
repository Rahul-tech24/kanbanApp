import express from "express";
const router = express.Router();

import {
  createList,
  updateList,
  deleteList
} from "../controllers/listController.js";

router.post("/", createList);
router.patch("/:id", updateList);
router.delete("/:id", deleteList);

export default router;
