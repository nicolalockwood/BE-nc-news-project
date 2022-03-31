const usersRouter = require('express').Router();
const express = require('express');
const format = require('pg-format');

const { getUsers } = require('../controllers/user.controller');

usersRouter.route('/').get(getUsers);

module.exports = usersRouter;
