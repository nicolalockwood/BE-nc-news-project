const express = require('express');
const format = require('pg-format');
const {
	getTopics,
	byArticleID,
	patchArticleID,
} = require('./controllers/article.controller');
const {
	psqlErrors,
	nonPsqlErrors,
	internalServerError,
} = require('./controllers/err.controllers');

const {} = require('./controllers/user.controller');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', byArticleID);

app.patch('/api/articles/:article_id', patchArticleID);

// app.get('/api/users', getUsers);

app.use(psqlErrors);
app.use(nonPsqlErrors);
app.use(internalServerError);

app.all('/*', (req, res) => {
	res.status(404).send({ msg: 'Path not found' });
});

module.exports = app;
