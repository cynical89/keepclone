const config = require("../config.json");

module.exports.index = function index(req, res) {
  res.render("index", {
    title: config.site.name,
    script: "notedrag"
  });
};

module.exports.login = function login(req, res) {
  res.render("login", {
    title: config.site.name
  });
};

module.exports.signup = function signup(req, res) {
  res.render("signup", {
    title: config.site.name
  });
};

module.exports.notes = function note(req, res) {
  const id = req.params.id;
  // lookup in mongo db by id
console.log(id);
console.log(req.params);
  res.render("notes", {
    title: config.site.name,
    note: id // note var from mongo
  });
}

module.exports.submitNotes = function submitNote(req, res) {
  res.status(400).send("Posting to notes is not implemented fully")
}

module.exports.submitLogin = function submitLogin(req, res) {
  res.status(400).send("Posting to login is not implemented fully");
};

module.exports.submitSignup = function signup(req, res) {
  res.status(400).send("Posting to signup is not implemented fully");
};
