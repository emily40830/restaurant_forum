const db = require('../models');
const Category = db.Category;
const Restaurant = db.Restaurant;

const restController = {
  // 負責瀏覽餐廳頁面的渲染
  getRestaurants: (req, res) => {
    let whereQuery = {};
    let categoryId = '';
    if (req.query.categoryId) {
      categoryId = Number(req.query.id);
      whereQuery.CategoryId = categoryId;
    }
    Restaurant.findAll({ include: Category, where: whereQuery }).then(
      (restaurants) => {
        const data = restaurants.map((r) => ({
          ...r.dataValues, //展開物件資料
          description: r.dataValues.description.substring(0, 50), //覆寫description
          categoryName: r.Category.name,
        }));
        return Category.findAll({ raw: true, nest: true }).then(
          (categories) => {
            return res.render('restaurants', {
              restaurants: data,
              categories,
              categoryId,
            });
          },
        );
      },
    );
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: Category,
    }).then((restaurant) => {
      //console.log(restaurant);
      return res.render('restaurant', {
        restaurant,
      });
    });
  },
};

module.exports = restController;

/*
之前的專案規模較小，我們就直接把 request 的處理程序放在路由裡，如果把程序抽取到 controller 裡，就需要在原本的路由去呼叫特定的 controller action。
*/
