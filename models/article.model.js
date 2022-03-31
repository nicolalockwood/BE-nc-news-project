const { query } = require('../db/connection');
const db = require('../db/connection');
const format = require('pg-format');
const { selectTopics } = require('../models/topic.model');
const { selectUsers } = require('../models/user.model');

exports.selectArticleID = (article_id) => {
	return db
		.query(
			'SELECT a.*, count(c.article_id) AS comment_count FROM articles a FULL OUTER JOIN comments c ON a.article_id = c.article_id WHERE a.article_id = $1 GROUP BY a.article_id;',
			[article_id]
		)
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
					'UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;',
					[newVote, id]
				)
				.then(({ rows }) => {
					return rows[0];
				});
		});
};

exports.selectArticles = (sort_by = 'created_at', order = 'DESC', topic) => {
	const validColumns = [
		'comment_count',
		'article_id',
		'title',
		'topic',
		'author',
		'body',
		'created_at',
		'votes',
	];

	const validSort = ['ASC', 'DESC', 'asc', 'desc'];

	const validTopic = ['mitch', 'cats'];
	if (!validSort.includes(order)) {
		return Promise.reject({ status: 400, msg: 'Invalid order by' });
	}

	if (!validColumns.includes(sort_by)) {
		return Promise.reject({ status: 400, msg: 'Invalid sort by' });
	}
	if (topic && !validTopic.includes(topic)) {
		return Promise.reject({ status: 404, msg: 'Topic not found' });
	}

	let queryStr =
		'SELECT a.*, count(c.article_id) AS comment_count FROM articles a FULL OUTER JOIN comments c ON a.article_id = c.article_id';
	let queryValues = [];

	if (topic) {
		queryStr += ` WHERE topic = $1`;
		queryValues.push(topic);
	}

	queryStr += ` GROUP BY a.article_id ORDER BY ${sort_by} ${order};`;
	return db.query(queryStr, queryValues).then(({ rows }) => {
		return rows;
	});
};

exports.selectCommentsByArticleID = (id) => {
	return db
		.query(
			'SELECT comment_id, body, author, votes, created_at FROM comments WHERE article_id = $1;',
			[id]
		)
		.then(({ rows }) => {
			return rows;
		});
};
exports.sendCommentByID = (newBody, ID) => {
	const { username, body } = newBody;
	const validUserNames = [
		'butter_bridge',
		'icellusedkars',
		'rogersop ',
		'lurker ',
	];
	if (!validUserNames.includes(username)) {
		return Promise.reject({
			status: 422,
			msg: 'Unprocessable Entity- Username is not recognised',
		});
	}
	if (typeof body !== 'string') {
		return Promise.reject({
			status: 422,
			msg: 'Unprocessable Entity- Please provide in format body: string',
		});
	}
	return db
		.query(
			'INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;',
			[ID, username, body]
		)
		.then(({ rows }) => {
			return rows[0];
		});
};

exports.sendArticles = (newBody) => {
	const { title, topic, author, body } = newBody;
	const validUserNames = [
		'butter_bridge',
		'icellusedkars',
		'rogersop ',
		'lurker ',
	];
	const validTopic = ['mitch', 'cats', 'paper'];

	if (typeof title !== 'string') {
		return Promise.reject({
			status: 422,
			msg: 'Unprocessable Entity- Please provide in format title: string',
		});
	}
	if (!validTopic.includes(topic)) {
		return Promise.reject({
			status: 422,
			msg: 'Unprocessable Entity- Topic is not recognised please add and re try in format topic: topicname',
		});
	}
	if (!validUserNames.includes(author)) {
		return Promise.reject({
			status: 422,
			msg: 'Unprocessable Entity- Username is not recognised please enter username:yourusername',
		});
	}
	if (typeof body !== 'string') {
		return Promise.reject({
			status: 422,
			msg: 'Unprocessable Entity- Please provide in format body: string',
		});
	}
	return db
		.query(
			'INSERT INTO articles (title, topic, author, body) VALUES ($1, $2, $3, $4) RETURNING *;',
			[title, topic, author, body]
		)
		.then(({ rows }) => {
			return rows[0];
		});
};
