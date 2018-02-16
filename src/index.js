const Slack = require('./slack');
const { SEND_TO_SLACK, LOG_SUCCEEDED_TESTS } = require('../../../tconf');

export default function () {
  return {
    noColors: false,

    reportTaskStart (startTime, userAgents, testCount) {
      this.startTime = startTime;
      this.testCount = testCount;
      this.agentsInfo = `Running tests in: ${userAgents}`;
      this.failedTests = {};
      this.currentFixture = '';
      this.write(this.chalk.blue(this.agentsInfo)).newline();
    },

    reportFixtureStart (name) {
      this.currentFixture = `*${name}*`;
      this.failedTests[this.currentFixture] = [];
      this.newline().setIndent(1).write(name).newline().newline();
    },

    renderErrors (errs) {
      this.setIndent(3).newline();

      errs.forEach((err, idx) => {
        const prefix = this.chalk.red(`${idx + 1}) `);

        this
          .write(this.formatError(err, prefix))
          .newline()
          .newline();
      });
    },

    printTestSucceeded (test) {
      this
        .setIndent(1)
        .write(this.chalk.green(`${this.symbols.ok} ${test}`))
        .newline();
    },

    printTestFailed (test) {
      this
        .setIndent(1)
        .write(this.chalk.bold.red(test))
        .newline();
    },

    printTestSkipped (test) {
      this
        .setIndent(1)
        .write(this.chalk.cyan(`- ${test}`))
        .newline();
    },

    reportTestDone (name, testInfo) {
      if (testInfo.errs.length) {
        const errorTest = `✗ ${name}`;

        this.failedTests[this.currentFixture].push(errorTest);
        this.printTestFailed(errorTest);
        this.renderErrors(testInfo.errs);
        return;
      }
      if (testInfo.skipped) {
        this.printTestSkipped(name);
        return;
      }
      if (LOG_SUCCEEDED_TESTS) {
        this.printTestSucceeded(name);
      }
    },

    processSuccess (text, durationStr) {
      const resultMessage = `${this.testCount}/${this.testCount} tests passed (Duration: ${durationStr})`;

      text = `${text}\n\`${resultMessage}\``;
      this.newline().write(this.chalk.bold.green(resultMessage)).newline().newline();

      if (SEND_TO_SLACK) {
        Slack.sendSuccessMessage(text);
      }
    },

    processFailure (text, passed, duration) {
      Object.keys(this.failedTests).forEach(fixture => {
        if (this.failedTests[fixture].length) {
          text = `${text}\n${fixture}\n`;
          this.failedTests[fixture].forEach(testName => {
            text = `${text}\n\t${testName}`;
          });
          text = `${text}\n`;
        }
      });
      const resultMessage = `${this.testCount - passed}/${this.testCount} tests failed (Duration: ${duration})`;

      text = `${text}\n*\`${resultMessage}\`*`;
      this.setIndent(1).newline().write(this.chalk.bold.red(resultMessage)).newline().newline();

      if (SEND_TO_SLACK) {
        Slack.sendErrorMessage(text);
      }
    },

    reportTaskDone (endTime, passed) {
      const durationMs = endTime - this.startTime;
      const duration = this.moment.duration(durationMs).format('h[h] mm[m] ss[s]');
      const text = `*${this.agentsInfo}*\n`;

      if (passed === this.testCount) {
        this.processSuccess(text, duration);
        return;
      }

      this.processFailure(text, passed, duration);
    }
  };
}
