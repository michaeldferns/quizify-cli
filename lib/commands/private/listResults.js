const quizService = require('../../services/quizService');
const storeService = require('../../services/storeService');
const handlePrivateError = require('../../utils/handlePrivateError');

const listResults = async () => {
  try {
    await quizService.populateResults();
    await storeService.listResults();
  } catch (err) {
    console.log(err);
    handlePrivateError(err);
  }
};

module.exports = listResults;
