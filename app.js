const express = require("express");
var cors = require('cors');
var cookieParser = require('cookie-parser');

const app = express();

app.use(cors({ origin: true, optionsSuccessStatus: 200, credentials: true }));
app.options( "*", cors({ origin: true, optionsSuccessStatus: 200, credentials: true }) );
app.use(function(req, res, next) {
    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
})

app.use(express.json(),cookieParser());
app.use(express.urlencoded({ extended: true }));
app.listen(3000);

const authRouter = require('./controller/authRouter');
app.use('/', authRouter);

const userRouter = require('./controller/userRouter');
const { urlencoded } = require("express");
app.use('/', userRouter);
