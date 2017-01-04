"use strict";

const db = require("../helpers/db");
const bcrypt = require("bcrypt");

module.exports = {
	newUser: (username, password) => {
		const encrypted = encryptPassword(password);
		const user = {
			error: false,
			id: username,
			password: encrypted
		};
		return user;
	},

	getUser: function* getUser(username, password) {
		const document = yield db.getDocument(username, "users");
    if(document.error === true) {
      return {error: true, message: "There was an issue retrieving user"}
    }
		const passwordMatch = comparePassword(password, document);
		if (!passwordMatch) {
			return {error: true, message: "You must provide valid credentials"};
		}

		return document;
	}
};

function encryptPassword(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
};

function comparePassword(password, doc) {
	/* istanbul ignore next */
	return bcrypt.compareSync(password, doc.password);
};
