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
  let note;
  const id = req.params.id;
  req.db.collection.findOne({_id:id}, (err, doc) => {
    if (err) {
      res.status("400").send(err);
    }
    note = doc;
  })
  res.render("notes", {
    title: config.site.name,
    note: doc
  });
}
