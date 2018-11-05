const Institution = require('../models/institution'),
  User = require('../models/user');
  
/**
 * Creates a user
 */
module.exports.create = async (req, res) => {
  try {
    const {
      email,
      name,
      password
    } = req.body;

    // Ideally we'd use a validation library here, but we have time constraints
    // At the moment we're just using one failed field at once.
    if (!email) {
      return res.status(400).json({
        status: 'fail',
        data: {
          email: 'Email is a required parameter.'
        }
      });
    }

    // We could use a regexp or a library but for time, just using smaller checks
    if (!email.includes('@')) {
      return res.status(400).json({
        status: 'fail',
        data: {
          email: 'Email should be a valid email address.'
        }
      });
    }

    if (!name) {
      return res.status(400).json({
        status: 'fail',
        data: {
          name: 'Name is a required parameter.'
        }
      });
    }

    if (!password) {
      return res.status(400).json({
        status: 'fail',
        data: {
          name: 'Password is a required parameter.'
        }
      });
    }

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

    return res.end(
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
