const express = require('express');
const exhbs = require('express-handlebars');
const app = express();
const port = 3000;

app.engine('hbs', exhbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');

app.listen(port, () => {
  console.log(`Running on localhost:${port}`);
});
