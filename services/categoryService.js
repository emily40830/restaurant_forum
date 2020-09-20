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
};

module.exports = categoryService;
