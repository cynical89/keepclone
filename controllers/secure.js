const config = require("../config.json");

module.exports.index = function index(req, res) {
  res.render("secure/index", {
    layout: "secure",
    title: config.site.name,
    script: "notedrag"
  });
};

module.exports.submitNotes = function submitNote(req, res) {
  res.status(400).send("Posting to notes is not implemented fully")
}
