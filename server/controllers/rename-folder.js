module.exports.makeRenameFolder =
  ({ rename, existsSync, join, config }) =>
  async (req, res) => {
    const { folderName } = req.params;
    const { newFolderName } = req.body;
    const folderPathOld = join(config.uploadPath, folderName);
    const folderPathNew = join(config.uploadPath, newFolderName);
    if (!existsSync(folderPathOld))
      return res.status(406).send('Folder does not exists');
    try {
      await rename(folderPathOld, folderPathNew);
      res.send('Folder renamed successfully.');
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  };
