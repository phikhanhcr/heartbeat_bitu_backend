import express from 'express';
import { authRouter } from './authRoute';
import { userRouter } from './userRoute';
const route = express.Router();

let initialRouter = (app) => {

  authRouter(route, app);
  userRouter(route, app);
    
}

export {
  initialRouter
}