import { Authentication } from "../controllers";
import { checkAuthentication } from "../middleware/checkAuthentication";
const { body } = require("express-validator");
let authRouter = (route, app) => {
  route.post(
    "/login",
    body("username").notEmpty(),
    body("password").isLength({ min: 6 }),
    Authentication.login
  );
  route.post(
    "/register",
    body("username").notEmpty(),
    body("password").isLength({ min: 6 }),
    Authentication.register
  );
  route.post("/get-user", checkAuthentication, Authentication.getUserByToken);
  
  route.post(
    "/get-access-token",
    body("refreshToken").notEmpty(),
    Authentication.getAccessToken
  );

  return app.use("/api/auth", route);
};

export { authRouter };
