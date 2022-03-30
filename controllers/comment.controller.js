exports.deleteCommentByID = (req, res, next) => {
	removeCommentByID()
		.then((comment) => {
			res.status(204).send({ comment });
		})
		.catch((err) => next(err));
};
