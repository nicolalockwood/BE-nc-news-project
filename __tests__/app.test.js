const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const app = require('../app');
const jestSorted = require('jest-sorted');

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe('GET /api/topics', () => {
	test('200: responds with an array of topic objects each with slug and description proerties', () => {
		return request(app)
			.get('/api/topics')
			.expect(200)
			.then((res) => {
				expect(res.body.topics).toBeInstanceOf(Array);
				res.body.topics.forEach((topic) => {
					expect(topic).toMatchObject({
						description: expect.any(String),
						slug: expect.any(String),
					});
				});
			});
	});
});
describe('ERROR HANDLING- GET /api/topics', () => {
	test('404: return "Path not found" error when invalid URL is passed', () => {
		return request(app)
			.get('/api/badpath')
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toEqual('Path not found');
			});
	});
});

describe('GET /api/articles/article/:article_id', () => {
	test('200: responds with an articles object, with the username as from users as author', () => {
		return request(app)
			.get('/api/articles/article/1')
			.expect(200)
			.then((res) => {
				expect(res.body.article).toEqual({
					article_id: 1,
					title: 'Living in the shadow of a great man',
					topic: 'mitch',
					author: 'butter_bridge',
					body: 'I find this existence challenging',
					created_at: expect.any(String),
					votes: 100,
					comment_count: '11',
				});
			});
	});
	test('200: responds with an articles object, even if comment_count is 0', () => {
		return request(app)
			.get('/api/articles/article/4')
			.expect(200)
			.then((res) => {
				expect(res.body.article).toEqual({
					article_id: 4,
					title: 'Student SUES Mitch!',
					topic: 'mitch',
					author: 'rogersop',
					body: expect.any(String),
					created_at: expect.any(String),
					votes: 0,
					comment_count: '0',
				});
			});
	});
});
describe(' ERROR HANDLING- GET /api/articles/article/:article_id', () => {
	test('404: Responds with message for valid but not recognised article ID', () => {
		return request(app)
			.get('/api/articles/article/1000')
			.expect(404)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'Article not found' });
			});
	});
	test('400: Responds with bad request message for invalid format', () => {
		return request(app)
			.get('/api/articles/article/six')
			.expect(400)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'Bad request' });
			});
	});
});

describe('PATCH /api/articles/:article_id', () => {
	test('200: responds with an updated articles object', () => {
		const voteUpdate = { inc_votes: 1 };
		return request(app)
			.patch('/api/articles/1')
			.send(voteUpdate)
			.expect(200)
			.then(({ body }) => {
				expect(body.article).toEqual({
					article_id: 1,
					title: 'Living in the shadow of a great man',
					topic: 'mitch',
					author: 'butter_bridge',
					body: 'I find this existence challenging',
					created_at: expect.any(String),
					votes: 101,
				});
			});
	});
	test('200: responds with an updated articles object if votes deducted', () => {
		const voteUpdate = { inc_votes: -10 };
		return request(app)
			.patch('/api/articles/1')
			.send(voteUpdate)
			.expect(200)
			.then(({ body }) => {
				expect(body.article).toEqual({
					article_id: 1,
					title: 'Living in the shadow of a great man',
					topic: 'mitch',
					author: 'butter_bridge',
					body: 'I find this existence challenging',
					created_at: expect.any(String),
					votes: 90,
				});
			});
	});
});
describe('ERROR HANDLING-PATCH /api/articles/:article_id', () => {
	test('422: Responds with Unprocessable Entity message for invalid vote', () => {
		const voteUpdate = { inc_votes: 'notInteger' };
		return request(app)
			.patch('/api/articles/1')
			.send(voteUpdate)
			.expect(422)
			.then((res) => {
				expect(res.body).toMatchObject({
					msg: 'Unprocessable Entity- Please provide in format inc_votes: vote_number',
				});
			});
	});
	test('422: Responds with Unprocessable Entity message for format inc_votes', () => {
		const voteUpdate = { not_inc_votes: 10 };
		return request(app)
			.patch('/api/articles/1')
			.send(voteUpdate)
			.expect(422)
			.then((res) => {
				expect(res.body).toMatchObject({
					msg: 'Unprocessable Entity- Please provide in format inc_votes: vote_number',
				});
			});
	});
	test('404: Responds with message for valid but not recognised article ID', () => {
		const voteUpdate = { inc_votes: 1 };
		return request(app)
			.patch('/api/articles/1000')
			.send(voteUpdate)
			.expect(404)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'Article not found' });
			});
	});
	test('400: Responds with bad request message for invalid format', () => {
		const voteUpdate = { inc_votes: 1 };
		return request(app)
			.patch('/api/articles/six')
			.send(voteUpdate)
			.expect(400)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'Bad request' });
			});
	});
});
describe('GET /api/users', () => {
	test('200: responds with an array of user objects each with only username proerties', () => {
		return request(app)
			.get('/api/users')
			.expect(200)
			.then((res) => {
				expect(res.body.user).toBeInstanceOf(Array);
				res.body.user.forEach((user) => {
					expect(user).toMatchObject({
						username: expect.any(String),
					});
				});
			});
	});
});
describe('ERROR HANDLING -GET /api/users', () => {
	test('404: return "Path not found" error when invalid URL is passed', () => {
		return request(app)
			.get('/api/badpath')
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toEqual('Path not found');
			});
	});
});
describe('GET /api/articles', () => {
	test('200: responds with an array of article objects each with comment count included sorted by date DESC', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then((res) => {
				expect(res.body.articles).toBeSortedBy('created_at', {
					descending: true,
					coerce: true,
				});
				expect(res.body.articles.length).toBe(10);
				expect(res.body.articles).toBeInstanceOf(Array);
				res.body.articles.forEach((article) => {
					expect(article).toMatchObject({
						article_id: expect.any(Number),
						title: expect.any(String),
						topic: expect.any(String),
						author: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						comment_count: expect.any(String),
					});
				});
			});
	});
});
describe('ERROR HANDLING - GET /api/articles', () => {
	test('404: return "Path not found" error when invalid URL is passed', () => {
		return request(app)
			.get('/api/badpath')
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toEqual('Path not found');
			});
	});
});
describe('GET /api/articles - QUERIES', () => {
	test('200: Accepts a sort-by query and sorts based on input', () => {
		return request(app)
			.get('/api/articles/?sort_by=votes')
			.expect(200)
			.then((res) => {
				expect(res.body.articles).toBeSortedBy('votes', {
					descending: true,
					coerce: true,
				});
			});
	});
	test('200: Accepts a order query and sorts based on input', () => {
		return request(app)
			.get('/api/articles/?order=asc')
			.expect(200)
			.then((res) => {
				expect(res.body.articles).toBeSortedBy('created_at', {
					coerce: true,
				});
			});
	});
	test('200: Accepts a topic query and filters based on input', () => {
		return request(app)
			.get('/api/articles/?topic=cats')
			.expect(200)
			.then((res) => {
				expect(res.body.articles.length).toBe(1);
				res.body.articles.forEach((article) => {
					expect(article.topic).toBe('cats');
				});
			});
	});
	test('200: Accepts a topic query and filters based on input even if no articles on that topic', () => {
		return request(app)
			.get('/api/articles/?topic=paper')
			.expect(200)
			.then((res) => {
				expect(res.body.articles.length).toBe(0);
				expect(res.body.articles).toEqual([]);
			});
	});
});
describe('ERROR HANDLING - GET /api/articles - QUERIES', () => {
	test('400: return "Invalid sort by" error when invalid sort by value is passed', () => {
		return request(app)
			.get('/api/articles?sort_by=incorrect')
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe('Invalid sort by');
			});
	});
	test('400: return "Invalid order by" error when invalid order value is passed', () => {
		return request(app)
			.get('/api/articles?order=incorrect')
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe('Invalid order by');
			});
	});
	test('404: return "Topic not found" error when invalid topic value is passed', () => {
		return request(app)
			.get('/api/articles?topic=incorrect')
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe('Not found');
			});
	});
});
describe('GET /api/articles -PAGINATION', () => {
	test('200: Accepts a p and limit query and returns the limit ammount in desc order', () => {
		return request(app)
			.get('/api/articles/?page=1&limit=5')
			.expect(200)
			.then((res) => {
				expect(res.body.articles).toBeSortedBy('created_at', {
					descending: true,
					coerce: true,
				});
				expect(res.body.articles.length).toBe(5);
			});
	});
	test('200: If page 2 limit 5 is selected, the result returned is articles 6-10 including total count of all articles', () => {
		return request(app)
			.get('/api/articles/?page=2&limit=5')
			.expect(200)
			.then((res) => {
				expect(res.body.articles).toBeSortedBy('created_at', {
					descending: true,
					coerce: true,
				});
				expect(res.body.articles.length).toBe(5);
				expect(res.body.articles[0]).toEqual({
					article_id: 1,
					title: 'Living in the shadow of a great man',
					topic: 'mitch',
					author: 'butter_bridge',
					body: 'I find this existence challenging',
					created_at: expect.any(String),
					votes: 100,
					comment_count: '11',
					total_count: '12',
				});
			});
	});
});
describe('POST /api/articles/:article_id/comments', () => {
	test('200: responds with an object of a new comment based on infomation passed from client', () => {
		const commentUpdate = {
			username: 'butter_bridge',
			body: 'Test comment',
		};
		return request(app)
			.post('/api/articles/9/comments')
			.send(commentUpdate)
			.expect(201)
			.then((res) => {
				expect(res.body.newComment).toBeInstanceOf(Object);
				expect(res.body.newComment).toMatchObject({
					comment_id: 19,
					article_id: 9,
					body: 'Test comment',
					votes: 0,
					author: 'butter_bridge',
					created_at: expect.any(String),
					// });
				});
			});
	});
});

describe('ERROR HANDLING - POST /api/articles/:article_id/comments', () => {
	test('422: Responds with Unprocessable Entity message for invalid body', () => {
		const commentUpdate = {
			username: 'butter_bridge',
			body: 10,
		};
		return request(app)
			.post('/api/articles/9/comments')
			.send(commentUpdate)
			.expect(422)
			.then((res) => {
				expect(res.body).toMatchObject({
					msg: 'Unprocessable Entity- Please provide in format body: string',
				});
			});
	});

	test('422: Responds with Unprocessable Entity message for format body', () => {
		const commentUpdate = {
			username: 'butter_bridge',
			not_body: 'Test comment',
		};
		return request(app)
			.post('/api/articles/9/comments')
			.send(commentUpdate)
			.expect(422)
			.then((res) => {
				expect(res.body).toMatchObject({
					msg: 'Unprocessable Entity- Please provide in format body: string',
				});
			});
	});

	test('404: Responds with message for valid but not recognised article ID', () => {
		const commentUpdate = {
			username: 'butter_bridge',
			body: 'Test comment',
		};
		return request(app)
			.post('/api/articles/1000/comments')
			.send(commentUpdate)
			.expect(404)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'Article not found' });
			});
	});
});

describe('GET /api/articles/:article_id/comments', () => {
	test('200: responds with an array of comments in objects for the article ID  passed', () => {
		return request(app)
			.get('/api/articles/9/comments')
			.expect(200)
			.then((res) => {
				expect(res.body.commentData).toBeInstanceOf(Array);
				expect(res.body.commentData.length).toBe(2);
				res.body.commentData.forEach((user) => {
					expect(user).toMatchObject({
						comment_id: expect.any(Number),
						votes: expect.any(Number),
						body: expect.any(String),
						created_at: expect.any(String),
						author: expect.any(String),
					});
				});
			});
	});
	test('200: Responds with an empty array for valid article ID that has no comments', () => {
		return request(app)
			.get('/api/articles/4/comments')
			.expect(200)
			.then((res) => {
				expect(res.body.commentData).toBeInstanceOf(Array);
				expect(res.body.commentData).toEqual([]);
			});
	});
});
describe('GET /api/articles/:article_id/comments -PAGINATION', () => {
	test('200: Accepts a p and limit query and returns the limit ammount in desc order', () => {
		return request(app)
			.get('/api/articles/9/comments/?page=1&limit=5')
			.expect(200)
			.then((res) => {
				expect(res.body.commentData).toBeInstanceOf(Array);
				expect(res.body.commentData.length).toBe(2);
			});
	});
	test('200: If page 2 limit 5 is selected, the result returned is comment 6-10 for specified article', () => {
		return request(app)
			.get('/api/articles/1/comments?page=2&limit=5')
			.expect(200)
			.then((res) => {
				expect(res.body.commentData).toBeInstanceOf(Array);
				expect(res.body.commentData.length).toBe(5);
				expect(res.body.commentData[0]).toEqual({
					comment_id: 8,
					body: 'Delicious crackerbreads',
					votes: 0,
					author: 'icellusedkars',
					created_at: expect.any(String),
				});
			});
	});
});
describe('ERROR HANDLING - GET /api/articles/:article_id/comments', () => {
	test('404: Responds with message for valid but not recognised article ID', () => {
		return request(app)
			.get('/api/articles/1000/comments')
			.expect(404)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'Article not found' });
			});
	});
	test('400: Responds with bad request message for invalid format', () => {
		return request(app)
			.get('/api/articles/six/comments')
			.expect(400)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'Bad request' });
			});
	});
});

describe('GET /api/endpoints', () => {
	test('200: Response with a JSON object of a list of endpoints', () => {
		return request(app)
			.get('/api/endpoints')
			.expect(200)
			.then((res) => {
				expect(res.body).toBeInstanceOf(Object);
			});
	});
});
describe('ERROR HANDLING - GET /api', () => {
	test('404: return "Path not found" error when invalid URL is passed', () => {
		return request(app)
			.get('/badpath')
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toEqual('Path not found');
			});
	});
});
describe('DELETE /api/comments/:comment_id', () => {
	test('204: responds with an empty response body', () => {
		return request(app).delete('/api/comments/1').expect(204);
	});
});
describe('ERROR HANDLING - DELETE /api/comments/:comment_id', () => {
	test('404: Responds with message for valid but not recognised comment ID', () => {
		return request(app)
			.delete('/api/comments/1000')
			.expect(404)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'Content not found' });
			});
	});
	test('400: Responds with bad request message for invalid format', () => {
		return request(app)
			.delete('/api/comments/six')
			.expect(400)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'Bad request' });
			});
	});
});
describe('GET /api/users/:username', () => {
	test('200: responds with an users object, with the username, avatar url and username for the relevnat user name passed', () => {
		return request(app)
			.get('/api/users/butter_bridge')
			.expect(200)
			.then((res) => {
				expect(res.body.user).toEqual({
					username: 'butter_bridge',
					name: 'jonny',
					avatar_url:
						'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
				});
			});
	});
});
describe(' ERROR HANDLING- GET /api/users/:username', () => {
	test('404: Responds with message for valid but not recognised username ID', () => {
		return request(app)
			.get('/api/users/not-recognised')
			.expect(404)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'User not found' });
			});
	});
	test('400: Responds with bad request message for invalid format', () => {
		return request(app)
			.get('/api/users/10')
			.expect(404)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'User not found' });
			});
	});
});
describe('PATCH api/comments/:comment_id', () => {
	test('200: responds with an updated comment object', () => {
		const voteUpdate = { inc_votes: 1 };
		return request(app)
			.patch('/api/comments/1')
			.send(voteUpdate)
			.expect(200)
			.then(({ body }) => {
				expect(body.comment).toEqual({
					comment_id: 1,
					body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
					votes: 17,
					author: 'butter_bridge',
					article_id: 9,
					created_at: expect.any(String),
				});
			});
	});
	test('200: responds with an updated articles object if votes deducted', () => {
		const voteUpdate = { inc_votes: -10 };
		return request(app)
			.patch('/api/comments/1')
			.send(voteUpdate)
			.expect(200)
			.then(({ body }) => {
				expect(body.comment).toEqual({
					comment_id: 1,
					body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
					votes: 6,
					author: 'butter_bridge',
					article_id: 9,
					created_at: expect.any(String),
				});
			});
	});
});
describe('ERROR HANDLING-PATCH api/comments/:comment_id', () => {
	test('422: Responds with Unprocessable Entity message for invalid vote', () => {
		const voteUpdate = { inc_votes: 'notInteger' };
		return request(app)
			.patch('/api/comments/1')
			.send(voteUpdate)
			.expect(422)
			.then((res) => {
				expect(res.body).toMatchObject({
					msg: 'Unprocessable Entity- Please provide in format inc_votes: vote_number',
				});
			});
	});
	test('422: Responds with Unprocessable Entity message for format inc_votes', () => {
		const voteUpdate = { not_inc_votes: 10 };
		return request(app)
			.patch('/api/comments/1')
			.send(voteUpdate)
			.expect(422)
			.then((res) => {
				expect(res.body).toMatchObject({
					msg: 'Unprocessable Entity- Please provide in format inc_votes: vote_number',
				});
			});
	});
	test('404: Responds with message for valid but not recognised article ID', () => {
		const voteUpdate = { inc_votes: 1 };
		return request(app)
			.patch('/api/comments/1000')
			.send(voteUpdate)
			.expect(404)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'Article not found' });
			});
	});
	test('400: Responds with bad request message for invalid format', () => {
		const voteUpdate = { inc_votes: 1 };
		return request(app)
			.patch('/api/comments/six')
			.send(voteUpdate)
			.expect(400)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'Bad request' });
			});
	});
});
describe('POST /api/articles', () => {
	test('201: responds with an object of a new article based on infomation passed from client', () => {
		const articleUpdate = {
			title: 'This project has been fun',
			topic: 'cats',
			author: 'butter_bridge',
			body: 'Why is everything always about cats',
		};
		return request(app)
			.post('/api/articles')
			.send(articleUpdate)
			.expect(201)
			.then((res) => {
				expect(res.body.newArticle).toBeInstanceOf(Object);
				expect(res.body.newArticle).toMatchObject({
					article_id: expect.any(Number),
					title: 'This project has been fun',
					topic: 'cats',
					author: 'butter_bridge',
					body: 'Why is everything always about cats',
					created_at: expect.any(String),
					votes: 0,
				});
			});
	});
});
describe('ERROR HANDLING - POST /api/articles', () => {
	test('422: Responds with Unprocessable Entity message for invalid body', () => {
		const articleUpdate = {
			title: 'This project has been fun',
			topic: 'cats',
			author: 'butter_bridge',
			body: 2000,
		};
		return request(app)
			.post('/api/articles')
			.send(articleUpdate)
			.expect(422)
			.then((res) => {
				expect(res.body).toMatchObject({
					msg: 'Unprocessable Entity- Please provide in format body: string',
				});
			});
	});

	test('422: Responds with Unprocessable Entity message for format body', () => {
		const articleUpdate = {
			title: 'This project has been fun',
			topic: 'cats',
			author: 'butter_bridge',
			not_body: 'Test string',
		};
		return request(app)
			.post('/api/articles')
			.send(articleUpdate)
			.expect(422)
			.then((res) => {
				expect(res.body).toMatchObject({
					msg: 'Unprocessable Entity- Please provide in format body: string',
				});
			});
	});
	test('422: Responds with Unprocessable Entity message for invalid title', () => {
		const articleUpdate = {
			title: 100,
			topic: 'cats',
			author: 'butter_bridge',
			body: 'Test string',
		};
		return request(app)
			.post('/api/articles')
			.send(articleUpdate)
			.expect(422)
			.then((res) => {
				expect(res.body).toMatchObject({
					msg: 'Unprocessable Entity- Please provide in format title: string',
				});
			});
	});
	test('422: Responds with Unprocessable Entity message for format of title', () => {
		const articleUpdate = {
			not_title: 'This project has been fun',
			topic: 'cats',
			author: 'butter_bridge',
			body: 'Test string',
		};
		return request(app)
			.post('/api/articles')
			.send(articleUpdate)
			.expect(422)
			.then((res) => {
				expect(res.body).toMatchObject({
					msg: 'Unprocessable Entity- Please provide in format title: string',
				});
			});
	});
});
describe('POST /api/topics', () => {
	test('201: responds with an object of a new topic based on infomation passed from client', () => {
		const topicUpdate = {
			slug: 'topic name here',
			description: 'description here',
		};
		return request(app)
			.post('/api/topics')
			.send(topicUpdate)
			.expect(201)
			.then((res) => {
				expect(res.body.newTopic).toBeInstanceOf(Object);
				expect(res.body.newTopic).toMatchObject({
					slug: 'topic name here',
					description: 'description here',
				});
			});
	});
});
describe('ERROR HANDLING - POST /api/topics', () => {
	test('422: Responds with Unprocessable Entity message for invalid slug value', () => {
		const topicUpdate = {
			slug: 1000,
			description: 'description here',
		};
		return request(app)
			.post('/api/topics')
			.send(topicUpdate)
			.expect(422)
			.then((res) => {
				expect(res.body).toMatchObject({
					msg: 'Unprocessable Entity- Please provide in format slug: string',
				});
			});
	});

	test('422: Responds with Unprocessable Entity message for format slug key', () => {
		const topicUpdate = {
			not_slug: 'topic name here',
			description: 'description here',
		};
		return request(app)
			.post('/api/topics')
			.send(topicUpdate)
			.expect(422)
			.then((res) => {
				expect(res.body).toMatchObject({
					msg: 'Unprocessable Entity- Please provide in format slug: string',
				});
			});
	});
	test('422: Responds with Unprocessable Entity message for invalid description value', () => {
		const topicUpdate = {
			slug: 'topic name here',
			description: 10000,
		};
		return request(app)
			.post('/api/topics')
			.send(topicUpdate)
			.expect(422)
			.then((res) => {
				expect(res.body).toMatchObject({
					msg: 'Unprocessable Entity- Please provide in format description: string',
				});
			});
	});

	test('422: Responds with Unprocessable Entity message for format description key', () => {
		const topicUpdate = {
			slug: 'topic name here',
			not_description: 'description here',
		};
		return request(app)
			.post('/api/topics')
			.send(topicUpdate)
			.expect(422)
			.then((res) => {
				expect(res.body).toMatchObject({
					msg: 'Unprocessable Entity- Please provide in format description: string',
				});
			});
	});
});
describe('DELETE /api/articles/:article_id', () => {
	test('204: responds with an empty response body', () => {
		return request(app).delete('/api/articles/1').expect(204);
	});
});
describe('ERROR HANDLING - DELETE /api/:article_id', () => {
	test('404: Responds with message for valid but not recognised article ID', () => {
		return request(app)
			.delete('/api/articles/1000')
			.expect(404)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'Content not found' });
			});
	});
	test('400: Responds with bad request message for invalid format', () => {
		return request(app)
			.delete('/api/articles/six')
			.expect(400)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'Bad request' });
			});
	});
});
