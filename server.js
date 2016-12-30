const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongo = require("mongodb");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const morgan = require("morgan");
const passport = require("passport");
const expressValidator = require("express-validator");
// Mongoose connectiont to DB
mongoose.connect('mongodb://localhost/keepclone');
var db = mongoose.connection;


const main = require("./controllers/main");
const secure = require("./controllers/secure");

const app = express();

const config = require("./config.json");
const viewdir = __dirname + "/views/";
const basedir = __dirname + "/public/";

app.set("views", viewdir);
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(bodyParser.json()); // Support JSON Encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // Support encoded bodies
app.use(cookieParser()); // Use cookieparser
app.use(express.static(basedir));

// Express Session
app.use(session({
  secret: config.site.secret,
  saveUninitialized: true,
  resave: true,
  cookie: { secure: true }
}));

if(process.env.NODE_ENV = "development") {
  app.use(morgan("dev"));
}

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      const namespace = param.split(".")
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += "[" + namespace.shift() + "]";
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

//Make our db accessible to our router
app.use(function(req, res, next) {
  req.db = db;
  next();
});

app.get("/", main.index);
app.get("/login", main.login);
app.get("/signup", main.signup);
app.get("/dashboard", secure.index);

app.post("/login", main.submitLogin);
app.post("/signup", main.submitSignup);

app.set("port", (process.env.PORT || config.site.port));

app.listen(app.get("port"), function() {
  console.log(config.site.name + " running on port " + app.get("port"));
});
