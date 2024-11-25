const endpoints = require('../../endpoints.json')
const {readTopics} = require('../models/api.model')

exports.getApiDocu = (req, res) => {
    res.status(200).send({endpoints})
}

exports.getTopics = (req, res) => {
        readTopics().then((topics) => {
            //console.log(topics)
            res.status(200).send({topics})
        })
        .catch((err) => {
            console.error("Error fetching topics:", err);
            res.status(500).send({msg: "server error"})
        })
}