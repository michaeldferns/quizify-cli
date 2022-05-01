const chalk = require('chalk');
const moment = require('moment');
const prompts = require('prompts');
const validator = require('validator');
const quit = require('../commands/quit');
const quizService = require('../services/quizService');

const quizNavigation = {
  PREVIOUS: {
    title: 'previous question',
    value: 'previous',
  },
  SKIP: {
    title: 'skip question',
    value: 'skip',
  },
  NEXT: {
    title: 'next question',
    value: 'next',
  },
  SUBMIT: {
    title: 'submit quiz',
    value: 'submit',
  },
};

class Quiz {
  constructor(quizConfig) {
    this.quizConfig = quizConfig;
    this.startTime = Date.now();
    this.complete = false;
    this.expired = false;
    this.submitted = false;
    this.currentQuestion = 0;
  }

  set quizCompleted(value) {
    this.complete = value;
  }

  get quizCompleted() {
    return this.complete;
  }

  set timerExpired(value) {
    this.expired = value;
  }

  get timerExpired() {
    return this.expired;
  }

  set isSubmitted(value) {
    this.submitted = value;
  }

  get isSubmitted() {
    return this.submitted;
  }

  async askCurrentQuestion() {
    const { text, selectedResponseId, responses, attemptResponseId } =
      this.quizConfig.questions[this.currentQuestion];

    let initial = 0;

    if (selectedResponseId !== null) {
      initial = responses.findIndex(
        (response) => response.responseId === selectedResponseId
      );
    }

    const currentQuestionConfig = {
      type: 'select',
      name: 'questionAnswer',
      message: text,
      initial,
      choices: responses.map((response) => {
        return {
          title: response.text,
          value: response.responseId,
        };
      }),
    };

    // Push navigation
    if (
      this.currentQuestion === 0 &&
      this.currentQuestion < this.quizConfig.questions.length - 1 &&
      selectedResponseId === null
    ) {
      currentQuestionConfig.choices.push(quizNavigation.SKIP);
    } else if (
      this.currentQuestion === 0 &&
      this.currentQuestion < this.quizConfig.questions.length - 1 &&
      selectedResponseId !== null
    ) {
      currentQuestionConfig.choices.push(quizNavigation.NEXT);
    } else if (
      this.currentQuestion !== 0 &&
      this.currentQuestion < this.quizConfig.questions.length - 1 &&
      selectedResponseId === null
    ) {
      currentQuestionConfig.choices.push(quizNavigation.PREVIOUS);
      currentQuestionConfig.choices.push(quizNavigation.SKIP);
    } else if (
      this.currentQuestion !== 0 &&
      this.currentQuestion < this.quizConfig.questions.length - 1 &&
      selectedResponseId !== null
    ) {
      currentQuestionConfig.choices.push(quizNavigation.PREVIOUS);
      currentQuestionConfig.choices.push(quizNavigation.NEXT);
    } else {
      currentQuestionConfig.choices.push(quizNavigation.PREVIOUS);
      currentQuestionConfig.choices.push(quizNavigation.SUBMIT);
    }

    const { questionAnswer } = await prompts(currentQuestionConfig);

    if (!this.timerExpired) {
      if (questionAnswer === 'skip') {
        // Increment index
        // No request
        this.currentQuestion += 1;

        console.log(chalk.cyan('Skipping to next question.'));
        this.printRemainingTime();
      } else if (questionAnswer === 'previous') {
        // Decrement
        // No Request
        console.log('here');
        this.currentQuestion -= 1;

        console.log(chalk.cyan('Returning to previous question.'));
        this.printRemainingTime();
      } else if (questionAnswer === 'next') {
        // Increment
        // No Request
        this.currentQuestion += 1;

        console.log(
          chalk.cyan(
            'Proceeding to next question. (previously saved answer will be used)'
          )
        );
        this.printRemainingTime();
      } else if (questionAnswer === 'submit') {
        this.currentQuestion += 1;

        console.log(chalk.cyan('Proceeding to submit.'));
        this.printRemainingTime();
      } else if (questionAnswer !== undefined) {
        this.quizConfig.questions[this.currentQuestion].selectedResponseId =
          questionAnswer;

        if (this.currentQuestion !== this.quizConfig.questions.length - 1) {
          console.log(chalk.cyan('Proceeding to next question.'));
        } else {
          console.log(chalk.cyan('Proceeding to submit.'));
        }

        this.printRemainingTime();

        await quizService.updateAttemptResponse(
          this.quizConfig.attemptId,
          attemptResponseId,
          questionAnswer
        );

        this.currentQuestion += 1;
      }

      if (this.currentQuestion === this.quizConfig.questions.length) {
        this.quizCompleted = true;
      }
    } else {
      // Timer expired during question
      console.log(
        chalk.cyan('Timer expired during the question. Proceeding to submit.\n')
      );
      this.quizCompleted = true;
    }
  }

  async submit() {
    if (this.timerExpired) {
      // Timer Expired - Forced Submission

      await quizService.updateAttempt(this.quizConfig.attemptId, true);
      this.isSubmitted = true;

      console.log(chalk.cyan('Quiz submitted.\n'));
    } else {
      const searchUnfinished = this.quizConfig.questions.findIndex(
        (question) => question.selectedResponseId === null
      );

      const quizUnfinished = searchUnfinished !== -1;

      if (quizUnfinished) {
        const handleUnfinishedConfig = {
          type: 'select',
          name: 'handleUnfinishedAnswer',
          message:
            'Would you like to return to the quiz to handle unresponded question(s)?',
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

        const { handleUnfinishedAnswer } = await prompts(
          handleUnfinishedConfig
        );

        if (!this.timerExpired) {
          if (handleUnfinishedAnswer === 'yes') {
            this.currentQuestion -= 1;
            this.quizCompleted = false;

            console.log(chalk.cyan('Returning to quiz.'));
            this.printRemainingTime();

            return;
          }
        } else {
          console.log(chalk.cyan('Timer expired during the question.\n'));

          await quizService.updateAttempt(this.quizConfig.attemptId, true);
          this.isSubmitted = true;

          console.log(chalk.cyan('Quiz submitted.\n'));
          return;
        }
      }

      const submitConfig = {
        type: 'select',
        name: 'submitAnswer',
        message: 'Would you like to submit the quiz?',
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

      const { submitAnswer } = await prompts(submitConfig);

      if (!this.timerExpired) {
        if (submitAnswer === 'no') {
          this.currentQuestion -= 1;
          this.quizCompleted = false;

          console.log(chalk.cyan('Returning to quiz.'));
          this.printRemainingTime();
        } else {
          await quizService.updateAttempt(this.quizConfig.attemptId, true);
          this.isSubmitted = true;

          console.log(chalk.cyan('Quiz submitted.\n'));
        }
      } else {
        console.log(chalk.cyan('Timer expired during the question.\n'));

        await quizService.updateAttempt(this.quizConfig.attemptId, true);
        this.isSubmitted = true;

        console.log(chalk.cyan('Quiz submitted.\n'));
      }
    }
  }

  printRemainingTime() {
    if (this.quizConfig.time) {
      const configTime = this.quizConfig.time;
      const startTime = moment(Date.now());
      const endTime = moment(this.startTime + configTime * 1000);

      const duration = moment.duration(endTime.diff(startTime));
      const formatted = moment
        .utc(duration.asMilliseconds())
        .format('HH:mm:ss');

      console.log(chalk.cyan(`Time Remaining: ${formatted}\n`));
    } else {
      console.log();
    }
  }

  printResults() {
    if (this.submitted) {
      let correctCount = 0;

      this.quizConfig.questions.forEach((question) => {
        if (question.correctResponseId === question.selectedResponseId) {
          correctCount += 1;
        }
      });

      console.log(
        chalk.cyan(
          `Results:\n# Questions: ${
            this.quizConfig.questions.length
          }\n# Correct: ${correctCount}\nScore: ${Math.floor(
            (correctCount / this.quizConfig.questions.length) * 100
          )}%\n`
        )
      );
    }
  }
}

module.exports = Quiz;
