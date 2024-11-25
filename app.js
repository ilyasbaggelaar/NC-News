const express = require('express')
const {getApiDocu, getTopics} = require('./db/Controllers/api.controller')

const app = express()

app.get('/api', getApiDocu)

app.get('/api/topics', getTopics)


module.exports = app;
