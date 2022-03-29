const { query } = require('../db/connection');
const db = require('../db/connection');
const format = require('pg-format');

exports.selectTopics = () => {
	let queryStr = `SELECT * FROM topics`;

	return db.query(queryStr).then(({ rows }) => {
		return rows;
	});
};
