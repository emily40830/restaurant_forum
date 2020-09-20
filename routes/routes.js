const restController = require('../controllers/restController.js');
const adminController = require('../controllers/adminController.js');
const userController = require('../controllers/userController.js');
const categoryController = require('../controllers/categoryController.js');
const commentController = require('../controllers/commentController.js');

const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

const multer = require('multer');
const upload = multer({ dest: 'temp/' });

// const main = (router, passport) => {
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
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'));
router.get('/restaurants', authenticated, restController.getRestaurants);
router.get('/restaurants/top', authenticated, restController.getTopRestaurants);
router.get('/restaurants/feeds', authenticated, restController.getFeeds);
router.get(
  '/restaurants/dashboard/:id',
  authenticated,
  restController.getDashboard,
);
router.get('/restaurants/:id', authenticated, restController.getRestaurant);

//favorite
router.post(
  '/favorite/:restaurantId',
  authenticated,
  userController.addFavorite,
);
router.delete(
  '/favorite/:restaurantId',
  authenticated,
  userController.removeFavorite,
);

//Like/unlike
router.post('/like/:restaurantId/unlike', authenticated, userController.unLike);
router.post('/like/:restaurantId', authenticated, userController.addLike);

// 更改餐廳分類之相關路由 admin/categories
router.get(
  '/admin/categories',
  authenticatedAdmin,
  categoryController.getCategories,
);
router.post(
  '/admin/categories',
  authenticatedAdmin,
  categoryController.postCategories,
);
router.get(
  '/admin/categories/:id',
  authenticatedAdmin,
  categoryController.getCategories,
);
router.put(
  '/admin/categories/:id',
  authenticatedAdmin,
  categoryController.putCategories,
);
router.delete(
  '/admin/categories/:id',
  authenticatedAdmin,
  categoryController.deleteCategories,
);

// 更改使用者相關之路由 admin/users
router.get('/admin/users', authenticatedAdmin, adminController.getUsers);
router.put('/admin/users/:id', authenticatedAdmin, adminController.putUser);

// 連到admin頁面就轉到 /admin/restaurants
router.get('/admin', authenticatedAdmin, (req, res) =>
  res.redirect('/admin/restaurants'),
);

// 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
router.get(
  '/admin/restaurants',
  authenticatedAdmin,
  adminController.getRestaurants,
);
router.get(
  '/admin/restaurants/create',
  authenticatedAdmin,
  adminController.createRestaurant,
);
router.post(
  '/admin/restaurants',
  authenticatedAdmin,
  upload.single('image'),
  adminController.postRestaurant,
);
router.get(
  '/admin/restaurants/:id',
  authenticatedAdmin,
  adminController.getRestaurant,
);
router.get(
  '/admin/restaurants/:id/edit',
  authenticatedAdmin,
  adminController.editRestaurant,
);
router.put(
  '/admin/restaurants/:id',
  authenticatedAdmin,
  upload.single('image'),
  adminController.putRestaurant,
);
router.delete(
  '/admin/restaurants/:id',
  authenticatedAdmin,
  adminController.deleteRestaurant,
);

// 登入/註冊
router.get('/signup', userController.signUpPage);
router.post('/signup', userController.signUp);
router.get('/signin', userController.signInPage);
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true,
  }),
  userController.signIn,
);
router.get('/logout', userController.logout);

// comment
router.post('/comments', authenticated, commentController.postComment);
router.delete(
  '/comments/:id',
  authenticatedAdmin,
  commentController.deleteComment,
);

// user
router.get('/users/top', authenticated, userController.getTopUser);
router.get('/users/:id', authenticated, userController.getUser);
router.get('/users/:id/edit', authenticated, userController.editUser);
router.put(
  '/users/:id',
  authenticated,
  upload.single('image'),
  userController.putUser,
);
//following
router.post('/following/:userId', authenticated, userController.addFollowing);
router.delete(
  '/following/:userId',
  authenticated,
  userController.removeFollowing,
);

module.exports = router;
