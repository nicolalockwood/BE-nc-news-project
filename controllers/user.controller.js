const res = require('express/lib/response');
const { selectUsers, selectUsersByUsername } = require('../models/user.model');

exports.getUsers = (req, res, next) => {
	selectUsers()
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch((err) => next(err));
};

exports.getUsersByUsername = (req, res, next) => {
	const { username } = req.params;
	selectUsersByUsername(username)
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch((err) => next(err));
};
