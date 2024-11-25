const endpointsJson = require("../endpoints.json");
const request = require("supertest")
const app = require("../app")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const db = require("../db/connection")

/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */
beforeEach(()=>{
  return seed(data)
})
afterAll(()=>{
  return db.end()
})


describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with a status code", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
  });

  test("200: Responds with an array of topics.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
        const {topics} = body
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        })
      })
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with a status code", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
  });

  test("404: Responds with Article Not Found when the article ID does not exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe('Article not found')
      })
  });

  test("400: Responds with Invalid Article ID when the article ID is not a number", () => {
    return request(app)
      .get("/api/articles/abcdefg")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('Invalid article ID')
      });
  });
});