const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

//router.get('/reg', (req, res) => {
  //res.send('Страница регистрации');

//});

router.post('/reg', (req, res) => {
   let newUser = new User ({
     name: req.body.name,
     email: req.body.email,
     login: req.body.login,
     password: req.body.password
   });


//добавление пользователя в бд

User.addUser(newUser, (err, user) => {
  if (err)
   res.json({sucess: false, msg: "Пользователь не был добавлен"});
  else
   res.json({sucess: true, msg: "Пользователь был добавлен!"});
 });
});

router.post('/auth', (req, res) => {            //получение данных от пользователя логинбпароль
  const login = req.body.login;
  const password = req.body.password;

  User.getUserByLogin(login, (err, user) => {   //поиск пользователя по Логину
    if(err) throw err;
    if(!user)
       return res.json({success: false, msg: "Такой пользователь был не найден"});

     //если пользователь найден, то сравниваем пароли
    User.comparePass(password, user.password, (err, isMatch) => {  //isMatch - параметр (знач тру при совпадении паролей, фолс при ошибке)
      if(err) throw err;
      if(isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {                  //авторизация пользователя
            expiresIn: 3600*24                                         //установка токена с времянем сессии.спец индентификатор, который сложно подделать
        });

        res.json({           //если пароли совпали, то выводим информацию пользователя
          success: true,    //отправка ответа пользователю
          token: 'JWT' + token,
          user: {
            id: user._id,
            name: user.name,
            login: user.login,
            email: user.email
          }
        });
      } else
      return res.json({success: false, msg:"Пароли не совпадают"});
    });    //сравннение пароля с тем который ввел пользователь, с паролем БД(1password,2user.password)
  });
});

router.get('/dashboard', passport.authenticate('jwt', {session: false}),  (req, res) => {
  res.send('Кабинет пользователя');

});

module.exports = router;
