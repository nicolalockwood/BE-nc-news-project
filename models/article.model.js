const { query } = require('../db/connection');
const db = require('../db/connection');
const format = require('pg-format');

exports.selectTopics = () => {
	let queryStr = `SELECT * FROM topics`;

	return db.query(queryStr).then(({ rows }) => {
		return rows;
	});
};

exports.selectArticleID = (article_id) => {
	return db
		.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({ msg: 'Article not found', status: 404 });
			}
			return rows[0];
		});
};

exports.updateArticleID = (voteUpdate, id) => {
	const { inc_votes } = voteUpdate;
	const voteUpdateAmmount = voteUpdate.inc_votes;
	if (typeof voteUpdateAmmount !== 'number') {
		return Promise.reject({
			status: 422,
			msg: 'Unprocessable Entity- Please provide in format inc_votes: vote_number',
		});
	}
	return db
		.query('SELECT votes FROM articles WHERE article_id = $1 ;', [id])
		.then(({ rows }) => {
			let currentVote = rows[0].votes;
			let newVote = (currentVote += voteUpdateAmmount);
			return newVote;
		})
		.then((newVote) => {
			return db
				.query(
					'UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;',
					[newVote, id]
				)
				.then(({ rows }) => {
					return rows[0];
				});
		});
};

exports.selectArticles = () => {
	return db
		.query(
			'SELECT a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, count(c.article_id) AS comment_count FROM articles a FULL OUTER JOIN comments c ON a.article_id = c.article_id GROUP BY a.article_id;'
		)
		.then(({ rows }) => {
			console.log(rows);
			return rows;
		});
};
