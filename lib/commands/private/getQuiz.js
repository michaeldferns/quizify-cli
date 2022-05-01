const chalk = require('chalk');
const prompts = require('prompts');
const validator = require('validator');
const quizService = require('../../services/quizService');
const buildQuizDetails = require('../../utils/buildQuizDetails');
const handlePrivateError = require('../../utils/handlePrivateError');

const quizConfig = {
  type: 'text',
  name: 'quizAnswer',
  message: 'Enter the ID of the quiz to retrieve details for.',
};

const getQuiz = async () => {
  try {
    const { quizAnswer } = await prompts(quizConfig);

    if (!validator.isInt(quizAnswer) || parseInt(quizAnswer) <= 0) {
      console.log(chalk.red('The entered value is not a valid id. Try again'));
    }

    const quiz = await quizService.getQuiz(quizAnswer);

    console.log(chalk.cyan(buildQuizDetails(quiz)));
  } catch (err) {
    handlePrivateError(err);
  }
};

module.exports = getQuiz;
