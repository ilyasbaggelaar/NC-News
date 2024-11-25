const db = require('../connection')

function readTopics() {
    return db.query('SELECT * FROM topics;').then(({rows}) => {
        return rows
    })
}


module.exports = {readTopics}