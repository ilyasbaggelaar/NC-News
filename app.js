const express = require('express')
const {getApiDocu} = require('./db/Controllers/api.controller')

const app = express()

app.get('/api', getApiDocu)


module.exports = app;
