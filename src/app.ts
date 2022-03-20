
import { bodyCookiesParserLoader } from './loaders/body_parser'
import { helmetLoader } from './loaders/helmet'
import { corsLoader } from './loaders/cors'
import { initialRouter } from "./routes"


const initApp = (app) => {

   bodyCookiesParserLoader(app);

   helmetLoader(app);
   
   corsLoader(app);

   initialRouter(app);
}


export {
   initApp,
}


