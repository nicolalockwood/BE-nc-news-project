const db = require('../db/connection');
const format = require('pg-format');

exports.removeCommentByID = (ID) => {
	return db
		.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [ID])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: 'Content not found',
				});
			}
		});
};

exports.updateComemntByID = (voteUpdate, id) => {
	const { inc_votes } = voteUpdate;
	const voteUpdateAmmount = voteUpdate.inc_votes;
	if (typeof voteUpdateAmmount !== 'number') {
		return Promise.reject({
			status: 422,
			msg: 'Unprocessable Entity- Please provide in format inc_votes: vote_number',
		});
	}
	return db
		.query('SELECT votes FROM comments WHERE comment_id = $1 ;', [id])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: 'Article not found',
				});
			}
			let currentVote = rows[0].votes;
			let newVote = (currentVote += voteUpdateAmmount);
			return newVote;
		})
		.then((newVote) => {
			return db
				.query(
					'UPDATE comments SET votes = $1 WHERE comment_id = $2 RETURNING *;',
					[newVote, id]
				)
				.then(({ rows }) => {
					return rows[0];
				});
		});
};
