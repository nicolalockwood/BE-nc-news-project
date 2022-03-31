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
