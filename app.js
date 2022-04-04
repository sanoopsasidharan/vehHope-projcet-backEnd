var express = require("express");
const createError = require("http-errors");
var path = require("path");
const cors = require("cors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
require("dotenv").config();
require("./config/connection");

var adminRouter = require("./routes/admin");
var usersRouter = require("./routes/users");
const shopRouter = require("./routes/shop");
const conversationRouter = require("./routes/conversations");
const messageRouter = require("./routes/messages");

var app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/", usersRouter);
app.use("/admin", adminRouter);
app.use("/shop", shopRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);
// app.use("/admin", adminRouter);

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
