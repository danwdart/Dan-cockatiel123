const assert = require('assert').strict;
const fetch = require('node-fetch');

describe('GET /users/create', () => {
  it('creates full user', async () => {
    const response = await (
      await fetch(
        'http://localhost:3000/users/create',
        {
          body: JSON.stringify({
            email: 'dan@dandart.co.uk',
            name: 'Dan Dart',
            password: 'my-password'
          }),
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
    ).json();

    assert.deepEqual(
      'student',
      response.data.role
    );
  });
});