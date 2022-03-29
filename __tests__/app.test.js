const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const app = require('../app');
// const jestSorted = require('jest-sorted');

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
	test('404: return "Path not found" error when invalid URL is passed', () => {
		return request(app)
			.get('/api/badpath')
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toEqual('Path not found');
			});
	});
});

describe('GET /api/articles/:article_id', () => {
	test('200: responds with an articles object, with the username as from users as author', () => {
		return request(app)
			.get('/api/articles/1')
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
			.get('/api/articles/4')
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
	test('404: Responds with message for valid but not recognised article ID', () => {
		return request(app)
			.get('/api/articles/1000')
			.expect(404)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'Article not found' });
			});
	});
	test('400: Responds with bad request message for invalid format', () => {
		return request(app)
			.get('/api/articles/six')
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
	test('422: Responds with Unprocessable Entity message for invalid vote', () => {
		const voteUpdate = { inc_votes: 'notInteger' };
		return request(app)
			.patch('/api/articles/1')
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
			.expect(422)
			.then((res) => {
				expect(res.body).toMatchObject({
					msg: 'Unprocessable Entity- Please provide in format inc_votes: vote_number',
				});
			});
	});
	test('404: Responds with message for valid but not recognised article ID', () => {
		return request(app)
			.get('/api/articles/1000')
			.expect(404)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'Article not found' });
			});
	});
	test('400: Responds with bad request message for invalid format', () => {
		return request(app)
			.get('/api/articles/six')
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
	test('200: responds with an array of article objects each with comment count included', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then((res) => {
				expect(res.body.articles.length).toBe(12);
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
	test('404: return "Path not found" error when invalid URL is passed', () => {
		return request(app)
			.get('/api/badpath')
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toEqual('Path not found');
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
