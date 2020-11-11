const request = require('request')
const { roles } = require('../roles')
const config = require('../config/config')

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

buildHeaders = () => {
 return {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
 };
}

exports.getArticles = async (req, res, next) => {

 const articles = request(config.SMART_DOCTRINA_URL + "articles/", {json: true, headers: buildHeaders()});
 res.status(200).json({
  data: articles
 });
}

exports.create = async (req, res, next) => {
 const body = {
  name: req.body.name,
  reference: req.body.reference,
  content: req.body.content,
  draft: req.body.draft,
  user: {id: res.locals.loggedInUser.id},
  createdAt: req.body.createdAt,
  updatedAt: req.body.updatedAt
 }
 const article = request.post(config.SMART_DOCTRINA_URL + "articles", {headers: buildHeaders(), body, json: true})
 res.status(200).json({
  data: article
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
