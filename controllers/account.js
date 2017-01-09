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
	if(!params.email) {
		this.status = 400;
		return this.body = "You must supply a username";
	}
	if(!params.password) {
		this.status = 400;
		return this.body = "You must supply a password";
	}
	let user = yield db.getDocument(params.email, "kcusers");
	if (user.error === true) {
		user = userModel.newUser(params.email, params.password);
		user = yield db.saveDocument(user, "kcusers");
		return this.body = user;
	} else {
		this.status = 400;
		return this.body = "An account with this username already exists";
	}
}

module.exports.logout = function* logout() {
	this.logout();
	return this.redirect("/");
};
