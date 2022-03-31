const {
	selectTopics,
	selectArticleID,
	updateArticleID,
	selectArticles,
	sendCommentByID,
	selectCommentsByArticleID,
	sendArticles,
	removeArticleByID,
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
	const { sort_by, order, topic } = req.query;
	selectArticles(sort_by, order, topic)
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

exports.commentsByArticleID = (req, res, next) => {
	const { article_id } = req.params;
	const promises = [selectArticleID(article_id)];
	if (article_id) promises.push(selectCommentsByArticleID(article_id));
	Promise.all(promises)
		.then((results) => {
			const commentData = results[1];
			res.status(200).send({ commentData });
		})
		.catch((err) => next(err));
};

exports.postArticles = (req, res, next) => {
	sendArticles(req.body)
		.then((newArticle) => {
			res.status(201).send({ newArticle });
		})
		.catch((err) => next(err));
};

exports.deleteArticleByID = (req, res, next) => {
	const { article_id } = req.params;
	removeArticleByID(article_id)
		.then(() => {
			res.status(204).send({});
		})
		.catch((err) => next(err));
};
