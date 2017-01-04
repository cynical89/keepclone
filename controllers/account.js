"use strict";

const config = require("../config.json");
const userModel = require("../models/users");
const db = require("../helpers/db")

let user = null;

module.exports.login = function* login() {
	yield this.render("login");
};

module.exports.signup = function* signup() {
	const params = this.request.body;
	if(!params.username) {
		this.status = 400;
		return this.body = "You must supply a username";
	}
	if(!params.password) {
		this.status = 400;
		return this.body = "You must supply a password";
	}
	let user = yield db.getDocument(params.username, "users");
	if (user.error === true) {
		user = userModel.newUser(params.username, params.password);
		user = yield db.saveDocument(user, "users");
		return this.redirect("/login");
	} else {
		this.status = 400;
		return this.body = "An account with this username already exists";
	}
}

module.exports.logout = function* logout() {
	yield this.logout();
	return this.redirect("/");
};
