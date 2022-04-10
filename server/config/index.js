const { join } = require('path');
module.exports = {
  uploadPath: join(__dirname, '../upload'),
  filesJSONPath: join(__dirname, '../upload/files.json'),
};
