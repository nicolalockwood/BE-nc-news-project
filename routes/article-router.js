const articleRouter = require('express').Router();
const express = require('express');
const format = require('pg-format');

const {
	byArticleID,
	patchArticleID,
	getArticles,
	postCommentByID,
	commentsByArticleID,
	postArticles,
	deleteArticleByID,
} = require('../controllers/article.controller');

articleRouter.route('/').get(getArticles).post(postArticles);

articleRouter
	.route('/article/:article_id')
	.get(byArticleID)
	.patch(patchArticleID)
	.delete(deleteArticleByID);

articleRouter
	.route('/:article_id/comments')
	.post(postCommentByID)
	.get(commentsByArticleID);

module.exports = articleRouter;
