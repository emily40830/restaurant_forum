const db = require('../models');
const Category = db.Category;

const categoryService = require('../services/categoryService');

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data);
    });
  },
  postCategories: (req, res) => {
    categoryService.postCategories(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data.messages);
        return res.redirect('back');
      } else {
        req.flash('success_messages', data.messages);
        return res.redirect('/admin/categories');
      }
    });
  },
  putCategories: (req, res) => {
    categoryService.putCategories(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data.messages);
        return res.redirect('back');
      } else {
        req.flash('success_messages', data.messages);
        return res.redirect('/admin/categories');
      }
    });
  },
  deleteCategories: (req, res) => {
    categoryService.deleteCategories(req, res, (data) => {
      if (data.status === 'success') {
        return res.redirect('/admin/categories');
      }
    });
    // return Category.findByPk(req.params.id).then((category) => {
    //   return category.destroy().then(() => {
    //     res.redirect('/admin/categories');
    //   });
    // });
  },
};

module.exports = categoryController;
