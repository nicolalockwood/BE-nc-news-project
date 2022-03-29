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
					count: '11',
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
				});
			});
	});
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
	test('422: Responds with Unprocessable Entity message for invalid username', () => {
		const commentUpdate = {
			username: 'not_current_user',
			body: 'Test comment',
		};
		return request(app)
			.post('/api/articles/9/comments')
			.send(commentUpdate)
			.expect(422)
			.then((res) => {
				expect(res.body).toMatchObject({
					msg: 'Unprocessable Entity- Username is not recognised',
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
	test('400: Responds with bad request message for invalid format', () => {
		const commentUpdate = {
			username: 'butter_bridge',
			body: 'Test comment',
		};
		return request(app)
			.post('/api/articles/six/comments')
			.send(commentUpdate)
			.expect(400)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'Bad request' });
			});
	});
});
