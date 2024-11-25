const endpoints = require('../../endpoints.json')
const {readTopics, readArticleId} = require('../models/api.model')

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

exports.getArticleId = (req, res) => {

    const { article_id } = req.params;

    readArticleId(article_id)
    .then((article) => {
        if (!article) {
            return res.status(404).send({msg: "Article not found"})
        } else{
            res.status(200).send({ article })
        }

    })
    .catch((err) => {
        if(err.code === '22P02') {
            res.status(400).send({msg: "Invalid article ID"})
        }else{
            res.status(500).send({msg: "Internal server error"})
        }
    })
}