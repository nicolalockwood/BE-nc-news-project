const { selectTopics, sendTopics } = require('../models/topic.model');

exports.getTopics = (req, res, next) => {
	selectTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch((err) => next(err));
};

exports.postTopics = (req, res, next) => {
	sendTopics(req.body)
		.then((newTopic) => {
			res.status(201).send({ newTopic });
		})
		.catch((err) => next(err));
};
