const prompts = require('prompts');
const login = require('./login');
const signup = require('./signup');
const quit = require('../quit');

const publicRootConfig = {
  type: 'select',
  name: 'publicAnswer',
  message: 'What would you like to do?',
  initial: 0,
  choices: [
    {
      title: 'Login',
      value: 'login',
    },
    {
      title: 'Sign Up',
      value: 'signup',
    },
    {
      title: 'Quit',
      value: 'quit',
    },
  ],
};

const public = async () => {
  const { publicAnswer } = await prompts(publicRootConfig);

  if (publicAnswer === 'login') {
    await login();
  } else if (publicAnswer === 'signup') {
    await signup();
  } else if (publicAnswer === 'exit') {
    await quit();
  } else {
    await quit();
  }
};

module.exports = public;
