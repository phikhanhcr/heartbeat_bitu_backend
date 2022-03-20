import cors  from "cors";
const corsLoader = app => {
  app.use(cors())
}
export {
  corsLoader
}