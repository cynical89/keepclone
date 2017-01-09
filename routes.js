"use strict";

const config = require("./config.json");

const app = require("./index.js").app;
const passport = require("./index.js").passport;
const Router = require("koa-router");

const routes = new Router();

const main = require("./controllers/main.js");
const secure = require("./controllers/secure.js");
const account = require("./controllers/account.js");

// routes

routes.get("/", main.index);
routes.get("/notes/:id", main.notes);
routes.get("/signup", main.signup);
routes.get("/success", main.success);
routes.get("/newnote", secure.newnote);
routes.post("/signup", account.signup);
routes.post("/notes", secure.notes);
routes.post("/notes/edit", main.edit);
routes.post("/notes/editable", secure.iseditable);
routes.post("/notes/public", secure.ispublic);
routes.post("/notes/password", secure.password);

routes.get("/dashboard", secure.index);

// for passport
routes.get("/login", account.login);
routes.get("/logout", account.logout);

// you can add as many strategies as you want
routes.get("/auth/github",
	passport.authenticate("github")
);

routes.get("/auth/github/callback",
	passport.authenticate("github", {
		successRedirect: "/dashboard",
		failureRedirect: "/login"
	})
);

routes.post("/auth/local",
	passport.authenticate("local", {
		successRedirect: "/dashboard",
		failureRedirect: "/login"
	})
);

app.use(routes.middleware());
