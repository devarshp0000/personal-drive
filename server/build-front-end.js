const { execSync } = require('child_process');

module.exports = () => {
  if (process.env.BUILD_FRONTEND === '1') {
    const resp = execSync('cd ../client && npm run build').toString();
    console.log(resp);
  }
};
