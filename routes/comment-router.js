const commentRouter = require('express').Router();
const express = require('express');
const format = require('pg-format');

const {
	deleteCommentByID,
	patchCommentById,
} = require('../controllers/comment.controller');

commentRouter
	.route('/:comment_id')
	.delete(deleteCommentByID)
	.patch(patchCommentById);

module.exports = commentRouter;
