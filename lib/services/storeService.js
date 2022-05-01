const chalk = require('chalk');
const { readFile, writeFile } = require('fs/promises');
const buildQuizDetails = require('../utils/buildQuizDetails');
const buildResultDetails = require('../utils/buildResultDetails');

const storeService = {
  async setKey(key, value) {
    const data = await readFile('store.json', 'utf-8');
    const json = JSON.parse(data);

    json[key] = value;

    await writeFile('store.json', JSON.stringify(json));
  },
  async getKey(key) {
    const data = await readFile('store.json', 'utf-8');
    const json = JSON.parse(data);

    return json[key];
  },
  async clearStore() {
    await writeFile('store.json', JSON.stringify({}));
  },
  async listQuizzes() {
    const quizzes = await this.getKey('quizzes');

    quizzes.forEach((quiz, index) => {
      if (index < quizzes.length - 1) {
        console.log(chalk.cyan(`${buildQuizDetails(quiz)}\n`));
      } else {
        console.log(chalk.cyan(buildQuizDetails(quiz)));
      }
    });
  },
  async listResults() {
    const results = await this.getKey('results');

    results.forEach((result, index) => {
      if (index < results.length - 1) {
        console.log(chalk.cyan(`${buildResultDetails(result)}\n`));
      } else {
        console.log(chalk.cyan(buildResultDetails(result)));
      }
    });
  },
};

module.exports = storeService;
