const format = require('pg-format');
const db = require('../connection');
exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
	if (!created_at) return { ...otherProperties };
	return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
	return arr.reduce((ref, element) => {
		ref[element[key]] = element[value];
		return ref;
	}, {});
};

exports.formatComments = (comments, idLookup) => {
	return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
		const article_id = idLookup[belongs_to];
		return {
			article_id,
			author: created_by,
			...this.convertTimestampToDate(restOfComment),
		};
	});
};

// exports.paginatedResults = (results, page, limit) => {
// 	return (req, res, next) => {
// 		const startIndex = (page - 1) * limit;

// 		const endIndex = page * limit;

// 		const results = {};

// 		if (endIndex < results.length) {
// 			results.next = { page: page + 1, limit: limit };
// 		}
// 		if (startIndex > 0) {
// 			results.previous = {
// 				page: page - 1,
// 				limit: limit,
// 			};
// 		}
// 		return (results.results = users.slice(startIndex, endIndex));
// 	};
// };
