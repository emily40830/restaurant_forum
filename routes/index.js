const restController = require('../controllers/restController.js');
const adminController = require('../controllers/adminController.js');
const userController = require('../controllers/userController.js');
const categoryController = require('../controllers/categoryController.js');
const commentController = require('../controllers/commentController.js');

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
  app.get('/restaurants/top', authenticated, restController.getTopRestaurants);
  app.get('/restaurants/feeds', authenticated, restController.getFeeds);
  app.get(
    '/restaurants/dashboard/:id',
    authenticated,
    restController.getDashboard,
  );
  app.get('/restaurants/:id', authenticated, restController.getRestaurant);

  //favorite
  app.post(
    '/favorite/:restaurantId',
    authenticated,
    userController.addFavorite,
  );
  app.delete(
    '/favorite/:restaurantId',
    authenticated,
    userController.removeFavorite,
  );

  //Like/unlike
  app.post('/like/:restaurantId/unlike', authenticated, userController.unLike);
  app.post('/like/:restaurantId', authenticated, userController.addLike);

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
  app.get(
    '/admin/categories/:id',
    authenticatedAdmin,
    categoryController.getCategories,
  );
  app.put(
    '/admin/categories/:id',
    authenticatedAdmin,
    categoryController.putCategories,
  );
  app.delete(
    '/admin/categories/:id',
    authenticatedAdmin,
    categoryController.deleteCategories,
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

  // comment
  app.post('/comments', authenticated, commentController.postComment);
  app.delete(
    '/comments/:id',
    authenticatedAdmin,
    commentController.deleteComment,
  );

  // user
  app.get('/users/top', authenticated, userController.getTopUser);
  app.get('/users/:id', authenticated, userController.getUser);
  app.get('/users/:id/edit', authenticated, userController.editUser);
  app.put(
    '/users/:id',
    authenticated,
    upload.single('image'),
    userController.putUser,
  );
  //following
  app.post('/following/:userId', authenticated, userController.addFollowing);
  app.delete(
    '/following/:userId',
    authenticated,
    userController.removeFollowing,
  );
};

module.exports = main;
