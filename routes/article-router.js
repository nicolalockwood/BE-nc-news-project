const articleRouter = require('express').Router();
const express = require('express');
const format = require('pg-format');

const {
	byArticleID,
	patchArticleID,
	getArticles,
	postCommentByID,
	commentsByArticleID,
} = require('../controllers/article.controller');

articleRouter.route('/').get(getArticles);

articleRouter.route('/:article_id').get(byArticleID).patch(patchArticleID);

articleRouter
	.route('/:article_id/comments')
	.post(postCommentByID)
	.get(commentsByArticleID);

module.exports = articleRouter;
