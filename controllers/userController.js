const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const fs = require('fs');
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
        console.log(req.user);
        res.render('profile', { user, self: req.user });
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
};

module.exports = userController;
