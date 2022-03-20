
import { bodyCookiesParserLoader } from './loaders/body_parser'
import { helmetLoader } from './loaders/helmet'
import { corsLoader } from './loaders/cors'
import { initialRouter } from "./routes"
import { rateLimitLoader } from './loaders/rate_limit'

const initApp = (app) => {

   bodyCookiesParserLoader(app);

   helmetLoader(app);
   
   corsLoader(app);

   rateLimitLoader(app);

   initialRouter(app);
}


export {
   initApp,
}


