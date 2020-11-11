const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { roles } = require('../roles')

async function hashPassword(password) {
 return await bcrypt.hash(password, 10);
}
 
async function validatePassword(plainPassword, hashedPassword) {
 console.log(plainPassword)
 console.log(hashedPassword)
 return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.grantAccess = function(action, resource) {
 return async (req, res, next) => {
  try {
   const permission = roles.can(req.user.role)[action](resource);
   if (!permission.granted) {
    return res.status(401).json({
     error: "You don't have enough permission to perform this action"
    });
   }
   next()
  } catch (error) {
   next(error)
  }
 }
}

exports.allowIfLoggedin = async (req, res, next) => {
 try {
  const user = res.locals.loggedInUser;
  if (!user)
   return res.status(401).json({
    error: "You need to be logged in to access this route"
   });
   req.user = user;
   next();
  } catch (error) {
   next(error);
  }
}

exports.signup = async (req, res, next) => {
  const { username, email, password, role, created_at, updated_at } = req.body;
  const hashedPassword = await hashPassword(password);
  const newUser = new User({ email, password: hashedPassword, role: role || "user", username, created_at, updated_at });
  const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
   expiresIn: "1d"
  });
  newUser.access_token = accessToken;
  try {
   newId = await User.create(newUser);
   newUser.id = newId;
   delete newUser.password;
   console.log('New user created: ' + newUser.email)
   res.json({
    data: newUser,
    accessToken
   })
  } catch (err) {
   console.log(error)
   next(error)
  }
}

exports.login = async (req, res, next) => {
 try {
  const { email, password } = req.body;
  const user = await User.findBy('email', email, false);
  if (!user) {
   return next(new Error('Email does not exist'));
  }
  const validPassword = await validatePassword(password, user.password);
  if (!validPassword) {
   return next(new Error('Password is not correct'))
  }
  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
   expiresIn: "1d"
  });
  await User.findByIdAndUpdate(user.id, accessToken)
  res.status(200).json({
   data: { email: user.email, role: user.role },
   accessToken
  })
 } catch (error) {
  next(error);
 }
}

exports.getUsers = async (req, res, next) => {
 const users = await User.getAll();
 res.status(200).json({
  data: users
 });
}

exports.getUser = async (req, res, next) => {
 try {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) return next(new Error('User does not exist'));
   res.status(200).json({
   data: user
  });
 } catch (error) {
  next(error)
 }
}

exports.updateUser = async (req, res, next) => {
 try {
  const update = req.body
  const userId = req.params.userId;
  await User.findByIdAndUpdate(userId, update);
  const user = await User.findById(userId)
  res.status(200).json({
   data: user,
   message: 'User has been updated'
  });
 } catch (error) {
  next(error)
 }
}

exports.deleteUser = async (req, res, next) => {
 try {
  const userId = req.params.userId;
  await User.findByIdAndDelete(userId);
  res.status(200).json({
   data: null,
   message: 'User has been deleted'
  });
 } catch (error) {
  next(error)
 }
}
