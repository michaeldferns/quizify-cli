const chalk = require('chalk');
const path = require('path');
const prompts = require('prompts');
const { access, readFile } = require('fs/promises');
const validator = require('validator');
const quizService = require('../../services/quizService');
const handlePrivateError = require('../../utils/handlePrivateError');

const quizTitleConfig = {
  type: 'text',
  name: 'quizTitleAnswer',
  message: 'Enter a name for the created quiz.',
};

const quizTimeConfig = {
  type: 'text',
  name: 'quizTimeAnswer',
  message:
    'Enter the time limit in seconds for the created quiz. (enter "0" or nothing for unlimited time)',
};

const numQuestionConfig = {
  type: 'text',
  name: 'numQuestionAnswer',
  message: 'Enter the number of questions to use in attempts. (integer value)',
};

const filePathConfig = {
  type: 'text',
  name: 'filePathAnswer',
  message: 'Enter a relative path to the configuration file.',
};

const createQuiz = async () => {
  try {
    const {
      quizTitleAnswer,
      quizTimeAnswer,
      numQuestionAnswer,
      filePathAnswer,
    } = await prompts([
      quizTitleConfig,
      quizTimeConfig,
      numQuestionConfig,
      filePathConfig,
    ]);

    let filePath = '';

    // Handle Title Check
    if (!quizTitleAnswer || quizTitleAnswer === '') {
      const error = new Error('Invalid quiz title.');
      error.name = 'InvalidTitleError';

      throw error;
    }

    // Handle Time Check
    if (quizTimeAnswer && !validator.isInt(quizTimeAnswer)) {
      const error = new Error('Invalid quiz time.');
      error.name = 'InvalidTimeError';

      throw error;
    }

    // Handle Questions Answer
    if (numQuestionAnswer && !validator.isInt(numQuestionAnswer)) {
      const error = new Error('Invalid quiz question count.');
      error.name = 'InvalidQuestionCountError';

      throw error;
    }

    // Handle File
    if (!filePathAnswer) {
      const error = new Error('Invalid file path input.');
      error.name = 'InvalidFileError';

      throw error;
    } else {
      filePath = path.join(process.cwd(), filePathAnswer);

      try {
        await access(filePath);
      } catch (err) {
        const error = new Error('Invalid file path input.');
        error.name = 'InvalidFileError';

        throw error;
      }
    }

    const fileData = await readFile(filePath);

    await quizService.createQuiz(
      quizTitleAnswer,
      quizTimeAnswer,
      numQuestionAnswer,
      fileData
    );

    console.log(chalk.cyan('New quiz created successfully.\n'));
  } catch (err) {
    console.log(err.response.data);
    handlePrivateError(err);
  }
};

module.exports = createQuiz;
