const express = require("express");
const {
  getApiDocu,
  getTopics,
  getArticleId,
  getArticles,
  getArticleComments,
} = require("./db/Controllers/api.controller");

const app = express();

app.get("/api", getApiDocu);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleId);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments)



app.use((err, req, res, next) => {
  //console.log(err)
  if (err.code === "22P02") {
    res.status(400).send({msg: "Bad request"})
  } else next(err)
})

app.use((err, req, res, next) => {
  if(err.status && err.msg) {
    res.status(err.status).send({msg: err.msg})
  }else res.status(500).send({msg: 'internal server error'})
})

module.exports = app;
