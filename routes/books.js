const Book = require('../models/book');

/**
 * Retrieves books from a collection.
 */
module.exports = async (req, res) => {
  const user = req.session.passport.user;
  const institutionIds = user.institutions;
  res.status(200).json(
    await Book.find({
      institutions: {
        $in: institutionIds
      }
    })
  );
};