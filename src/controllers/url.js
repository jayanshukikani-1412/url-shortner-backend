import shortid from "shortid";
import URL from "../models/url.js";

export const createShortUrl = async (req, res) => {
  const body = req.body;

  if (!body.url)
    return res.status(400).json({ success: false, error: "url is required" });

  const shortId = shortid.generate();

  await URL.create({
    shortId: shortId,
    redirectURL: body.url,
    visitHistory: [],
  });

  res.status(201).json({
    success: true,
    message: "short url created successfully",
    shortId: shortId,
  });
};

export const redirectUrlHandler = async (req, res) => {
  const shortId = req.params.shortId;

  if (!shortId)
    return res
      .status(400)
      .json({ success: false, error: "shortId is required" });

  const result = await URL.findOneAndUpdate(
    { shortId: shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } },
  );
  if (!result)
    return res.status(404).json({ success: false, error: "shortId not found" });

  return res.status(302).redirect(result.redirectURL);
};

export const getAnalytics = async (req, res) => {
  const shortId = req.params.shortId;
  if (!shortId)
    return res
      .status(400)
      .json({ success: false, error: "shortId is required" });

  const result = await URL.findOne({ shortId: shortId });
  if (!result)
    return res.status(404).json({
      success: false,
      error: "Result not found for the given shortId",
    });

  const data = {
    shortId: result.shortId,
    redirectURL: result.redirectURL,
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory?.map((item) => ({
      timestamp: new Date(item.timestamp).toISOString(),
    })),
  };

  return res.status(200).json({ success: true, data: data });
};
