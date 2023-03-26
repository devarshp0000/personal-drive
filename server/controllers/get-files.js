module.exports.makeGetFiles =
  ({ config, readdir, stat, join }) =>
  async (req, res) => {
    let { folderName } = req.params;

    const folderPath = join(config.uploadPath, folderName);
    const files = await readdir(folderPath);

    const filesData = await Promise.all(
      files.map(async (file) => {
        return {
          name: file,
          size: (await stat(join(folderPath, file))).size,
        };
      })
    );
    res.send(filesData);
  };
