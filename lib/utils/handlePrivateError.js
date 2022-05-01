const chalk = require('chalk');

const handlePrivateError = (err) => {
  if (
    err.name === 'InvalidTitleError' ||
    err.name === 'InvalidTimeError' ||
    err.name === 'InvalidQuestionCountError' ||
    err.name === 'InvalidFileError'
  ) {
    console.log(chalk.red(err.message));
  } else if (err?.response?.status === 401) {
    // Do nothing
    // Handled by interceptor
  } else if (err?.response?.status === 404) {
    console.log(chalk.red('Not found. Try again.'));
  } else {
    console.log(chalk.red('Internal error occured. Try again.'));
  }
};

module.exports = handlePrivateError;
