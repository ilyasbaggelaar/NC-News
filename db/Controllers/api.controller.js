const endpoints = require("../../endpoints.json");
const {
  readTopics,
  readArticleId,
  readArticles,
  readArticleComments,
  insertComment,
  updateArticleVotes,
} = require("../models/api.model");

exports.getApiDocu = (req, res) => {
  res.status(200).send({ endpoints });
};

exports.getTopics = (req, res) => {
  readTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      console.error("Error fetching topics:", err);
      res.status(500).send({ msg: "server error" });
    });
};

exports.getArticleId = (req, res) => {
  const { article_id } = req.params;

  readArticleId(article_id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ msg: "Article not found" });
      } else {
        res.status(200).send({ article });
      }
    })
    .catch((err) => {
      if (err.code === "22P02") {
        res.status(400).send({ msg: "Invalid article ID" });
      } else {
        res.status(500).send({ msg: "Internal server error" });
      }
    });
};

exports.getArticles = (req, res) => {
  readArticles().then((articles) => {
    if (articles.length === 0) {
      return res.status(404).send({ msg: "Article not found" });
    }
    res.status(200).send({ articles });
  });
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;

  readArticleComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticleComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertComment(username, body, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { votes } = req.body;

  updateArticleVotes(article_id, votes)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
