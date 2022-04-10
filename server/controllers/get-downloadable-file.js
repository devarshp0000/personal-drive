module.exports.makeGetDownloadableFile =
  ({ config, join, statSync, getMimeType, createReadStream }) =>
  (req, res) => {
    const { fileId } = req.params;
    const files = require(config.filesJSONPath);

    const file = files.find((file) => file.id === fileId);
    if (!file) return res.sendStatus(404);
    const filePath = join(config.uploadPath, file.name);
    const stats = statSync(filePath);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-type', getMimeType(filePath));
    res.setHeader('Content-Disposition', 'attachment; filename=' + file.name);
    const readStream = createReadStream(filePath, {
      highWaterMark: 50 * 1024 * 1024,
      autoClose: true,
    });
    readStream.pipe(res);
  };
