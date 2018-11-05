const mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10,
  ROLES = ['student', 'academic', 'administrator'];

const schema = new mongoose.Schema({
  name: String,
  email: String,
  role: {
    type: String,
    enum: ROLES
  },
  password: String,
  institutions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Institution' }]
});

schema.pre('save', async function() {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', schema);
module.exports.ROLES = ROLES;