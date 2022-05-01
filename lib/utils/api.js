const axios = require('axios');
const chalk = require('chalk');
const { writeFile } = require('fs');

const api = axios.create({
  baseURL: 'http://myapp-env.eba-duiux8t4.us-east-1.elasticbeanstalk.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // Unauthorized
      writeFile('store.json', JSON.stringify({}), () => {
        console.log(chalk.red('Unauthorized response. Logging out.'));
      });
    }

    return Promise.reject(err);
  }
);

module.exports = api;
