const express = require("express")
const cors = require('cors');
const dotenv = require("dotenv")
const app = express();
app.use(
    cors({
      origin: "*",
    })
  );

  //connecting to database atlas mongodb
dotenv.config({path: './config.env'});
const PORT = process.env.PORT;
const bodyParser = require('body-parser');

app.use(express.json())

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//linking the routing
app.use(require('./router/route'))

app.listen(PORT, ()=>{
    console.log('Customer server is running : ',PORT);
})
