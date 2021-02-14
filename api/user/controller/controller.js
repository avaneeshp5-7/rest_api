const pool = require('../../../connection/config/db/db_connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
exports.userRegstration = (rq, rs) => {
   delete rq.body.confirmPass;
   var email = rq.body.email;
   var password = rq.body.password;
   var sql = 'SELECT * FROM user_registration WHERE email = ? ';
   var sqls = "INSERT INTO user_registration SET ?";
   pool.query(sql, [email], (er, resu) => {
      if (resu.length === 1) {
         rs.json({
            success: false,
            message: 'Email exist, Please try another email id !'
         });
      } else {
         bcrypt.hash(password, saltRounds, function (err, hash) {
            rq.body.password = hash
            pool.query(sqls, rq.body, (errs, results) => {
               if (errs) {
                  console.log(errs)
                  rs.json({
                     success: false,
                     message: errs,
                  });
               } else {

                  rs.json({
                     success: true,
                     message: 'User sinup successfully !',
                     data: results
                  });
               }
            });
         });
      }
   });
}

exports.userlogin = (request, response) => {
   var email = request.body.email;
   var sql = 'SELECT * FROM user_registration WHERE email = ?';
   pool.query(sql, [email], (err, results) => {
      if (err) {
         response.json({
            success: false,
            message: err
         });
      } else {
         if (results.length === 1) {
            bcrypt.compare(request.body.password, results[0].password).then(function (result) {
               if (result == true) {
                  results.password = undefined;
                  let token = jwt.sign({ result: results }, 'myTokenKey', { expiresIn: '1h' });
                  response.json({
                     success: true,
                     message: 'Login Done !',
                     data: results,
                     token: token
                  })
               } else {
                  res.json({
                     success: false,
                     message: 'User not register !',
                  })
               }
            });
         } else {
            response.json({
               success: false,
               data: err,
               message: 'Invalid credentials'
            });
         }
      }
   });
}
exports.findUser = (req, res) => {
   pool.query('SELECT * FROM user_registration WHERE user_id = ? ', [req.body.id], (err, data) => {
      if (err) {
         res.send({
            success: false,
            message: 'data not found !'
         });
      } else {
         res.send({
            success: true,
            message: 'data found!',
            data: data
         });
      }
   });
}
exports.updateUser = (req, res) => {
   var ids = req.body.id;
   delete req.body.id;
   var sql = "UPDATE user_registration set ?  WHERE user_id = ? "
   pool.query(sql, [req.body, ids], (err, data) => {
      if (err) {
         res.send({
            success: false,
            message: 'not updated !',
            err: err
         });
      } else {
         res.send({
            success: true,
            message: 'updated !',
         });
      }
   });
}
exports.getAllUsers = (req, res) => {
   pool.query('SELECT * from user_registration', (err, data) => {
      if (err) {
         res.send({
            success: false,
            message: 'not data found !',
            err: err
         });
      } else {
         res.send({
            success: true,
            message: 'data found !',
            data: data
         });
      }
   });
}

exports.deleteUser = (req, res) => {
   pool.query("DELETE from user_registration WHERE user_id='" + req.body.id + "'", (er, result) => {
      if (er) {
         res.send({
            success: false,
            message: 'not deleted !',
            err: err
         });
      } else {
         res.send({
            success: true,
            message: 'deleted !',
         });
      }
   });
}
