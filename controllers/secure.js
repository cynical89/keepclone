"use strict";

const config = require("../config.json");
const db = require("../helpers/db");
const noteModel = require("../models/notes");

let user = null;

module.exports.index = function* index() {
	if (this.isAuthenticated()) {
		user = this.session.passport.user;
	}
	yield this.render("secure/index", {
		title: config.site.name,
		user: user
	});
};

module.exports.notes = function* notes() {
  const params = this.request.body;
  if(!params.title && !params.content && !params.author && !params.isPublic
      && !params.isEditable) {
    this.status = 400;
    return this.body = "Invalid request.";
  }
  const author = this.session.passport.user.id;
  let note = noteModel.newNote(params.title, params.content, author, params.isPublic,
      params.isEditable);

  if (params.password) {
    note = noteModel.setPassword(note, params.password);
  }
  note = yield db.saveDocument(note, "notes");

  return this.body = note;
};

module.exports.iseditable = function* iseditable() {
  if(!this.params.isEditable) {
    this.status = 400;
    return this.body = "Invalid request.";
  }
  if(!this.params.id) {
    this.status = 400;
    return this.body = "Invalid request.";
  }
  let note = yield db.getDocument(params.id, "notes");
  note = noteModel.setEditable(note, params.isEditable);
  return note;
};

module.exports.ispublic = function* ispublic() {
  if(!this.params.isPublic) {
    this.status = 400;
    return this.body = "Invalid request.";
  }
  if(!this.params.id) {
    this.status = 400;
    return this.body = "Invalid request.";
  }
  let note = yield db.getDocument(params.id, "notes");
  note = noteModel.setPublic(note, params.isPublic);
  return note;
};

module.exports.password = function* password() {
  if(!this.params.password) {
    this.status = 400;
    return this.body = "Invalid request.";
  }
  if(!this.params.id) {
    this.status = 400;
    return this.body = "Invalid request.";
  }
  let note = yield db.getDocument(params.id, "notes");
  note = noteModel.setPassword(note, params.password);
  return note;
};
