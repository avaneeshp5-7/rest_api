const exp = require('express');
const route = exp.Router();
const {checkTcken}=require('../auth/middleware/auth.middleware');
const userController=require('../controller/controller')
const rout=exp.Router();
rout.post('/user-registraion',userController.userRegstration);
rout.post('/user-login',userController.userlogin);
rout.post('/get-user',checkTcken,userController.findUser);
rout.post('/update-user',checkTcken,userController.updateUser);
rout.post('/delete-user',checkTcken,userController.deleteUser);
rout.get('/getalluser',checkTcken,userController.getAllUsers);
module.exports=rout;