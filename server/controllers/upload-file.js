module.exports.makeUploadFile =
  ({ createWriteStream, config, join }) =>
  (req, res) => {
    const { folderName } = req.params;
    req.pipe(req.busboy);

    req.busboy.on('file', (fieldName, incomingStream, file) => {
      const uploadStartTimeStamp = Date.now();
      console.log(`Uploading of ${file.filename} started`);

      const fileWriteStream = createWriteStream(
        join(config.uploadPath, folderName, file.filename)
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
      });
    });
  };
