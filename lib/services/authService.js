const api = require('../utils/api');
const storeService = require('./storeService');

const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', {
      email: email.toLowerCase(),
      password,
    });

    const { token } = response.data;

    // HANDLE SETTING TOKEN IN STORE
    await storeService.setKey('authenticated', true);
    await storeService.setKey('token', token);
  },
  async signup(email, password) {
    await api.post('/auth/signup', { email: email.toLowerCase(), password });
  },
};

module.exports = authService;
