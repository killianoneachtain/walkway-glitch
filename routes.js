'use strict';

const Accounts = require('./app/controllers/accounts');
const Walkways = require('./app/controllers/walkways');
const Admin = require('./app/controllers/admin');
const Gallery = require('./app/controllers/gallery');

module.exports = [
  { method: 'GET', path: '/', config: Accounts.index },

  { method: 'GET', path: '/login', config: Accounts.showLogin },
  { method: 'GET', path: '/logout', config: Accounts.logout },

  { method: 'GET', path: '/signup', config: Accounts.showSignup },
  { method: 'POST', path: '/signup', config: Accounts.signup },

  { method: 'POST', path: '/login', config: Accounts.login },

  { method: 'GET', path: '/home', config: Walkways.home },
  { method: 'GET', path: '/admin', config: Admin.admin },

  { method: 'GET', path: '/settings', config: Accounts.showSettings },
  { method: 'GET', path: '/adminsettings', config: Accounts.showSettings },

  { method: 'POST', path: '/adminsettings', config: Accounts.updateSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },

  { method: 'GET', path: '/addPOI', config: Walkways.trailform },
  { method: 'POST', path: '/addPOI', config: Walkways.addtrail },

  { method: 'GET', path: '/editTrail/{id}', config: Walkways.showTrail },
  { method: 'POST', path: '/saveTrail/{id}', config: Walkways.updateTrail },
  { method: 'GET', path: '/deleteTrail/{id}', config: Walkways.deleteTrail },

  { method: 'GET', path: '/viewPOI/{id}', config: Walkways.viewTrail },

  { method: 'GET', path:  '/deleteUser/{id}', config: Admin.deleteUser },

  { method: 'GET', path: '/gallery', config: Gallery.index },
  { method: 'POST', path: '/uploadfile/{id}', config: Gallery.uploadFile },
  { method: 'GET', path: '/deleteimage/{id}/{foldername}/{imagename}', config: Gallery.deleteImage },


  { method: 'GET', path: '/viewUser/{id}', config: Admin.viewUser },
  { method: 'POST', path: '/viewUser/{id}', config: Admin.resetPassword },


  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: './public'
      }
    },
    options: { auth: false }
  }
];