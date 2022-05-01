const chalk = require('chalk');
const promptAuth = require('../../utils/promptAuth');
const handleAuthError = require('../../utils/handleAuthError');
const authService = require('../../services/authService');

const signup = async () => {
  try {
    const { emailAnswer, passwordAnswer } = await promptAuth();

    await authService.signup(emailAnswer, passwordAnswer);

    console.log(chalk.cyan('Successfully signed up.'));
  } catch (err) {
    handleAuthError(err);
  }
};

module.exports = signup;
