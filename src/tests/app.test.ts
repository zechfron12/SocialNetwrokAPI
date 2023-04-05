import request from "supertest";
import App from "../app";
import UsersController from "../cotrollers/Users/users.controller";

const app = new App([new UsersController()], 8000).app;

describe("App", () => {
  it("Should response with code 404", (done) => {
    request(app)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });
});
