import express from "express";
const router = express.Router();

import {
  createList,
  updateList
} from "../controllers/listController.js";

router.post("/", createList);
router.patch("/:id", updateList);

export default router;