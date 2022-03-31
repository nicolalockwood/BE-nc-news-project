const commentRouter = require('express').Router();
const express = require('express');
const format = require('pg-format');

const { deleteCommentByID } = require('../controllers/comment.controller');

commentRouter.route('/:comment_id').delete(deleteCommentByID);

module.exports = commentRouter;
