module.exports.makeDeleteFile =
  ({ config, unlinkSync, writeFileSync, join }) =>
  (req, res) => {
    const { fileId } = req.params;
    const files = require(config.filesJSONPath);

    const fileIdx = files.findIndex((file) => file.id === fileId);
    if (fileIdx < 0) return res.sendStatus(404);
    const file = files[fileIdx];
    const filePath = join(config.uploadPath, file.name);
    unlinkSync(filePath);
    files.splice(fileIdx, 1);
    writeFileSync(config.filesJSONPath, JSON.stringify(files));
    res.sendStatus(204);
  };
