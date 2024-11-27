const db = require("../connection");

function readTopics() {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
}

function readArticleId(articleId) {
  // console.log(articleId)
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [articleId])
    .then(({ rows }) => {
      return rows[0];
    });
}

function readArticles() {
  let sqlQuery = `
SELECT 
      articles.article_id,
      articles.title,
      articles.topic,
      articles.author,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
    COALESCE(COUNT(comments.article_id), 0) AS comment_count
FROM articles
LEFT JOIN comments
ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
`;

  const queryValues = [];

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    rows.forEach((article) => {
      article.comment_count = parseInt(article.comment_count);
    });
    return rows;
  });
}

function readArticleComments(article_id) {
 return db.query('SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC;', [article_id])
 .then(({rows}) => {
  if (rows.length === 0) {
    return Promise.reject({status: 404, msg: "Article not found" });
  }
  return rows
 })

}



module.exports = { readTopics, readArticleId, readArticles, readArticleComments};
