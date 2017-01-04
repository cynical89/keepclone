"use strict";

const config = require("../config.json");
const db = require("../helpers/db");
const noteModel = require("../models/notes");

let user = null;

module.exports.index = function* index() {
	if (this.isAuthenticated()) {
		user = this.session.passport.user;
	}
	yield this.render("index", {
		title: config.site.name,
		user: user
	});
};

module.exports.notes = function* notes() {
	if(!this.params.id) {
		this.status = 400;
		return this.body = "Must supply an id";
	}
	const document = yield db.getDocument(this.params.id, "notes");
	if(document.error === true) {
		this.status = 400;
		return document.message;
	}
	if (document.isPublic === false) {
		this.status = 404;
		return this.body = "We can't find this note in our system";
	}

	if (this.isAuthenticated()) {
		user = this.session.passport.user;
	}
	yield this.render("notes", {
		title: config.site.name,
		user: user,
		note: document
	});
};

module.exports.signup = function* signup() {
	if (this.isAuthenticated()) {
		user = this.session.passport.user;
	}
	yield this.render("signup", {
		title: config.site.name,
		user: user
	});
};

module.exports.edit = function* edit() {
	const params = this.request.body;
	if(!params.id) {
		this.status = 400;
		return this.body = "You must supply an id.";
	}
	let note = yield db.getDocument(params.id, "notes");
	if(note.isPublic === false) {
		this.status = 404;
		return this.body = "We can't find this note in our system";
	}
	if(!params.content) {
		this.status = 400;
		return this.body = "Invalid request";
	}
	if(note.isEditable === false && note.author !== this.session.passport.user.id) {
		if(!params.password) {
			this.status = 400;
			return this.body = "Sorry, The author of this note has locked it"
		}
		if(note.password === params.password) {
			note = noteModel.editNote(note, params.content);
			return note;
		}
		this.status = 400;
		return this.body = "Sorry, The author of this note has locked it"
	}
	note = noteModel.editNote(note, params.content);
	return note;
};
