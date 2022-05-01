const chalk = require('chalk');
const promptAuth = require('../../utils/promptAuth');
const handleAuthError = require('../../utils/handleAuthError');
const authService = require('../../services/authService');

const login = async () => {
  try {
    const { emailAnswer, passwordAnswer } = await promptAuth();

    await authService.login(emailAnswer, passwordAnswer);

    console.log(chalk.cyan('Successfully logged in.'));
  } catch (err) {
    handleAuthError(err);
  }
};

module.exports = login;
