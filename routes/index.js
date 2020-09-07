const restController = require('../controllers/restController.js');
const adminController = require('../controllers/adminController.js');
const userController = require('../controllers/userController');

const main = (app) => {
  app.get('/', (req, res) => res.redirect('/restaurants'));
  app.get('/restaurants', restController.getRestaurants);

  // 連到admin頁面就轉到 /admin/restaurants
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'));

  // 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
  app.get('/admin/restaurants', adminController.getRestaurants);

  // 登入/註冊
  app.get('/signup', userController.signUpPage);
  app.post('/signup', userController.signUp);
};

module.exports = main;
