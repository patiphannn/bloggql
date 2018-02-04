var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  createdOn: {
    type: Date
  },
  updatedOn: {
    type: Date
  }
});

BlogSchema.pre('save', function(next) {
  var now = new Date();

  if(!this.createdOn) {
    this.createdOn = now;
  } else {
    this.updatedOn = now;
  }

  next();
});

BlogSchema.pre('findOneAndUpdate', function(next) {
  this._update.updatedOn = new Date();
  next();
});

var Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;
