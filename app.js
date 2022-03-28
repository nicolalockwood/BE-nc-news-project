const express = require('express');
const format = require('pg-format');
const { getTopics } = require('./controllers/news.controller');
const {
	psqlErrors,
	nonPsqlErrors,
	internalServerError,
} = require('./controllers/err.controllers');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

app.use(psqlErrors);
app.use(nonPsqlErrors);
app.use(internalServerError);

app.all('/*', (req, res) => {
	res.status(404).send({ msg: 'Path not found' });
});

module.exports = app;
