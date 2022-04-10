const {
  createWriteStream,
  writeFileSync,
  unlinkSync,
  createReadStream,
  statSync,
} = require('fs');
const { join } = require('path');
const { getType } = require('mime');
const { v4: getUUID } = require('uuid');
const config = require('../config');

const { makeUploadFile } = require('./upload-file');
const { makeDeleteFile } = require('./delete-file');
const { makeGetDownloadableFile } = require('./get-downloadable-file');
const { makeGetFiles } = require('./get-files');
const { makeStreamableVideo } = require('./streamable-video');

module.exports = {
  uploadFileController: makeUploadFile({
    config,
    createWriteStream,
    getUUID,
    writeFileSync,
    join,
    statSync,
  }),
  deleteFileController: makeDeleteFile({
    config,
    unlinkSync,
    writeFileSync,
    join,
  }),
  getDownloadableFileController: makeGetDownloadableFile({
    config,
    createReadStream,
    getMimeType: getType,
    join,
    statSync,
  }),
  getFiles: makeGetFiles({
    config,
  }),
  streamableVideoController: makeStreamableVideo({
    config,
    createReadStream,
    getMimeType: getType,
    join,
    statSync,
  }),
};
