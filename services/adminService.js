const imgur = require('imgur-node-api');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

const db = require('../models');
const Restaurant = db.Restaurant;
const Category = db.Category;

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category],
    }).then((restaurants) => {
      callback({ restaurants });
    });
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category],
    }).then((restaurant) => {
      //console.log(restaurant);
      callback({ restaurant });
    });
  },
  postRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', messages: 'name did not exist.' });
      // req.flash('error_messages', 'name did not exist.');
      // return res.redirect('back');
    }
    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId,
        }).then(() => {
          callback({
            status: 'success',
            messages: 'restaurant was successfully created.',
          });
          // req.flash('success_messages', 'restaurant was successfully created.');
          // res.redirect('/admin/restaurants');
        });
      });
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId,
      }).then(() => {
        callback({
          status: 'success',
          messages: 'restaurant was successfully created.',
        });
        // req.flash('success_messages', 'restaurant was successfully created');
        // return res.redirect('/admin/restaurants');
      });
    }
  },
  putRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', messages: 'name did not exist.' });
    }
    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id).then((restaurant) => {
          restaurant
            .update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId,
            })
            .then(() => {
              callback({
                status: 'success',
                messages: 'restaurant was successfully to update',
              });
              // req.flash(
              //   'success_messages',
              //   'restaurant was successfully to update',
              // );
              // res.redirect('/admin/restaurants');
            });
        });
      });
    } else {
      return Restaurant.findByPk(req.params.id).then((restaurant) => {
        restaurant
          .update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId,
          })
          .then(() => {
            callback({
              status: 'success',
              messages: 'restaurant was successfully to update',
            });
            // req.flash(
            //   'success_messages',
            //   'restaurant was successfully to update',
            // );
            // res.redirect('/admin/restaurants');
          });
      });
    }
  },
  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id).then((restaurant) => {
      restaurant.destroy().then(() => {
        callback({ status: 'success', messages: '' });
      });
    });
  },
};

module.exports = adminService;
