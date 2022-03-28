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
