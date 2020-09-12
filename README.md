# restaurant forum

Features for admin has been completed , you could:

- Set user permissions
- Manage restaurant information

! root@example.com can not be changed.  
! Can not change role yourself.

See the project at [here](https://guarded-springs-63968.herokuapp.com/admin/users)

Test account:
| Email | Password |
| --- | --- |
| root@example.com | 12345678 |
| user1@example.com | 12345678 |
| user2@example.com | 12345678 |

## OverView

![Main page](https://github.com/emily40830/restaurant_forum/blob/master/public/img/cover-12.png)

## How to install

Before starting the project, MySQL and Workbench must be installed

1. clone to local machine

```
git clone https://github.com/emily40830/restaurant_forum.git
```

2. access to project directory, install the packages list in package.json

```
npm install
```

3. Create .env based on .env.example, fill in IMGUR_CLIENT_ID and PORT.

4. Create database through workbench and use it

```
CREATE DATABASE forum;
use forum;
```

5. Import migration to set up restaurants and users table

```
npx sequelize db:migrate
```

6. Create seed data

```
npx sequelize db:seed:all
```

7. Start the server by nodemon

```
npm run dev
```

8. you could see the message `Running on the localhost:3000` in terminal, start the browser and type `localhost:3000` in address area or click on [here](http://localhost:3000)

## Development environment

- bcryptjs: v2.4.3
- body-parser: v1.19.0
- connect-flash: v0.1.1
- dotenv: v8.2.0
- express: v4.17.1
- express-handlebars: v5.1.0
- express-session: v1.17.1
- faker: v5.1.0
- imgur-node-api: v0.1.0
- handlebars-helpers: v0.10.0
- method-override: v3.0.0
- multer: v1.4.2
- mysql2: v2.1.0
- passport: v0.4.1
- passport-facebook: v3.0.0
- passport-local: v1.0.0
- pg: v8.3.3
- sequelize: v6.3.5
- sequelize-cli: v6.2.0

## Author

Qi-Hua(Emily) Wang
