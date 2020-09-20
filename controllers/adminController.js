const db = require('../models');
//const fs = require('fs');
const imgur = require('imgur-node-api');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const Restaurant = db.Restaurant;
const User = db.User;
const Category = db.Category;

const adminService = require('../services/adminService');

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data);
    });
    // return Restaurant.findAll({
    //   raw: true,
    //   nest: true,
    //   include: [Category],
    // }).then((restaurants) => {
    //   //console.log(restaurants[0]);
    //   return res.render('admin/restaurants', { restaurants: restaurants });
    //   // get category name in handlebars:this.Category.name
    // });
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data);
    });
    // return Restaurant.findByPk(req.params.id, {
    //   raw: true,
    //   nest: true,
    //   include: [Category],
    // }).then((restaurant) => {
    //   //console.log(restaurant);
    //   return res.render('admin/restaurant', {
    //     restaurant: restaurant,
    //   });
    // });
  },
  createRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true }).then((categories) => {
      return res.render('admin/create', { categories });
    });
  },
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['messages']);
        return res.redirect('back');
      } else {
        req.flash('success_messages', data['messages']);
        return res.redirect('/admin/restaurants');
      }
    });
    // if (!req.body.name) {
    //   req.flash('error_messages', 'name did not exist.');
    //   return res.redirect('back');
    // }
    // const { file } = req;
    // if (file) {
    //   imgur.setClientID(IMGUR_CLIENT_ID);
    //   imgur.upload(file.path, (err, img) => {
    //     return Restaurant.create({
    //       name: req.body.name,
    //       tel: req.body.tel,
    //       address: req.body.address,
    //       opening_hours: req.body.opening_hours,
    //       description: req.body.description,
    //       image: file ? img.data.link : null,
    //       CategoryId: req.body.categoryId,
    //     }).then(() => {
    //       req.flash('success_messages', 'restaurant was successfully created.');
    //       res.redirect('/admin/restaurants');
    //     });
    //   });
    // } else {
    //   return Restaurant.create({
    //     name: req.body.name,
    //     tel: req.body.tel,
    //     address: req.body.address,
    //     opening_hours: req.body.opening_hours,
    //     description: req.body.description,
    //     image: null,
    //     CategoryId: req.body.categoryId,
    //   }).then(() => {
    //     req.flash('success_messages', 'restaurant was successfully created');
    //     return res.redirect('/admin/restaurants');
    //   });
    // }
  },
  editRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true }).then((categories) => {
      return Restaurant.findByPk(req.params.id, { raw: true }).then(
        (restaurant) => {
          return res.render('admin/create', { restaurant, categories });
        },
      );
    });
  },
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data.messages);
        return res.redirect('back');
      } else {
        req.flash('success_messages', data.messages);
        res.redirect('/admin/restaurants');
      }
    });
    //console.log(req.body);
    // if (!req.body.name) {
    //   req.flash('error_messages', 'name did not exist.');
    //   return res.redirect('back');
    // }
    // const { file } = req;
    // if (file) {
    //   imgur.setClientID(IMGUR_CLIENT_ID);
    //   imgur.upload(file.path, (err, img) => {
    //     return Restaurant.findByPk(req.params.id).then((restaurant) => {
    //       restaurant
    //         .update({
    //           name: req.body.name,
    //           tel: req.body.tel,
    //           address: req.body.address,
    //           opening_hours: req.body.opening_hours,
    //           description: req.body.description,
    //           image: file ? img.data.link : restaurant.image,
    //           CategoryId: req.body.categoryId,
    //         })
    //         .then(() => {
    //           req.flash(
    //             'success_messages',
    //             'restaurant was successfully to update',
    //           );
    //           res.redirect('/admin/restaurants');
    //         });
    //     });
    //   });
    // } else {
    //   return Restaurant.findByPk(req.params.id).then((restaurant) => {
    //     restaurant
    //       .update({
    //         name: req.body.name,
    //         tel: req.body.tel,
    //         address: req.body.address,
    //         opening_hours: req.body.opening_hours,
    //         description: req.body.description,
    //         image: restaurant.image,
    //         CategoryId: req.body.categoryId,
    //       })
    //       .then(() => {
    //         req.flash(
    //           'success_messages',
    //           'restaurant was successfully to update',
    //         );
    //         res.redirect('/admin/restaurants');
    //       });
    //   });
    // }
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect('/admin/restaurants');
      }
    });
    // return Restaurant.findByPk(req.params.id).then((restaurant) => {
    //   restaurant.destroy().then(() => {
    //     res.redirect('/admin/restaurants');
    //   });
    // });
  },
  getUsers: (req, res) => {
    return User.findAll({ raw: true }).then((users) => {
      return res.render('admin/users', { users: users });
    });
  },
  putUser: (req, res) => {
    if (!req.params.id) {
      req.flash('error_messages', 'user is not existed.');
      return res.redirect('back');
    }
    if (req.user.id === Number(req.params.id)) {
      req.flash('error_messages', 'can not change role yourself.');
      return res.redirect('back');
    }
    return User.findByPk(req.params.id).then((user) => {
      if (user.email === 'root@example.com') {
        req.flash('error_messages', 'root can not be changed.');
        return res.redirect('back');
      } else {
        user.update({ isAdmin: user.isAdmin ? false : true }).then(() => {
          req.flash('success_messages', 'User was successfully updated.');
          res.redirect('/admin/users');
        });
      }
    });
  },
};

module.exports = adminController;
