const express = require("express");
var cookieParser = require('cookie-parser');

const app = express();
app.use(express.json(),cookieParser());
app.listen(3000);

const authRouter = require('./controller/authRouter');
app.use('/', authRouter);

const userRouter = require('./controller/userRouter');
app.use('/', userRouter);

