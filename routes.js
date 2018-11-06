const {requireLogin} = require('./lib/filters');

module.exports = app => {
  /* Routes start */
  const index = require('./routes/index.js');
  const users = require('./routes/users.js');
  const books = require('./routes/books.js');

  app.get('/', index);
  app.post('/users/create', users.create);
  app.get('/books', requireLogin, books);
  /* Routes End */
};