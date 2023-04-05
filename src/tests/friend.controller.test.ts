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
describe("POST /friends/add-friends", () => {
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
            const user: User = res.body;
            request(app)
              .post(`/users/${user.id}/add-friends`)
              .send([john.id])
              .expect(200)
              .end((err, res) => {
                const user: User = res.body;
                expect(user.friends).toEqual([john.id]);
                done();
              });
          });
      });
  });
});

describe("POST /friends/add-friends", () => {
  it("Adds friend to user that does not exist", (done) => {
    request(app)
      .post("/users/1/add-friends")
      .send([1])
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("POST /friends/add-friends", () => {
  it("Adds friend that does not exist to user", (done) => {
    request(app)
      .post("/users")
      .send({ name: "John" })
      .expect(200)
      .end((err, res) => {
        const john: User = res.body;
        request(app)
          .post(`/users/${john.id}/add-friends`)
          .send(["1"])
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });
  });
});

describe("GET /friends/find-path-to", () => {
  it("Finds shortes path from a user to another", (done) => {
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
              .post(`/users/${ana.id}/add-friends`)
              .send([john.id])
              .expect(200)
              .end((err, res) => {
                request(app)
                  .get(`/users/${ana.id}/find-path-to/${john.id}`)
                  .expect(200)
                  .end((err, res) => {
                    const steps: number = res.body;
                    expect(steps).toEqual(2);
                    done();
                  });
              });
          });
      });
  });

  it("Finds no path from a user to another", (done) => {
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
              .get(`/users/${ana.id}/find-path-to/${john.id}`)
              .expect(200)
              .end((err, res) => {
                const path: string[] = res.body;
                expect(path).toEqual([]);
                done();
              });
          });
      });
  });
});
