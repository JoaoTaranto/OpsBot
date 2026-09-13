const express = require("express");
const { HLTV } = require("hltv");
const hltv_app = express();

hltv_app.get("/", async (req, res) => {
  const news = await HLTV.getNews();
  res.json(news);
});

hltv_app.get("/matches", async (req, res) => {
  const matches = await HLTV.getMatches();
  res.json(matches);
});

module.exports = hltv_app;
