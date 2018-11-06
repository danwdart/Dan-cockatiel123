const sinon = require('sinon');
const mock = require('mock-require');

describe('Books route', () => {
  it('returns the correct books', async () => {
    const user = {
        institutions: [
          1,
          2,
          3
        ]
      },
      req = {
        session: {
          passport: {
            user
          }
        }
      },
      res = {
        status: sinon.stub().callsFake(() => res),
        json: sinon.stub()
      },
      jsonBooks = [
        {
          bookData: 'book data'
        }
      ],
      Book = {
        find: sinon.stub().callsFake(() => jsonBooks)
      };
    mock('../../../models/book', Book);
    const books = require('../../../routes/books');
            
    await books(req, res);

    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, jsonBooks);
    sinon.assert.calledWith(Book.find, {institutions: {$in: user.institutions}});
  });
});