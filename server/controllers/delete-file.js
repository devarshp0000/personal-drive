module.exports.makeDeleteFile =
  ({ config, unlink, join }) =>
  async (req, res) => {
    const { fileName, folderName } = req.params;

    const folderPath = join(config.uploadPath, folderName);
    const filePath = join(folderPath, fileName);
    await unlink(filePath);
    res.send('Deleted successfully');
  };
