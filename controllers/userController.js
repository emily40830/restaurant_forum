const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const Comment = db.Comment;
const Restaurant = db.Restaurant;
const Favorite = db.Favorite;
const Like = db.Like;
const imgur = require('imgur-node-api');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup');
  },
  signUp: (req, res) => {
    //confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！');
      return res.redirect('/signup');
    } else {
      User.findOne({ where: { email: req.body.email } }).then((user) => {
        if (user) {
          req.flash('error_messages', '信箱重複！');
          return res.redirect('/signup');
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10),
              null,
            ),
          }).then((user) => {
            req.flash('success_messages', '成功註冊帳號！');
            return res.redirect('/signin');
          });
        }
      });
    }
  },
  signInPage: (req, res) => {
    return res.render('signin');
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！');
    res.redirect('/restaurants');
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功');
    req.logout();
    res.redirect('/signin');
  },
  getUser: (req, res) => {
    return User.findByPk(req.params.id, { raw: true, nest: true }).then(
      (user) => {
        //console.log(user);
        if (user != null) {
          Comment.findAll({
            where: { UserId: req.params.id },
            attributes: ['RestaurantId'],
            group: ['RestaurantId'],
            include: [Restaurant],
            raw: true,
            nest: true,
          }).then((restaurants) => {
            console.log(restaurants);
            res.render('profile', {
              user: req.user, //self
              object: user,
              restaurants,
              cnt: restaurants.length,
            });
          });
        } else {
          req.flash('error_messages', 'User is not existed');
          res.redirect(`/users/${req.user.id}`);
        }
      },
    );
  },
  editUser: (req, res) => {
    if (req.user.id !== Number(req.params.id)) {
      req.flash('error_messages', 'You have no permission to request');
      return res.redirect(`/users/${req.params.id}`);
    }
    return User.findByPk(req.params.id, { raw: true, nest: true }).then(
      (user) => {
        res.render('editProfile');
      },
    );
  },
  putUser: (req, res) => {
    //console.log(req);
    if (!req.body.name) {
      req.flash('error_messages', 'name can not be empty');
      return res.redirect('back');
    }

    if (req.user.id !== Number(req.params.id)) {
      req.flash('error_messages', 'You have no permission to request');
      return res.redirect('back');
    }
    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        console.log(img);
        return User.findByPk(req.params.id).then((user) => {
          user
            .update({
              name: req.body.name,
              image: file ? img.data.link : user.image,
            })
            .then((user) => {
              req.flash(
                'success_messages',
                'profile was successfully to update',
              );
              res.redirect(`/users/${req.params.id}`);
            });
        });
      });
    } else {
      return User.findByPk(req.params.id).then((user) => {
        user
          .update({
            name: req.body.name,
            image: user.image,
          })
          .then((user) => {
            req.flash('success_messages', 'user was successfully to update');
            res.redirect(`/users/${req.params.id}`);
          });
      });
    }
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId,
      is_favorite: true,
    }).then(() => {
      //req.flash('success_messages','您已收藏')
      return res.redirect('back');
    });
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId,
      },
    }).then((favorite) => {
      favorite.destroy().then(() => {
        return res.redirect('back');
      });
    });
  },
  addLike: (req, res) => {
    //await Like.reload();
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId,
      },
    }).then((like) => {
      //await like.reload();
      if (like) {
        return like
          .update({
            is_like: true,
          })
          .then(() => {
            return res.redirect('back');
          });
      } else {
        return Like.create({
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId,
          is_like: true,
        }).then(() => {
          return res.redirect('back');
        });
      }
    });
  },
  unLike: (req, res) => {
    //await Like.reload();
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId,
      },
    }).then((like) => {
      //await like.reload();
      if (like.is_like === true) {
        return like
          .update({
            is_like: false,
          })
          .then(() => {
            return res.redirect('back');
          });
      } else if (like.is_like === false) {
        req.flash('error_messages', '重複的操作！');
        return res.redirect('back');
      } else {
        return Like.create({
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId,
          is_like: false,
        }).then(() => {
          return res.redirect('back');
        });
      }
    });
  },
};

module.exports = userController;
