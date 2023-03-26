const {
  createWriteStream,
  createReadStream,
  existsSync,
  promises: { readdir, stat, unlink, mkdir, rm, rename },
} = require('fs');
const { join } = require('path');
const { getType } = require('mime');

const config = require('../config');

const { makeUploadFile } = require('./upload-file');
const { makeDeleteFile } = require('./delete-file');
const { makeGetDownloadableFile } = require('./get-downloadable-file');
const { makeGetFiles } = require('./get-files');
const { makeStreamableVideo } = require('./streamable-video');
const { makeCreateFolder } = require('./create-folder');
const { makeDeleteFolder } = require('./delete-folder');
const { makeRenameFolder } = require('./rename-folder');
const { makeGetFolders } = require('./get-folders');

module.exports = {
  uploadFileController: makeUploadFile({
    config,
    createWriteStream,
    join,
  }),
  deleteFileController: makeDeleteFile({
    config,
    join,
    unlink,
  }),
  getDownloadableFileController: makeGetDownloadableFile({
    config,
    createReadStream,
    getMimeType: getType,
    join,
    stat,
  }),
  getFiles: makeGetFiles({
    config,
    join,
    readdir,
    stat,
  }),
  streamableVideoController: makeStreamableVideo({
    config,
    createReadStream,
    getMimeType: getType,
    join,
    // statSync,
  }),
  createFolderController: makeCreateFolder({
    config,
    existsSync,
    join,
    mkdir,
  }),
  deleteFolderController: makeDeleteFolder({
    config,
    existsSync,
    join,
    rm,
  }),
  renameFolderController: makeRenameFolder({
    config,
    existsSync,
    join,
    rename,
  }),
  getFoldersController: makeGetFolders({
    config,
    join,
    readdir,
    stat,
  }),
};
