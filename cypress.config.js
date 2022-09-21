const { defineConfig } = require('cypress');

module.exports = defineConfig({
  env: {
    API_PATH: 'http://localhost:55001/plone',
  },
  e2e: {
    viewportWidth: 1440,
    viewportHeight: 660,
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
