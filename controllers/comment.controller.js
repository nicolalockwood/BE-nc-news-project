const {
	removeCommentByID,
	updateComemntByID,
} = require('../models/comment.model');

exports.deleteCommentByID = (req, res, next) => {
	const { comment_id } = req.params;
	removeCommentByID(comment_id)
		.then(() => {
			res.status(204).send({});
		})
		.catch((err) => next(err));
};

exports.patchCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	updateComemntByID(req.body, comment_id)
		.then((comment) => {
			res.status(200).send({ comment });
		})
		.catch((err) => next(err));
};
