module.exports.makeDeleteFolder =
  ({ rm, existsSync, join, config }) =>
  async (req, res) => {
    let { folderName } = req.params;
    folderName = decodeURIComponent(folderName);
    const folderPath = join(config.uploadPath, folderName);
    if (!existsSync(folderPath))
      return res.status(404).send('Folder does not exists');
    try {
      await rm(folderPath, { recursive: true, force: true });
      res.send('Folder deleted successfully.');
    } catch (error) {
      res.sendStatus(500);
    }
  };
