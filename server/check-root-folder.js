module.exports = function () {
  const fs = require("fs");
  const path = require("path");
  if (!fs.existsSync(path.join(__dirname, "upload"))) {
    fs.mkdirSync(path.join(__dirname, "upload"));
  }
};
