const express = require("express");
const {
  getApiDocu,
  getTopics,
  getArticleId,
  getArticles,
} = require("./db/Controllers/api.controller");

const app = express();

app.get("/api", getApiDocu);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleId);

app.get("/api/articles", getArticles);

module.exports = app;
