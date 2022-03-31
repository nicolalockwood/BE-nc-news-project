const express = require('express');
const format = require('pg-format');
const { getTopics } = require('./controllers/topic.controller');
const {
	byArticleID,
	patchArticleID,
	getArticles,
	postCommentByID,
	commentsByArticleID,
} = require('./controllers/article.controller');
const {
	psqlErrors,
	nonPsqlErrors,
	internalServerError,
} = require('./controllers/err.controllers');

const { getUsers } = require('./controllers/user.controller');

const { deleteCommentByID } = require('./controllers/comment.controller');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', byArticleID);

app.patch('/api/articles/:article_id', patchArticleID);

app.get('/api/users', getUsers);

app.get('/api/articles', getArticles);

app.post('/api/articles/:article_id/comments', postCommentByID);
app.get('/api/articles/:article_id/comments', commentsByArticleID);

app.delete('/api/comments/:comment_id', deleteCommentByID);

app.use(psqlErrors);
app.use(nonPsqlErrors);
app.use(internalServerError);

app.all('/*', (req, res) => {
	res.status(404).send({ msg: 'Path not found' });
});
module.exports = app;
