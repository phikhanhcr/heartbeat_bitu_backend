import { Authentication } from "../controllers";


let authRouter = (route, app) => {
  route.post("/login", Authentication.login)
  route.post("/register", Authentication.register)
  route.post("/get-user", Authentication.getUserByToken)
  route.post("/get-access-token", Authentication.getAccessToken)
  
  return app.use("/api/auth", route);
}

export {
  authRouter
}
