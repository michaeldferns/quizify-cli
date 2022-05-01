const prompts = require('prompts');
const logout = require('./logout');
const quit = require('../quit');
const listQuizzes = require('./listQuizzes');
const listResults = require('./listResults');
const getQuiz = require('./getQuiz');
const takeQuiz = require('./takeQuiz');
const createQuiz = require('./createQuiz');

const privateRootConfig = {
  type: 'select',
  name: 'privateAnswer',
  message: 'What would you like to do?',
  initial: 0,
  choices: [
    {
      title: 'Create Quiz',
      value: 'createquiz',
    },
    {
      title: 'List Quizzes',
      value: 'listquizzes',
    },
    {
      title: 'Get Quiz',
      value: 'getquiz',
    },
    {
      title: 'Take Quiz',
      value: 'takequiz',
    },
    {
      title: 'List Results',
      value: 'listresults',
    },
    {
      title: 'Log Out',
      value: 'logout',
    },
    {
      title: 'Quit',
      value: 'quit',
    },
  ],
};

const private = async () => {
  const { privateAnswer } = await prompts(privateRootConfig);

  if (privateAnswer === 'createquiz') {
    await createQuiz();
  } else if (privateAnswer === 'listquizzes') {
    await listQuizzes();
  } else if (privateAnswer === 'getquiz') {
    await getQuiz();
  } else if (privateAnswer === 'takequiz') {
    await takeQuiz();
  } else if (privateAnswer === 'listresults') {
    await listResults();
  } else if (privateAnswer === 'logout') {
    await logout();
  } else if (privateAnswer === 'quit') {
    await quit();
  }
};

module.exports = private;
