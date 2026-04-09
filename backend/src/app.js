import express from "express";
import cors from "cors";

import boardRoutes from "./routes/boardRoutes.js";
 import listRoutes from "./routes/listRoutes.js";
 import cardRoutes from "./routes/cardRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);

export default app;