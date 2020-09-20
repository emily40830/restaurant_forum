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
  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id).then((restaurant) => {
      restaurant.destroy().then(() => {
        callback({ status: 'success', messages: '' });
      });
    });
  },
};

module.exports = adminService;
