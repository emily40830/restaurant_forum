const db = require('../../models');
const Restaurant = db.Restaurant;
const Category = db.Category;

const adminService = require('../../services/adminService');

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data);
    });
    // return Restaurant.findAll({
    //   raw: true,
    //   nest: true,
    //   include: [Category],
    // }).then((restaurants) => {
    //   return res.json({ restaurants });
    // });
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.json(data);
    });
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      return res.json(data);
    });
  },
};

module.exports = adminController;
