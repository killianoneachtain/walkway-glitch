'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Boom = require('@hapi/boom');

const userSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  lastName: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  type: {
    type: String,
    trim: true,
    required: true
  },
  trailtypes:[ {
    type: String
  }],
});

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email : email});
};

userSchema.statics.findByID = function(id) {
  return this.findOne({ _id : id});
};

userSchema.statics.findByType = function(type) {
  return this.findOne({ type : type});
};

userSchema.methods.comparePassword = function(candidatePassword) {
  const isMatch = this.password === candidatePassword;
  if (!isMatch) {
    throw Boom.unauthorized('Password mismatch');
  }
  return this;
};


module.exports = Mongoose.model('User', userSchema);