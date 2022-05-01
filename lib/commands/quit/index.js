const prompts = require('prompts');
const chalk = require('chalk');
const storeService = require('../../services/storeService');

const quitConfig = {
  type: 'select',
  name: 'quitAnswer',
  message: 'Would you like to terminate the application?',
  initial: 0,
  choices: [
    {
      title: 'No',
      value: 'no',
    },
    {
      title: 'Yes',
      value: 'yes',
    },
  ],
};

const quit = async () => {
  try {
    const { quitAnswer } = await prompts(quitConfig);

    if (quitAnswer === 'yes') {
      await storeService.clearStore();
      process.exit();
    } else {
      console.log(chalk.cyan('Returning to application.'));
    }
  } catch (err) {
    console.log(chalk.red('An error occured. Try again.'));
  }
};

module.exports = quit;
