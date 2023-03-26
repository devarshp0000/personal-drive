module.exports.makeGetDownloadableFile =
  ({ config, join, stat, getMimeType, createReadStream }) =>
  async (req, res) => {
    const { fileName, folderName } = req.params;
    const filePath = join(config.uploadPath, folderName, fileName);
    const stats = await stat(filePath);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-type', getMimeType(filePath));
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    const readStream = createReadStream(filePath, {
      highWaterMark: 50 * 1024 * 1024,
      autoClose: true,
    });
    readStream.pipe(res);
  };
