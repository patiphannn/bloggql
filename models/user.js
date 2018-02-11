import mongoose from 'mongoose';
import crypto from 'crypto';

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {},
  github: {},
  createdOn: {
    type: Date
  },
  updatedOn: {
    type: Date
  }
});

UserSchema.pre('save', function(next) {
  var now = new Date();

  if(!this.createdOn) {
    this.createdOn = now;
  } else {
    this.updatedOn = now;
  }

  next();
});

// UserSchema.pre('findOneAndUpdate', function(next) {
//   this._update.updatedOn = new Date();
//   next();
// });

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    // Handle new/update passwords
    if(!this.isModified('password')) {
      return next();
    }

    if(!validatePresenceOf(this.password)) {
      if(authTypes.indexOf(this.provider) === -1) {
        return next(new Error('Invalid password'));
      } else {
        return next();
      }
    }

    // Make salt with a callback
    this.makeSalt((saltErr, salt) => {
      if(saltErr) {
        return next(saltErr);
      }
      this.salt = salt;
      this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
        if(encryptErr) {
          return next(encryptErr);
        }
        this.password = hashedPassword;
        return next();
      });
    });
  });

  /**
   * Methods
   */
  UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} password
     * @param {Function} callback
     * @return {Boolean}
     * @api public
     */
    authenticate(password, callback) {
      if(!callback) {
        return this.password === this.encryptPassword(password);
      }

      this.encryptPassword(password, (err, pwdGen) => {
        if(err) {
          return callback(err);
        }

        if(this.password === pwdGen) {
          return callback(null, true);
        } else {
          return callback(null, false);
        }
      });
    },

    /**
     * Make salt
     *
     * @param {Number} [byteSize] - Optional salt byte size, default to 16
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    makeSalt(...args) {
      let byteSize;
      let callback;
      let defaultByteSize = 16;

      if(typeof args[0] === 'function') {
        callback = args[0];
        byteSize = defaultByteSize;
      } else if(typeof args[1] === 'function') {
        callback = args[1];
      } else {
        throw new Error('Missing Callback');
      }

      if(!byteSize) {
        byteSize = defaultByteSize;
      }

      return crypto.randomBytes(byteSize, (err, salt) => {
        if(err) {
          return callback(err);
        } else {
          return callback(null, salt.toString('base64'));
        }
      });
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    encryptPassword(password, callback) {
      if(!password || !this.salt) {
        if(!callback) {
          return null;
        } else {
          return callback('Missing password or salt');
        }
      }

      var defaultIterations = 10000;
      var defaultKeyLength = 64;
      var salt = new Buffer(this.salt, 'base64');

      if(!callback) {
        // eslint-disable-next-line no-sync
        return crypto.pbkdf2Sync(password, salt, defaultIterations,
            defaultKeyLength, 'sha1')
          .toString('base64');
      }

      return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength,
        'sha1', (err, key) => {
          if(err) {
            return callback(err);
          } else {
            return callback(null, key.toString('base64'));
          }
        });
    }
  };

var User = mongoose.model('User', UserSchema);
module.exports = User;
