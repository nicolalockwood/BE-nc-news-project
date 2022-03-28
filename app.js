const express = require('express');
const format = require('pg-format');
const { getTopics } = require('./controllers/news.controller');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

module.exports = app;
