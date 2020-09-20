const db = require('../models');
const Category = db.Category;

const categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll({ raw: true, nest: true }).then((categories) => {
      if (req.params.id) {
        Category.findByPk(req.params.id, { raw: true, nest: true }).then(
          (category) => {
            callback({ categories, category });
            // return res.render('admin/categories', {
            //   categories: categories,
            //   category: category,
            // });
          },
        );
      } else {
        callback({ categories });
        // return res.render('admin/categories', { categories });
      }
    });
  },
  postCategories: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', messages: 'name did not exist' });
      // req.flash('error_messages', 'name did not exist');
      // return res.redirect('back');
    } else {
      return Category.create({
        name: req.body.name,
      }).then(() => {
        callback({
          status: 'success',
          messages: 'category was successfully created',
        });
        // req.flash('success_messages', 'category was successfully created');
        // return res.redirect('/admin/categories');
      });
    }
  },
  putCategories: (req, res, callback) => {
    //console.log(req.body);
    if (!req.body.name) {
      callback({ status: 'error', messages: 'name did not exist.' });
      // req.flash('error_messages', 'name did not exist.');
      // return res.redirect('back');
    } else {
      return Category.findByPk(req.params.id).then((category) => {
        category.update(req.body).then(() => {
          callback({
            status: 'success',
            messages: 'category was successfully updated.',
          });
          //res.redirect('/admin/categories');
        });
      });
    }
  },
};

module.exports = categoryService;
