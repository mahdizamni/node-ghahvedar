console.log("IN THE NAME OF ALLAH");
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//require env
require('dotenv').config();
// connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use(express.static(__dirname + '/public'));
app.use('/',require('./controller/index'));
app.listen(process.env.PORT, () => {
    console.log("I'm Running On Port ", process.env.PORT);
});
