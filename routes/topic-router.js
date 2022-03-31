const topicRouter = require('express').Router();
const express = require('express');
const format = require('pg-format');

const { getTopics } = require('../controllers/topic.controller');

topicRouter.route('/').get(getTopics);

module.exports = topicRouter;
