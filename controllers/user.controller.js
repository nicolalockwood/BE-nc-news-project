const { selectUsers } = require('../models/user.model');

exports.getUsers = (req, res, next) => {
	selectUsers()
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch((err) => next(err));
};
