const assert = require('assert').strict;
const fetch = require('node-fetch');


describe('GET /books', () => {
  it('returns disallowed upon no cookie', async () => {
    const response = await (
      await fetch(
        'http://localhost:3000/books',
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      )
    ).json();

    assert.deepEqual(
      {
        'data': {
          'error': 'You are not authorised to access this resource.'
        },
        'status': 'fail'
      },
      response
    );
  });
});