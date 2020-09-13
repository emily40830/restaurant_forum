const db = require('../models');
const Category = db.Category;

const categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({ raw: true, nest: true }).then((categories) => {
      return res.render('admin/categories', { categories });
    });
  },
  postCategories: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name did not exist');
      return res.redirect('back');
    } else {
      return Category.create({
        name: req.body.name,
      }).then(() => {
        req.flash('success_messages', 'category was successfully created');
        return res.redirect('/admin/categories');
      });
    }
  },
};

module.exports = categoryController;
