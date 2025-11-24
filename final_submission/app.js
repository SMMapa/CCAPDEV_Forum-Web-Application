import "dotenv/config";
//const result = dotenv.config({path: './final_submission/.env'});
console.log(process.env.MONGODB_URI);
import { dirname } from "path";
import { fileURLToPath } from 'url';
// Web-app related packages
import express from 'express';
import exphbs from 'express-handlebars';


//import { connectToMongo } from "./src/db/conn.js";
import router from "./src/routers/index.js";
import {connectToDB,disconnect} from "./src/db/mg_conn.js";
import sess from "./src/db/sess.js";


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use('/static',express.static(__dirname + '/public'));
app.use(express.json());
app.use(sess);
app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    helpers: {
        eq: (a, b) => a === b,             
        json: (context) => JSON.stringify(context, null, 2)  
    }
}));
app.set("view engine","hbs");
app.set("views","./views");
app.set("view cache", false);
app.use(router);
console.log("URI:" + process.env.MONGODB_URI);

    try {
        await connectToDB();
        app.listen(process.env.SERVER_PORT, () => {
        console.log('Listening');
        })
    }catch(err) {
        console.error(err);
    }

    
