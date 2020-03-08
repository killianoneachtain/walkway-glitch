'use strict';

const User = require('../models/user');
const Trail = require('../models/trail');
const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');
const ImageStore = require('../utils/image-store');
const cloudinary = require('cloudinary').v2;


const Admin = {
  admin: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id).lean();
        let type = "user";
        const members = await User.find({ type: type }).lean();

        let total_users = members.length;

        const assets = await cloudinary.api.resources( function(error, result) {console.log(result, error); });

        let total_resources = assets.resources.length;

        let total_images = 0;

        const rates = [assets.rate_limit_allowed, assets.rate_limit_remaining, assets.rate_limit_reset_at ];

        for (let i=0; i < assets.resources.length; i++)
        {
          if ( assets.resources[i].resource_type === 'image')
          {
            total_images++;
          }
        }


        return h.view('admin', { title: 'Administrator Home', user: user, members: members, total_users: total_users,
        total_resources: total_resources, total_images: total_images, rates: rates });
      }
      catch (err) {
        return h.view('login', { errors: [{ message: err.message }] });
      }
    }
  },
  deleteUser: {
    handler: async function(request, h) {
      try {
        const id = request.params.id;
        const user = await User.findById(id).lean();
        const trails = await Trail.findByCreator(id).lean();

        let user_images=[];
        if (user_images.length > 0)
        {

          for (let index = 0; index < trails.length; index++) {
            let image_index = 0;
            let current_images = trails[index].images;
            for (image_index = 0; image_index < current_images.length; image_index++) {
              try {
                user_images.push(current_images[image_index]);
              } catch (err) {
                console.log(err);
              }
            }
          }

          for (let index = 0; index < user_images.length; index++) {
            try {
              await ImageStore.deleteImage(user_images[index]);
            } catch (err) {
              console.log(err);
            }
          }

          try {
            await cloudinary.api.delete_folder(user._id, function(error, result) {
              console.log(result);
            });
          } catch (err) {
            console.log(err);
          }
        }

        try {
          await Trail.deleteMany( { creator: user._id } );
        } catch (err) {
          console.log(err);
        }

        try {
          await User.deleteOne({ _id: user._id });
        } catch (err) {
          console.log(err);
        }

        let type = "user";
        const members = await User.find({ type: type }).lean();

        return h.redirect('/admin', {members: members});
      }
      catch (err) {
        return h.view('admin', { errors: [{ message: err.message }] });
      }
    }
   },
  viewUser: {
    handler: async function(request, h) {
      try {
        const id = request.params.id;
        const user = await User.findById(id).lean();

        let username = user.firstName + ' ' + user.lastName;

        const walkways = await Trail.find( { creator: id }).populate('trail').lean();

        let POI_total = walkways.length;

        let total_images = 0;

        for (let i =0; i < walkways.length; i++)
        {
          let imageNumber = walkways[i].images.length;
          total_images = total_images + imageNumber;
        }

        return h.view('viewUser', { title: username + ' Details', walkways: walkways,
          user: user, POI_total: POI_total, total_images: total_images});
      }
      catch (err) {
        return h.view('admin', { errors: [{ message: err.message }] });
      }
    }
  },
  resetPassword: {
    validate: {
      payload: {
        new_password: Joi.string()
          .min(8)
          .max(15)
          .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
          //.error((errors) => ('"Password" requires at least ONE special character.'))
          .required().required(),
        confirm_password: Joi.ref('new_password')
      },
      options: {
        abortEarly: false
      },
      failAction: async function(request, h, error) {
        const id = request.params.id;
        const user = await User.findById(id).lean();
        if (!user) {
          throw Boom.unauthorized();
        }
        const walkways = await Trail.find( { creator: id }).populate('trail').lean();
        let POI_total = walkways.length;
        let total_images = 0;
        for (let i =0; i < walkways.length; i++)
        {
          let imageNumber = walkways[i].images.length;
          total_images = total_images + imageNumber;
        }
        return h.view('viewUser', {
            title: 'Password Reset error',
            errors: error.details,
            walkways: walkways,
            user: user,
            POI_total: POI_total,
            total_images: total_images
          })
          .takeover()
          .code(400);
      }
    },
    handler: async function(request, h) {
      try {
        const id = request.params.id;
        const user = await User.findById(id);
        if (!user) {
          throw Boom.unauthorized();
        }

        const passwordEdit = request.payload.new_password;

        user.password = passwordEdit;
        await user.save();

        return h.redirect('/viewUser/' + user._id, {user: user });
      } catch (err)
      {
        console.log(err);
      }
    }
  }
};

module.exports = Admin;