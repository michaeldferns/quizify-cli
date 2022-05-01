#!/usr/bin/env node

const chalk = require('chalk');
const { Command } = require('commander');
const { readFile } = require('fs/promises');
const public = require('./lib/commands/public');
const private = require('./lib/commands/private');

const program = new Command();

program.name('quizify').version('2.0.0').parse();

const main = async () => {
  while (true) {
    const storeData = await readFile('store.json', 'utf-8');
    const store = JSON.parse(storeData);

    if (store.authenticated) {
      await private();
    } else {
      await public();
    }
  }
};

main();

[
  `exit`,
  `SIGINT`,
  `SIGUSR1`,
  `SIGUSR2`,
  `uncaughtException`,
  `SIGTERM`,
].forEach((eventType) => {
  process.on(eventType, () => {
    // Clean Up
    console.log(chalk.cyan('Quitting the application.'));

    process.exit();
  });
});
