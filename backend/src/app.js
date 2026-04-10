import express from "express";
import cors from "cors";

import boardRoutes from "./routes/boardRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL
]

app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error("Not allowed by CORS"))
    },
    credentials: true
  })
)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);

export default app;
