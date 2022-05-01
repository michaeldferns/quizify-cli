const quizService = require('../../services/quizService');
const storeService = require('../../services/storeService');
const handlePrivateError = require('../../utils/handlePrivateError');

const listQuizzes = async () => {
  try {
    await quizService.populateQuizzes();
    await storeService.listQuizzes();
  } catch (err) {
    handlePrivateError(err);
  }
};

module.exports = listQuizzes;
