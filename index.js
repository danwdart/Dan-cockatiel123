const express = require('express');
const bodyParser = require('body-parser');
const sessions = require('client-sessions');
const mongoose = require('mongoose');
const passport = require('./lib/passport');
const routes = require('./routes');

// This should be an environment variable like process.env[MONGODB_STRING]
// but it means we can't just `npm start`.
mongoose.connect('mongodb://localhost/dancockatiel', { useNewUrlParser: true });

const app = express();

app.use(bodyParser.json());

app.use(sessions({
  cookieName: 'session',
  secret: 'YouShouldProbablyReplaceThisBecauseItsASecurityRisk',
  duration: 24 * 60 * 60 * 1000,
  activeDuration: 1000 * 60 * 5,
  httpOnly: true,
  ephemeral: false
}));

passport(app);
routes(app);

app.listen(3000, () => console.log('Open http://localhost:3000 to see a response.'));