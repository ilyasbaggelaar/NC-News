const express = require("express");
const cors = require("cors");

const {
  getApiDocu,
  getTopics,
  getArticleId,
  getArticles,
  getArticleComments,
  postArticleComment,
  patchArticleVotes,
  deleteComments,
  getUsers,
} = require("./db/Controllers/api.controller");

const app = express();

app.use(cors())

app.use(express.json());

app.get("/api", getApiDocu);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleId);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.get("/api/users/", getUsers);

app.post("/api/articles/:article_id/comments", postArticleComment);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteComments);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23503" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
