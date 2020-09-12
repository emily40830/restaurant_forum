const express = require('express');
const exhbs = require('express-handlebars');
const db = require('./models'); //引入資料庫
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/passport');
const methodOverride = require('method-override');
const app = express();
const port = process.env.PORT || 3000;

const routes = require('./routes');

app.engine('hbs', exhbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  res.locals.user = req.user;
  next();
});
app.use(methodOverride('_method'));
app.use('/upload', express.static(__dirname + '/upload'));

app.listen(port, () => {
  console.log(`Running on localhost:${port}`);
});

routes(app, passport);
