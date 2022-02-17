const express = require("express");
var cors = require('cors');
var cookieParser = require('cookie-parser');

const app = express();

app.use(cors(),express.json(),cookieParser());
app.use(express.urlencoded({ extended: true }));
app.listen(3000);

const authRouter = require('./controller/authRouter');
app.use('/', authRouter);

const userRouter = require('./controller/userRouter');
const { urlencoded } = require("express");
app.use('/', userRouter);
