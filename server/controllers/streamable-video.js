module.exports.makeStreamableVideo =
  ({ config, join, statSync, getMimeType, createReadStream }) =>
  (req, res) => {
    const range = req.headers.range;
    if (!range) {
      res.status(400).send('Requires Range header');
    }

    const { fileId } = req.params;
    const files = require(config.filesJSONPath);

    const file = files.find((file) => file.id === fileId);
    if (!file) return res.sendStatus(404);
    const videoPath = join(config.uploadPath, file.name);

    const videoSize = statSync(videoPath).size;

    const CHUNK_SIZE = 5 * (10 ** 6); // 1MB
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': getMimeType(videoPath),
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
  };
