const db = require('../models');
//const fs = require('fs');
const imgur = require('imgur-node-api');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const Restaurant = db.Restaurant;
const User = db.User;
const Category = db.Category;

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category],
    }).then((restaurants) => {
      //console.log(restaurants[0]);
      return res.render('admin/restaurants', { restaurants: restaurants });
      // get category name in handlebars:this.Category.name
    });
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category],
    }).then((restaurant) => {
      console.log(restaurant);
      return res.render('admin/restaurant', {
        restaurant: restaurant,
      });
    });
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create');
  },
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name did not exist.');
      return res.redirect('back');
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
        }).then(() => {
          req.flash('success_messages', 'restaurant was successfully created.');
          res.redirect('/admin/restaurants');
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
      }).then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created');
        return res.redirect('/admin/restaurants');
      });
    }
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(
      (restaurant) => {
        return res.render('admin/create', { restaurant });
      },
    );
  },
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name did not exist.');
      return res.redirect('back');
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
              image: file ? `upload/${file.originalname}` : restaurant.image,
            })
            .then(() => {
              req.flash(
                'success_messages',
                'restaurant was successfully to update',
              );
              req.redirect('/admin/restaurants');
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
          })
          .then(() => {
            req.flash(
              'success_messages',
              'restaurant was successfully to update',
            );
            res.redirect('/admin/restaurants');
          });
      });
    }
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then((restaurant) => {
      restaurant.destroy().then((restaurant) => {
        res.redirect('/admin/restaurants');
      });
    });
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
