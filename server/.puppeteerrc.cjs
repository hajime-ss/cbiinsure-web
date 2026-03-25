const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Overrides the standard cache location for Puppeteer.
  // Render's build-to-deploy pipeline rigidly wipes the hidden system ~/.cache folder.
  // By moving Chrome into the local app folder, Render will correctly preserve the Chromium binaries!
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
