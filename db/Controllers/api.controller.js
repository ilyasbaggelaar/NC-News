const endpoints = require('../../endpoints.json')

exports.getApiDocu = (req, res) => {
    res.status(200).send({endpoints})
}