const usersRouter = require('express').Router();
const express = require('express');
const format = require('pg-format');

const {
	getUsers,
	getUsersByUsername,
} = require('../controllers/user.controller');

usersRouter.route('/').get(getUsers);

usersRouter.route('/:username').get(getUsersByUsername);
module.exports = usersRouter;
