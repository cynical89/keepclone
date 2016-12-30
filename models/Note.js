var mongoose = require('mongoose');

var NoteSchema = mongoose.Schema({
  title: {
    type: String
  },
  content: {
    type: String
  },
  author: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isEditable: {
    type: Boolean,
    default: false
  },
  editpassword: {
    type: String
  }
});

var Note = module.export = mongoose.model('Note', NoteSchema);