const { query } = require('../db/connection');
const db = require('../db/connection');
const format = require('pg-format');

exports.selectTopics = async () => {
	let queryStr = `SELECT * FROM topics`;

	const result = await db.query(queryStr);
	return result.rows;
};

exports.selectArticleID = (article_id) => {
	return db
		.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
		.then((result) => {
			if (result.rows.length === 0) {
				return Promise.reject({ msg: 'Article not found', status: 404 });
			}
			return result.rows[0];
		});
};
