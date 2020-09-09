const express = require('express');
const exhbs = require('express-handlebars');
const db = require('./models'); //引入資料庫
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const port = 3000;

const routes = require('./routes');

app.engine('hbs', exhbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
});

app.listen(port, () => {
  console.log(`Running on localhost:${port}`);
});

routes(app);
