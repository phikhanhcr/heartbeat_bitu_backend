import { UserController } from '../controllers'

let userRouter = (route, app) => {

  route.get('/list-user', UserController.getListUser);
  route.post('/like', UserController.likeAction);
  route.post('/unlike', UserController.unLikeAction);

  return app.use("/api/user", route);
}

export {
  userRouter
}
