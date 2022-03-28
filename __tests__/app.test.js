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
				});
			});
	});
	test('404: Responds with message for valid but none recognised article ID', () => {
		return request(app)
			.get('/api/articles/1000')
			.expect(404)
			.then((res) => {
				expect(res.body).toMatchObject({ msg: 'Article not found' });
			});
	});
});
