module.exports.makeGetFolders =
  ({ config, readdir, stat, join }) =>
  async (req, res) => {
    const dirSize = async (directory) => {
      const files = await readdir(directory);
      const stats = files.map((file) => stat(join(directory, file)));

      return (await Promise.all(stats)).reduce(
        (accumulator, { size }) => accumulator + size,
        0
      );
    };
    try {
      const dirs = await readdir(config.uploadPath);

      res.send(
        await Promise.all(
          dirs.map(async (dir) => {
            return {
              name: dir,
              size: await dirSize(join(config.uploadPath, dir)),
            };
          })
        )
      );
    } catch (error) {
        console.log(error);
      res.sendStatus(500);
    }
  };
