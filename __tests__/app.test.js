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