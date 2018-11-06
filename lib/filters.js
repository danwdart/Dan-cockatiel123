module.exports.requireLogin = (req, res, next) => {
  if (!req.url.startsWith('/auth') && !req.session.user) {
    return res.status(403).send(
      {
        status: 'fail',
        data: {
          error: 'You are not authorised to access this resource.'
        }
      }
    );
  }
  next();
};