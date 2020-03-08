'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const CategorySchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  category: [ String ],
  trails: [
    {
      type: Array,
      ref: 'Trail'
    }
  ]
});

CategorySchema.statics.findByID = function(id) {
  return this.findOne({ _id : id});
};

CategorySchema.statics.findByTitle = function(title) {
  return this.find({ title : title});
};


module.exports = Mongoose.model('Category', CategorySchema);