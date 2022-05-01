const chalk = require('chalk');
const prompts = require('prompts');
const validator = require('validator');
const quizService = require('../../services/quizService');
const buildQuizDetails = require('../../utils/buildQuizDetails');
const handlePrivateError = require('../../utils/handlePrivateError');
const Quiz = require('../../classes/quiz');

const quizConfig = {
  type: 'text',
  name: 'quizAnswer',
  message: 'Enter the ID of the quiz to take.',
};

const confirmConfig = {
  type: 'select',
  name: 'confirmAnswer',
  message: 'Are you sure you want to take this quiz?',
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

const takeQuiz = async () => {
  try {
    const { quizAnswer } = await prompts(quizConfig);

    if (!validator.isInt(quizAnswer) || parseInt(quizAnswer) <= 0) {
      console.log(chalk.red('The entered value is not a valid id. Try again'));
    }

    const quizDetails = await quizService.getQuiz(quizAnswer);

    console.log(chalk.cyan(buildQuizDetails(quizDetails)));

    const { confirmAnswer } = await prompts(confirmConfig);

    if (confirmAnswer === 'no') {
      return;
    }

    const quizAttemptConfig = await quizService.takeQuiz(quizDetails.id);

    const quiz = new Quiz(quizAttemptConfig);

    if (quizAttemptConfig.time) {
      setTimeout(() => {
        quiz.timerExpired = true;
      }, quizAttemptConfig.time * 1000);

      // Print time remaining
      quiz.printRemainingTime();
    }

    while (!quiz.quizCompleted) {
      await quiz.askCurrentQuestion();

      if (quiz.quizCompleted && !quiz.timerExpired) {
        await quiz.submit();
      } else if (quiz.timerExpired) {
        await quiz.submit();
      }

      if (quiz.isSubmitted) {
        quiz.printResults();
      }
    }
  } catch (err) {
    console.log(err);
    handlePrivateError(err);
  }
};

module.exports = takeQuiz;
