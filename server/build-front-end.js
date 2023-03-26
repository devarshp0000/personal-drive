const { execSync } = require('child_process');

module.exports = () => {
  if (process.env.BUILD_FRONTEND === '1') {
    const resp = execSync('cd ../client2 && npm run build').toString();
    console.log(resp);
  }
};
