const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const sort = require("jest-sorted");

/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

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
    return request(app).get("/api/topics").expect(200);
  });

  test("200: Responds with an array of topics.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with a status code", () => {
    return request(app).get("/api/articles/1").expect(200);
  });

  test("404: Responds with Article Not Found when the article ID does not exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("400: Responds with Invalid Article ID when the article ID is not a number", () => {
    return request(app)
      .get("/api/articles/abcdefg")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article ID");
      });
  });

  test("200: Responds with an article object, which should have all the properties.", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        const { body } = response;
        const { article } = body;
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of all the articles.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  test("It should NOT contain a body property.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });

  test("200: Responds with an array sorted by the date DESC", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("sends an array of comments belonging to a single article to the client", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const { body } = response;
        const { comments } = body;
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });

  test("GET: 404 sends an appropiate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        const { body } = response;
        const { msg } = body;
        expect(msg).toBe("Article not found");
      });
  });
  test("GET: 400 sends an appropiate error message when given an invalid_id", () => {
    return request(app)
      .get("/api/articles/abc/comments")
      .expect(400)
      .then((response) => {
        const { body } = response;
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });

  test("If the returned array of comments is sorted by created_at, with most recent comments at the top.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST: 201 inserts a new comment to the db and sends the new comment back to the client.", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Ik hou van Gouda kaas!",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const { body } = response;
        expect(body.comment.author).toBe("icellusedkars");
        expect(body.comment.body).toBe("Ik hou van Gouda kaas!");
      });
  });

  test("Should return an error if the username doesnt exist", () => {
    const newComment = {
      username: "Kerstman159",
      body: "Hallo!",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        const { body } = response;
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });

  test("POST: 400 responds with a status and error message when provided with a bad comment, for example no username!", () => {
    const newComment = {
      body: "Thats cool!",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        const { body } = response;
        const { msg } = body;

        expect(msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Updates the votes and returns the updated article.", () => {
    const votes = { votes: 2 };

    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then((response) => {
        const { body } = response;
        const { article } = body;
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty("votes", 102);
      });
  });

  test("PATCH: 400 responds with error if votes is missing or invalid", () => {
    const votesInvalid = {votes: "This is a string! Yipee!!!"}


    return request(app)
    .patch("/api/articles/1")
    .send(votesInvalid)
    .expect(400)
    .then((response) => {
      const {body} = response;
      const {msg} = body;

      expect(msg).toBe("Bad request")
    })
  })

  test("PATCH: 404 responds with error if article_id does not exist", () => {

    const votesInvalid = {votes: 5}

    return request(app)
    .patch("/api/articles/9999")
    .send(votesInvalid)
    .expect(404)
    .then((response) => {
      const {body} = response;
      const {msg} = body;

      expect(msg).toBe("Article not found")
    })
  })
});
