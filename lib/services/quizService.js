const api = require('../utils/api');
const FormData = require('form-data');
const storeService = require('./storeService');
const { URLSearchParams } = require('url');

const quizService = {
  async populateQuizzes() {
    const token = await storeService.getKey('token');

    const response = await api.get('/quiz', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { quizzes } = response.data;

    await storeService.setKey('quizzes', quizzes);
  },
  async getQuiz(quizId) {
    const token = await storeService.getKey('token');

    const response = await api.get(`/quiz/${quizId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { quiz } = response.data;

    return quiz;
  },
  async takeQuiz(quizId) {
    const token = await storeService.getKey('token');

    const response = await api.get(`/attempt/${quizId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { quizConfig } = response.data;

    return quizConfig;
  },
  async updateAttempt(attemptId, completed) {
    const token = await storeService.getKey('token');

    await api.patch(
      `/attempt/${attemptId}`,
      {
        completed,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  async updateAttemptResponse(attemptId, responseId, selectedResponseId) {
    const token = await storeService.getKey('token');

    await api.patch(
      `/attempt/${attemptId}/response/${responseId}`,
      {
        selectedResponseId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  async populateResults() {
    const token = await storeService.getKey('token');

    const response = await api.get('/attempt', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { attempts } = response.data;

    await storeService.setKey('results', attempts);
  },
  async createQuiz(title, time, questions, file) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('time', time);
    formData.append('numQuestions', questions);
    formData.append('config', file, 'config.q');

    const token = await storeService.getKey('token');

    await api.post('/quiz', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        ...formData.getHeaders(),
      },
    });
  },
};

module.exports = quizService;
