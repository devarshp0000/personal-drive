module.exports.makeCreateFolder =
  ({ mkdir, existsSync, join, config }) =>
  async (req, res) => {
    let { folderName } = req.body;
    folderName = decodeURIComponent(folderName);
    const folderPath = join(config.uploadPath, folderName);
    if (existsSync(folderPath))
      return res.status(406).send('Folder already exists');
    try {
      await mkdir(folderPath);
      res.send('Folder created successfully.');
    } catch (error) {
      res.sendStatus(500);
    }
  };
