const restController = {
  // 負責瀏覽餐廳頁面的渲染
  getRestaurants: (req, res) => {
    return res.render('restaurants');
  },
};

module.exports = restController;

/*
之前的專案規模較小，我們就直接把 request 的處理程序放在路由裡，如果把程序抽取到 controller 裡，就需要在原本的路由去呼叫特定的 controller action。
*/
