const buildQuizDetails = (quiz) => {
  const details = `ID: ${quiz.id}\nTitle: ${quiz.title}\nTime: ${
    quiz.time
  }\n# Questions: ${quiz.numQuestions}\nCreatedAt: ${new Date(
    quiz.createdAt
  ).toLocaleString()}`;

  return details;
};

module.exports = buildQuizDetails;
