module.exports.makeGetFiles =
  ({ config }) =>
  async (req, res) => {
    const filesJSON = require(config.filesJSONPath);
    res.send(filesJSON);
  };
