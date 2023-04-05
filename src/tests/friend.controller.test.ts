import App from "../app";
import request from "supertest";
import User from "../cotrollers/Users/user.interace";
import dotenv from "dotenv";
import FriendsController from "../cotrollers/Friends/friends.controller";
import UsersController from "../cotrollers/Users/users.controller";

dotenv.config();

const app = new App(
  [new UsersController(), new FriendsController()],
  process.env?.PORT || "8000"
).app;
describe("POST /friends/add", () => {
  it("Adds friend to user with success", (done) => {
    request(app)
      .post("/users")
      .send({ name: "John" })
      .expect(200)
      .end((err, res) => {
        const john: User = res.body;
        request(app)
          .post("/users")
          .send({ name: "Ana" })
          .end((err, res) => {
            const ana: User = res.body;
            request(app)
              .post("/friends/add")
              .send({ userId: john.id, friends: [ana.id] })
              .expect(200)
              .end((err, res) => {
                const user: User = res.body;
                expect(user.friends).toEqual([ana.id]);
                done();
              });
          });
      });
  });
});

describe("POST /friends/add", () => {
  it("Adds friend to user that does not exist", (done) => {
    request(app)
      .post("/friends/add")
      .send({ userId: "1", friends: ["1"] })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("POST /friends/add", () => {
  it("Adds friend that does not exist to user", (done) => {
    request(app)
      .post("/users")
      .send({ name: "John" })
      .expect(200)
      .end((err, res) => {
        const john: User = res.body;
        request(app)
          .post("/friends/add")
          .send({ userId: john.id, friends: ["1"] })
          .expect(404)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });
  });
});
