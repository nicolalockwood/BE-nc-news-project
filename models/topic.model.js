const { query } = require('../db/connection');
const db = require('../db/connection');
const format = require('pg-format');

exports.selectTopics = () => {
	let queryStr = `SELECT * FROM topics`;

	return db.query(queryStr).then(({ rows }) => {
		return rows;
	});
};

exports.sendTopics = (newBody) => {
	const { slug, description } = newBody;
	if (typeof slug !== 'string') {
		return Promise.reject({
			status: 422,
			msg: 'Unprocessable Entity- Please provide in format slug: string',
		});
	}
	if (typeof description !== 'string') {
		return Promise.reject({
			status: 422,
			msg: 'Unprocessable Entity- Please provide in format description: string',
		});
	}
	return db
		.query(
			'INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;',
			[slug, description]
		)
		.then(({ rows }) => {
			return rows[0];
		});
};
