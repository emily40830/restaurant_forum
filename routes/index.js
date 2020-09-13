const restController = require('../controllers/restController.js');
const adminController = require('../controllers/adminController.js');
const userController = require('../controllers/userController.js');
const categoryController = require('../controllers/categoryController.js');
const multer = require('multer');
const upload = multer({ dest: 'temp/' });

const main = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/signin');
  };
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next();
      }
      return res.redirect('/');
    }
    res.redirect('/signin');
  };
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'));
  app.get('/restaurants', authenticated, restController.getRestaurants);

  // 更改餐廳分類之相關路由 admin/categories
  app.get(
    '/admin/categories',
    authenticatedAdmin,
    categoryController.getCategories,
  );
  app.post(
    '/admin/categories',
    authenticatedAdmin,
    categoryController.postCategories,
  );

  // 更改使用者相關之路由 admin/users
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers);
  app.put('/admin/users/:id', authenticatedAdmin, adminController.putUser);

  // 連到admin頁面就轉到 /admin/restaurants
  app.get('/admin', authenticatedAdmin, (req, res) =>
    res.redirect('/admin/restaurants'),
  );

  // 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
  app.get(
    '/admin/restaurants',
    authenticatedAdmin,
    adminController.getRestaurants,
  );
  app.get(
    '/admin/restaurants/create',
    authenticatedAdmin,
    adminController.createRestaurant,
  );
  app.post(
    '/admin/restaurants',
    authenticatedAdmin,
    upload.single('image'),
    adminController.postRestaurant,
  );
  app.get(
    '/admin/restaurants/:id',
    authenticatedAdmin,
    adminController.getRestaurant,
  );
  app.get(
    '/admin/restaurants/:id/edit',
    authenticatedAdmin,
    adminController.editRestaurant,
  );
  app.put(
    '/admin/restaurants/:id',
    authenticatedAdmin,
    upload.single('image'),
    adminController.putRestaurant,
  );
  app.delete(
    '/admin/restaurants/:id',
    authenticatedAdmin,
    adminController.deleteRestaurant,
  );

  // 登入/註冊
  app.get('/signup', userController.signUpPage);
  app.post('/signup', userController.signUp);
  app.get('/signin', userController.signInPage);
  app.post(
    '/signin',
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: true,
    }),
    userController.signIn,
  );
  app.get('/logout', userController.logout);
};

module.exports = main;
