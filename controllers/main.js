const config = require("../config.json");

module.exports.index = function index(req, res) {
  res.render("index", {
    title: config.site.name
  });
};
