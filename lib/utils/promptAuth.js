const prompts = require('prompts');
const validator = require('validator');

const emailConfig = {
  type: 'text',
  name: 'emailAnswer',
  message: 'Enter email:',
};

const passwordConfig = {
  type: 'password',
  name: 'passwordAnswer',
  message: 'Enter password:',
};

const promptAuth = async () => {
  const { emailAnswer, passwordAnswer } = await prompts([
    emailConfig,
    passwordConfig,
  ]);

  if (!validator.isEmail(emailAnswer)) {
    // Invalid email
    const error = new Error('Invalid email.');
    error.name = 'InvalidEmailError';

    throw error;
  } else if (!validator.isLength(passwordAnswer, { min: 8 })) {
    // Invalid password
    const error = new Error(
      'Password is too short. Must be 8 characters in length.'
    );
    error.name = 'InvalidPasswordError';

    throw error;
  }

  return { emailAnswer, passwordAnswer };
};

module.exports = promptAuth;
