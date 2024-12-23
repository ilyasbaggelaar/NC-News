const { user } = require("pg/lib/defaults");
const db = require("../connection");

function readTopics() {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
}

function readArticleId(articleId) {

  const query = `
    SELECT 
      articles.article_id,
      articles.title,
      articles.body,
      articles.topic,
      articles.author,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
  `;

  return db
    .query(query, [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }
      return rows[0];
    });
}

function readArticles(sort_by = 'created_at', order = 'DESC', topic) {
  const validSortBy = ['created_at', 'article_id', 'title', 'votes', 'topic', 'comment_count'];
  const validSortQuery = ['ASC', 'DESC', 'asc', 'desc'];

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
    `;

  let queryValue = [];
  if (topic) {
    sqlQuery += `WHERE articles.topic = $1 `;
    queryValue.push(topic);
  }

  if (!validSortBy.includes(sort_by) || !validSortQuery.includes(order)) {
    return Promise.reject({ status: 400, msg: 'bad request' });
  }

  sqlQuery += `
    GROUP BY 
        articles.article_id, 
        articles.title, 
        articles.topic, 
        articles.author, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url
    ORDER BY ${sort_by} ${order};
  `;

  return db.query(sqlQuery, queryValue).then(({ rows }) => {
    rows.forEach((article) => {
      article.comment_count = parseInt(article.comment_count);
    });

    return rows;
  });
}

function readArticleComments(article_id) {
  return db
    .query(
      "SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC;",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows;
    });
}

function insertComment(username, body, article_id) {
  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;",
      [username, body, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject();
      }
      return result.rows[0];
    });
}

function updateArticleVotes(article_id, votes) {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
    `,
      [votes, article_id]
    )

    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
}

function deleteComment(comment_id) {

  return db.query(
    `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
    `, [comment_id]
  )

    .then((result) => {
      if(result.rowCount === 0){
        return Promise.reject({status: 404, msg: "Comment not found."});
      }
      return result.rowCount > 0;
    })

}

function readUsers() {
  return db.query(`
    SELECT * FROM users;
    `)
    .then(({rows}) => {
      if(rows.length === 0){
        return Promise.reject({status: 404, msg: "Users not found"})
      }
      return rows
    })
}

module.exports = {
  readTopics,
  readArticleId,
  readArticles,
  readArticleComments,
  insertComment,
  updateArticleVotes,
  deleteComment,
  readUsers
};
