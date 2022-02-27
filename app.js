const express = require("express");
var cors = require('cors');
var cookieParser = require('cookie-parser');

const app = express();

app.use(cors({ origin: true, optionsSuccessStatus: 200, credentials: true }));
app.options( "*", cors({ origin: true, optionsSuccessStatus: 200, credentials: true }) );


app.use(express.json(),cookieParser());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000

app.listen(port);

const authRouter = require('./controller/authRouter');
app.use('/', authRouter);

const userRouter = require('./controller/userRouter');
const { urlencoded } = require("express");
app.use('/', userRouter);
