import bodyParser from "body-parser";
const bodyCookiesParserLoader = app => {
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
}
export {
  bodyCookiesParserLoader
}