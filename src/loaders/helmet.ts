import helmet  from "helmet";
const helmetLoader = app => {
  app.use(helmet())
}
export {
  helmetLoader
}