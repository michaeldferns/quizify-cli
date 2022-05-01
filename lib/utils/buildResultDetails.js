const buildResultDetails = (result) => {
  let correct = 0;

  result.AttemptResponses.forEach((attemptResponse) => {
    if (
      attemptResponse.correctResponseId === attemptResponse.selectedResponseId
    ) {
      correct += 1;
    }
  });

  const details = `ID: ${result.id}\nQuiz ID: ${result.quizId}\nCompleted: ${
    result.completed
  }\n# Questions: ${result.AttemptResponses.length}\nScore: ${Math.floor(
    (correct / result.AttemptResponses.length) * 100
  )}%\nCompleted At: ${new Date(result.updatedAt).toLocaleString()}`;

  return details;
};

module.exports = buildResultDetails;
