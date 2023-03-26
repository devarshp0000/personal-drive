const express = require('express');

const {
  deleteFileController,
  getDownloadableFileController,
  getFiles,
  uploadFileController,
  createFolderController,
  deleteFolderController,
  renameFolderController,
  getFoldersController,
} = require('./controllers');

module.exports = () => {
  const router = express.Router();

  router.post('/folders', createFolderController);
  router.get('/folders', getFoldersController);
  router.delete('/folders/:folderName', deleteFolderController);
  router.put('/folders/:folderName', renameFolderController);

  router.get('/folders/:folderName/files', getFiles);
  router.post('/folders/:folderName/files', uploadFileController);
  router.delete('/folders/:folderName/files/:fileName', deleteFileController);
  router.get(
    '/folders/:folderName/files/:fileName',
    getDownloadableFileController
  );

  return router;
};
