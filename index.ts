import App from "./src/app";
import UsersController from "./src/cotrollers/Users/users.controller";

const app = new App([new UsersController()], 8000);

app.listen();
