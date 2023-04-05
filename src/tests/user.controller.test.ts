import App from "../app";
import request from "supertest";
import UsersController from "../cotrollers/Users/users.controller";
import User from "../cotrollers/Users/user.interace";
import dotenv from "dotenv";

dotenv.config();

const app = new App([new UsersController()], process.env?.PORT || "8000").app;

describe("GET /users", () => {
  it("should get users succesfuly", (done) => {
    request(app)
      .get("/users")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("POST /users", () => {
  it("should create user succesfully", (done) => {
    request(app)
      .post("/users")
      .send({ name: "John" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("POST /users", () => {
  it("create user with empty name, should return status 400", (done) => {
    request(app)
      .post("/users")
      .send({ name: "" })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("GET /users/:id", () => {
  it("Respond with status 200", (done) => {
    request(app)
      .get("/users/1")
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Create and get user", (done) => {
    request(app)
      .post("/users")
      .send({ name: "John" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const user: User = res.body;
        request(app)
          .get(`/users/${user.id}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });
  });
});

describe("PUT /users/:id", () => {
  it("Change name", (done) => {
    request(app)
      .post("/users")
      .send({ name: "John" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const user: User = res.body;

        request(app)
          .put(`/users/${user.id}`)
          .send({ name: "Alex" })
          .expect(200)
          .end((err, res) => {
            const user: User = res.body;
            expect(user.name).toBe("Alex");
            expect(user.friends).toEqual([]);
            if (err) return done(err);
            done();
          });
      });
  });
});

describe("PUT /users/:id", () => {
  it("Change name with empty string", (done) => {
    request(app)
      .post("/users")
      .send({ name: "John" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const user: User = res.body;

        request(app)
          .put(`/users/${user.id}`)
          .send({ name: "" })
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });
  });
});

describe("DELETE /users/:id", () => {
  it("Create and delete user", (done) => {
    request(app)
      .post("/users")
      .send({ name: "John" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const user: User = res.body;

        request(app)
          .delete(`/users/${user.id}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });
  });

  it("Request delete with inexistent id", (done) => {
    request(app)
      .delete("/users/1")
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
