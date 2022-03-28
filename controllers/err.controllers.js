// handle PSQL errors
exports.psqlErrors = (err, req, res, next) => {
	const badReqCodes = ['42703', '22P02'];
	if (badReqCodes.includes(err.code)) {
		res.status(400).send({ msg: 'Bad request' });
	} else {
		next(err);
	}
};
//Custom errors
exports.nonPsqlErrors = (err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		next(err);
	}
};
//handle unexpected error
exports.internalServerError = (err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: 'Internal server error' });
};
