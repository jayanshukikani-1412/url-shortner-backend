import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./connect.js";
import urlRouter from "./routers/url.js";
import { redirectUrlHandler } from "./controllers/url.js";
const app = express();

const PORT = 5000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.urlencoded({ extended: false }));

connectDB();

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use("/api/url", urlRouter);

app.get("/:shortId", redirectUrlHandler);

// not found route
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// error handler
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
