const topicRouter = require('express').Router();
const express = require('express');
const format = require('pg-format');

const { getTopics, postTopics } = require('../controllers/topic.controller');

topicRouter.route('/').get(getTopics).post(postTopics);

module.exports = topicRouter;
