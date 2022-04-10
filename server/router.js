const express = require('express');

const {
  deleteFileController,
  getDownloadableFileController,
  getFiles,
  uploadFileController,
  streamableVideoController,
} = require('./controllers');

module.exports = () => {
  const router = express.Router();
  router.post('/upload', uploadFileController);
  router.delete('/files/:fileId', deleteFileController);
  router.get('/files/stream/:fileId', streamableVideoController);
  router.get('/files/:fileId', getDownloadableFileController);
  router.get('/files', getFiles);
  return router;
};
