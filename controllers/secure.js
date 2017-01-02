const config = require("../config.json");

let user;

module.exports.index = function index(req, res) {
  if(this.isAuthenticated()) {
  res.render("secure/index", {
    layout: "secure",
    title: config.site.name,
    user: user,
    script: "notedrag"
  });
  } else {
    res.redirect("/login")
  }
};

module.exports.submitNotes = function submitNote(req, res) {
  res.status(400).send("Posting to notes is not implemented fully")
}
