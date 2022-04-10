module.exports.makeUploadFile =
  ({ createWriteStream, getUUID, config, writeFileSync, join, statSync }) =>
  (req, res) => {
    req.pipe(req.busboy);

    req.busboy.on('file', (fieldName, incomingStream, file) => {
      const uploadStartTimeStamp = Date.now();
      console.log(`Uploading of ${file.filename} started`);

      const fileWriteStream = createWriteStream(
        join(config.uploadPath,  file.filename)
      );

      incomingStream.pipe(fileWriteStream);
      fileWriteStream.on('error', (err) => console.log(err));

      fileWriteStream.on('close', () => {
        console.log(
          `Upload completed for ${file.filename} in ${
            (Date.now() - uploadStartTimeStamp) / 1000
          } seconds`
        );
        res.send('Uploaded Successfully');
        const files = require(config.filesJSONPath);
        files.push({
          id: getUUID(),
          name: file.filename,
          size: statSync(join(config.uploadPath,  file.filename)).size
        });
        writeFileSync(config.filesJSONPath, JSON.stringify(files));
      });
    });
  };
