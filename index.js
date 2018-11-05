const express = require('express');
const bodyParser = require('body-parser');
const sessions = require('client-sessions');
const mongoose = require('mongoose');
const passport = require('./lib/passport');
const {requireLogin} = require('./lib/filters');

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

// These could be in a separate library like routes.js
/* Routes start */
const index = require('./routes/index.js');
const users = require('./routes/users.js');
const books = require('./routes/books.js');

app.get('/', index);
app.post('/users/create', users.create);
app.get('/books', requireLogin, books);
/* Routes End */

app.listen(3000, () => console.log('Open http://localhost:3000 to see a response.'));