'use strict';

const cloudinary = require('cloudinary').v2;
const User = require('../models/user');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const Trail = require('../models/trail');

const ImageStore = {
  configure: function() {
    const credentials = {
      cloud_name: process.env.name,
      api_key: process.env.key,
      api_secret: process.env.secret
    };
    cloudinary.config(credentials);
  },

  getAllImages: async function() {
    const result = await cloudinary.api.resources();
    return result.resources;
  },

  getUserImages: async function(trail_id) {
    const result = await cloudinary.api.resources_by_tag(trail_id);
    console.log("RESULTS FROM getUserImages : ",result);
    return result.resources;
  },

  uploadImage: async function(imagefile, user_id, trail_id) {

    let trail = await Trail.find( { _id : trail_id });
    let trailname = trail[0].trailname;
    let folder = user_id + '/' + trailname;

    await writeFile('./public/temp.img', imagefile);
    const uploaded_image = await cloudinary.uploader.upload('./public/temp.img', { folder: folder,
        tags: [user_id, trail_id, trailname], width: 600, height: 600, gravity: "east", crop: 'pad',
        fetch_format: "auto", type: 'authenticated', quality_analysis: true, format: 'jpg' },
      function(error,result) {console.log("Error is :", error)} );

    let this_trail = trail[0];
    this_trail.images.push(uploaded_image.public_id);
    await this_trail.save();

    console.log("Uploaded image is : ", uploaded_image);
  },

  deleteImage: async function(id) {
    try {
      console.log("VALUE OF ID is : ", id);
      let deleteFunction = await cloudinary.api.delete_resources([id], {type: 'authenticated' },function(error, result)
      { console.log( "RESULT: ",result,error) });
      console.log("result of delete is ", deleteFunction);
    } catch (err) {
      console.log(err);
    }
  },

};

module.exports = ImageStore;