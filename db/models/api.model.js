const db = require('../connection')

function readTopics() {
    return db.query('SELECT * FROM topics;').then(({rows}) => {
        return rows
    })
}

function readArticleId(articleId) {
   // console.log(articleId)
 return db.query('SELECT * FROM articles WHERE article_id = $1;', [articleId])
 .then(({rows}) => {
    return rows[0];
 })
}


module.exports = {readTopics, readArticleId}