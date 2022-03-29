const {
	selectTopics,
	selectArticleID,
	updateArticleID,
	selectArticles,
	sendCommentByID,
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

exports.getArticles = (req, res, next) => {
	selectArticles()
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch((err) => next(err));
};

exports.postCommentByID = (req, res, next) => {
	const { article_id } = req.params;
	const promises = [selectArticleID(article_id)];
	if (article_id) promises.push(sendCommentByID(req.body, article_id));
	Promise.all(promises)
		.then((results) => {
			const newComment = results[1];
			res.status(201).send({ newComment });
		})
		.catch((err) => next(err));
};
