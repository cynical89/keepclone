"use strict";

const passport = require("../index.js").passport;
const config = require("../config.json");
const co = require("co");

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

const GithubStrategy = require("passport-github").Strategy;
// if we have a port other than 80, add it to our callback url
let port = "";
if (config.site.port !== 80) {
	port = `:${config.site.port}`;
}
passport.use(new GithubStrategy({
	clientID: config.site.oauth.github.clientID,
	clientSecret: config.site.oauth.github.clientSecret,
	callbackURL: `${config.site.oauth.host}${port}/auth/github/callback`
}, (token, tokenSecret, profile, done) => {
	// retrieve user ...
	co(function* auth() {
		// do some async/yield stuff here to get/set profile data
		done(null, profile);
	}).catch(function onError(e) {
		console.error("Something went terribly wrong!");
		console.error(e.stack);
		done(e, null);
	});
}));

const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy((username, password, done) => {
	co(function* auth() {
		const user = yield userModel.getUser(username, password);
		if (user.error === true) {
			done(null, false);
		} else {
			done(null, user);
		}
	}).catch(function onError(e) {
		console.error("Something went terribly wrong!");
		console.error(e.stack);
		done(e, null);
	});
}));
