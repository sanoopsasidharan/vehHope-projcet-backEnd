var express = require("express");
const createError = require("http-errors");
var path = require("path");
const cors = require("cors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
require("./config/connection");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const shopRouter = require("./routes/shop");

var app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/hi", indexRouter);
app.use("/", usersRouter);
app.use("/shop", shopRouter);

// error handler
app.use((req, res, next) => next(createError.NotFound()));

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

module.exports = app;
