const {
	selectTopics,
	selectArticleID,
	updateArticleID,
} = require('../models/article.model');

exports.byArticleID = (req, res, next) => {
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
