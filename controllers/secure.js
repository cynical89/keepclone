const config = require("../config.json");

module.exports.index = function index(req, res) {
  res.render("secure/index", {
    layout: "secure",
    title: config.site.name
  });
};
