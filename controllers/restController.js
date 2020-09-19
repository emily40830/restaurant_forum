const db = require('../models');

const Category = db.Category;
const Restaurant = db.Restaurant;
const Comment = db.Comment;
const User = db.User;
const Like = db.Like;
const Favorite = db.Favorite;

const pageLimit = 10; //每頁有的餐廳數量

const restController = {
  // 負責瀏覽餐廳頁面的渲染
  getRestaurants: (req, res) => {
    let offset = 0;
    let whereQuery = {};
    let categoryId = '';
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit;
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId);
      whereQuery['categoryId'] = categoryId;
    }
    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit,
    }).then((result) => {
      // data for pagination
      let page = Number(req.query.page) || 1;
      let pages = Math.ceil(result.count / pageLimit);
      let totalPages = Array.from({ length: pages }).map(
        (item, index) => index + 1,
      );
      let prev = page - 1 < 1 ? 1 : page - 1;
      let next = page + 1 > pages ? pages : page + 1;
      // clean up restaurant data
      //console.log(req.user.MyLikeRestaurants);
      const data = result.rows.map((r) => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        isFavorited: req.user.FavoritedRestaurants.map((d) => d.id).includes(
          r.id,
        ),
        isLike:
          req.user.MyLikeRestaurants.filter(
            (u) => u.id === r.id && u.Like.is_like == true,
          ).length === 0
            ? false
            : true,
        categoryName: r.dataValues.Category.name,
      }));

      Category.findAll({
        raw: true,
        nest: true,
      }).then((categories) => {
        //console.log(data);
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          page,
          totalPages,
          prev,
          next,
        });
      });
    });
  },

  getRestaurant: async (req, res) => {
    // caculate the click times
    const target = await Restaurant.findByPk(req.params.id);
    target.viewCounts += 1;
    await target.save();

    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        //{ model: User, as: 'UsersWhoLikethisRest' },
        { model: User, as: 'FavoritedUsers' },
        { model: Comment, include: [User] },
      ],
    }).then(async (restaurant) => {
      const like = await Like.findOne({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.id,
          is_like: true,
        },
        raw: true,
      });
      //console.log(like);
      const isFavorited = restaurant.FavoritedUsers.map((d) => d.id).includes(
        req.user.id,
      );
      const isLike = like ? true : false;
      //console.log(restaurant.toJSON());
      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited,
        isLike,
      });
    });
  },
  getFeeds: (req, res) => {
    return Restaurant.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [Category],
    }).then((restaurants) => {
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
      }).then((comments) => {
        return res.render('feeds', {
          restaurants,
          comments,
        });
      });
    });
  },
  getDashboard: async (req, res) => {
    // caculate the click times
    const target = await Restaurant.findByPk(req.params.id);
    target.viewCounts += 1;
    await target.save();

    return Restaurant.findByPk(req.params.id, {
      include: [Category],
      raw: true,
      nest: true,
    }).then(async (restaurant) => {
      const comments_cnt = await Comment.count({
        where: { RestaurantId: req.params.id },
      });
      //Comment.findAll({where: { RestaurantId: req.params.id }});
      //console.log(restaurant);
      //console.log(comments_cnt);
      return res.render('restDashboard', { restaurant, comments_cnt });
    });
  },
  getTopRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }],
    }).then((restaurants) => {
      restaurants = restaurants.map((r) => ({
        ...r.dataValues,
        FavoritedUsersCount: r.FavoritedUsers.length,
        isFavorited: req.user.FavoritedRestaurants.map((d) => d.id).includes(
          r.id,
        ),
      }));
      //console.log(req.user.FavoritedRestaurants.map((d) => d.id));
      restaurants = restaurants
        .sort((a, b) => b.FavoritedUsersCount - a.FavoritedUsersCount)
        .slice(0, 10);
      //console.log(restaurants);
      return res.render('topRestaurant', { restaurants });
    });
  },
};

module.exports = restController;

/*
之前的專案規模較小，我們就直接把 request 的處理程序放在路由裡，如果把程序抽取到 controller 裡，就需要在原本的路由去呼叫特定的 controller action。
*/
