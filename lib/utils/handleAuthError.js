const chalk = require('chalk');

const handleAuthError = (err) => {
  if (err.name === 'InvalidEmailError') {
    console.log(chalk.red(err.message));
  } else if (err.name === 'InvalidPasswordError') {
    console.log(chalk.red(err.message));
  } else if (err?.response?.status === 400 || err?.response?.status === 401) {
    const { message } = err.response?.data;

    if (message) {
      console.log(chalk.red(message));
    } else {
      console.log(chalk.red('Invalid input.'));
    }
  } else {
    console.log(chalk.red('Internal error occured. Try again.'));
  }
};

module.exports = handleAuthError;
