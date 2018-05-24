const view = require('think-view');
const model = require('think-model');
const cache = require('think-cache');
const session = require('think-session');
const mongoose = require('think-mongoose');
const fetch = require('think-fetch');

module.exports = [
  fetch, // HTTP request client.
  view, // make application support view
  model(think.app),
  mongoose(think.app),
  cache,
  session
];
