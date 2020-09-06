const restController = require('../controllers/restController');

const main = (app) => {
  app.get('/', (req, res) => res.redirect('/restaurants'));
  app.get('/restaurants', restController.getRestaurants);
};

module.exports = main;
