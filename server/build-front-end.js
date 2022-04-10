const { execSync } = require('child_process');

module.exports = () => {
  process.env.BUILD_FRONTEND === '1' && execSync('cd ../client && npm run build');
};
