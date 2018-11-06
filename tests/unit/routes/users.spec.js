const sinon = require('sinon');
const mock = require('mock-require');

const Institution = class {},
  User = class {};

mock('../../../models/institution', Institution);
mock('../../../models/user', User);

const users = require('../../../routes/users');

describe('users route', () => {
  it('errors if no email', () => {
    const req = {
        body: {
        }
      },
      res = {
        json: sinon.stub(),
        status: sinon.stub().callsFake(() => res)
      };

    users.create(req, res);
    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(
      res.json,
      {
        status: 'fail',
        data: {
          email: 'Email is a required parameter.'
        }
      }
    );
  });

  it('errors if email invalid', () => {
    const req = {
        body: {
          email: 'invalidEmail'
        }
      },
      res = {
        json: sinon.stub(),
        status: sinon.stub().callsFake(() => res)
      };

    users.create(req, res);
    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(
      res.json,
      {
        status: 'fail',
        data: {
          email: 'Email should be a valid email address.'
        }
      }
    );
  });

  it('errors if account exists', async () => {
    const user = {
      name: 'I exist'
    };
    User.findOne = sinon.stub().callsFake(async () => user);
    const req = {
        body: {
          email: 'email@domain.com'
        }
      },
      res = {
        json: sinon.stub(),
        status: sinon.stub().callsFake(() => res)
      };

    await users.create(req, res);

    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(
      res.json,
      {
        status: 'fail',
        data: {
          email: 'User already exists.'
        }
      }
    );
    sinon.assert.calledWith(
      User.findOne,
      {
        email: req.body.email
      }
    );
  });

  it('errors if no name', async () => {
    const user = null;
    User.findOne = sinon.stub().callsFake(async () => user);
    const req = {
        body: {
          email: 'email@domain.com'
        }
      },
      res = {
        json: sinon.stub(),
        status: sinon.stub().callsFake(() => res)
      };

    await users.create(req, res);

    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(
      res.json,
      {
        status: 'fail',
        data: {
          name: 'Name is a required parameter.'
        }
      }
    );
    sinon.assert.calledWith(
      User.findOne,
      {
        email: req.body.email
      }
    );
  });

  it('errors if no password', async () => {
    const user = null;
    User.findOne = sinon.stub().callsFake(async () => user);
    const req = {
        body: {
          email: 'email@domain.com',
          name: 'Dan Dart'
        }
      },
      res = {
        json: sinon.stub(),
        status: sinon.stub().callsFake(() => res)
      };

    await users.create(req, res);

    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(
      res.json,
      {
        status: 'fail',
        data: {
          password: 'Password is a required parameter.'
        }
      }
    );
    sinon.assert.calledWith(
      User.findOne,
      {
        email: req.body.email
      }
    );
  });

  it('errors if password too short', async () => {
    const user = null;
    User.findOne = sinon.stub().callsFake(async () => user);
    const req = {
        body: {
          email: 'email@domain.com',
          name: 'Dan Dart',
          password: 'bob'
        }
      },
      res = {
        json: sinon.stub(),
        status: sinon.stub().callsFake(() => res)
      };

    await users.create(req, res);

    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(
      res.json,
      {
        status: 'fail',
        data: {
          password: 'Password should be more than 8 characters in length.'
        }
      }
    );
    sinon.assert.calledWith(
      User.findOne,
      {
        email: req.body.email
      }
    );
  });

  it('errors if institution invalid', async () => {
    const user = null;
    User.findOne = sinon.stub().callsFake(async () => user);
    User.ROLES = ['role1', 'role2', 'role3'];
    Institution.findOne = sinon.stub().callsFake(async () => false);
    const req = {
        body: {
          email: 'email@domain.com',
          name: 'Dan Dart',
          password: 'bobbobbobbob'
        }
      },
      res = {
        json: sinon.stub(),
        status: sinon.stub().callsFake(() => res)
      };

    await users.create(req, res);

    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(
      res.json,
      {
        status: 'fail',
        data: {
          email: 'Registration on this email domain is currently disallowed.'
        }
      }
    );
    sinon.assert.calledWith(
      User.findOne,
      {
        email: req.body.email
      }
    );
    sinon.assert.calledWith(
      Institution.findOne,
      {
        domain: 'domain.com'
      }
    );
  });

  it('creates user with correct parameters', async () => {
    const user = null;
    User.prototype.save = sinon.stub().callsFake(async () => {});
    User.prototype.toJSON = () => ({});
    User.findOne = sinon.stub().callsFake(async () => user);
    User.ROLES = ['role1', 'role2', 'role3'];
    Institution.findOne = sinon.stub().callsFake(async () => ({institutionInfo: ''}));
    const req = {
        body: {
          email: 'email@domain.com',
          name: 'Dan Dart',
          password: 'bobbobbobbob'
        }
      },
      res = {
        json: sinon.stub(),
        status: sinon.stub().callsFake(() => res)
      };

    await users.create(req, res);

    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(
      res.json,
      {
        status: 'success',
        data: {}
      }
    );
    sinon.assert.calledWith(
      User.findOne,
      {
        email: req.body.email
      }
    );
    sinon.assert.calledWith(
      Institution.findOne,
      {
        domain: 'domain.com'
      }
    );
    sinon.assert.calledOnce(
      User.prototype.save
    );
  });
});

/*

    // Just a basic check right now, nothing too fancy
    if (8 > password.length) {
      return res.status(400).json({
        status: 'fail',
        data: {
          name: 'Password should be more than 8 characters in length.'
        }
      });
    }

    // For now we're just creating students
    const role = User.ROLES[0];

    // e.g. ['me', 'domain.com']
    const institutionDomainParts = email.split('@'),
      // get the end part - split[1] does not guarantee this will be correct.
      institutionDomain = institutionDomainParts[institutionDomainParts.length - 1];
    
    const institution = await Institution.findOne(
      {
        domain: institutionDomain
      },
      {
        domain: true // just the one field, we just need to know it exists
      }
    );

    if (!institution) {
      return res.status(400).json({
        status: 'fail',
        email: {
          name: 'Registration on this email domain is currently disallowed.'
        }
      });
    }

    const model = new User({
      name,
      email,
      password,
      role,
      institutions: [institution]
    });

    await model.save();

    return res.status(200).json(
      {
        status: 'success',
        data: model
      }
    );
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      data: {
        stack: err.stack
      }
    });
  }
};

*/