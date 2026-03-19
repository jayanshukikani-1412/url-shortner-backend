import express from "express";
import { createShortUrl, getAnalytics } from "../controllers/url.js";

const urlRouter = express.Router();

urlRouter.post("/", createShortUrl);

urlRouter.get("/analytics/:shortId", getAnalytics);

export default urlRouter;
