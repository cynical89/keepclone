"use strict";

const Chance = require("chance");
const chance = new Chance();

module.exports = {
  newNote: (title, content, author, isPublic, isEditable, password = null) => {
    const note = {
			id: chance.guid(),
      title: title,
      content: content,
      author: author,
      isPublic: isPublic,
      isEditable: isEditable,
      password: password
    }
		return note;
  },
  getUsersNotes: (notes, user) => {
    let userNotes;
    for (var note of notes) {
      if (note.author = user.id) {
        userNotes.push(note);
      }
    }
    return userNotes;
  },
  setPublic: (note, isPublic) => {
    note.isPublic = isPublic;
    return note;
  },
  setEditable: (note, isEditable) => {
    note.isEditable = isEditable;
    return note;
  },
  setPassword: (note, password) => {
    note.password = password;
    return note;
  },
  editNote: (note, content) => {
    note.content = content;
    return note;
  }
};
