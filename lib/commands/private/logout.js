const chalk = require('chalk');
const storeService = require('../../services/storeService');

const logout = async () => {
  try {
    await storeService.clearStore();
    console.log(chalk.cyan('Successfully logged out.'));
  } catch (err) {
    handlePrivateError(err);
  }
};

module.exports = logout;
