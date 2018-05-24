// default config
const https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
  key: fs.readFileSync(path.join(think.ROOT_PATH, 'src/ssl/server.key')),
  cert: fs.readFileSync(path.join(think.ROOT_PATH, 'src/ssl/server.crt'))
};

module.exports = {
  workers: 1,
};
