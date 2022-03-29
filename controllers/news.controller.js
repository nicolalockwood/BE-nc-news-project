const {
	selectTopics,
	selectArticleID,
	updateArticleID,
} = require('../models/news.model');

exports.getTopics = (req, res, next) => {
	selectTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch((err) => next(err));
};

exports.getArticleID = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleID(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch((err) => next(err));
};

exports.patchArticleID = (req, res, next) => {
	const { article_id } = req.params;
	updateArticleID(req.body, article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch((err) => next(err));
};
