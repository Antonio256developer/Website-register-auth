const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const config = require('./config/db');
const account = require('./routes/account');

const node = express();

const port = process.env.PORT || 8080;

node.use(passport.initialize());  
node.use(passport.session());

require('./config/passport')(passport);

node.use(cors());

node.use(bodyParser.json());

node.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log("Мы успешно подключились к БД");
});

mongoose.connection.on('error', (err) => {
  console.log("Мы не подключились к БД:" + err);
});

node.get('/', (req, res) => {
  res.send('Главная страница сайта!!!');
});

node.use('/account', account);

node.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

node.listen(port, () => {
console.log("Сервер был запущен по порту: " + port);

});
