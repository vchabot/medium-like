const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const articleController = require('../controllers/article.controller');

router.post('/signup', userController.signup);

router.post('/login', userController.login);
 
router.get('/user/:userId', userController.allowIfLoggedin, userController.getUser);
 
router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);
 
router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);
 
router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);

router.post('/articles', userController.allowIfLoggedin, userController.grantAccess('createOwn', 'article'), articleController.create);

module.exports = router;
