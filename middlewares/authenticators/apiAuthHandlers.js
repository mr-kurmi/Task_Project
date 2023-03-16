var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
var globalService = require('../../services/globalService');
var constants = require("../../models/modelConstants");
var UserModel = mongoose.model(constants.UserModel);
var AccessToken = mongoose.model(constants.AccessToken);

const apiValidateToken = function (req, res, next) {
  let accessToken = req.body.token || req.headers['access-token'];
  if (accessToken) {
    const token = accessToken;
    req.currentUser = {};

    jwt.verify(token, process.env.SECRETKEY, async function (err, decoded) {
      if (decoded) {
        let userDetails = await UserModel.findOne({_id:decoded._id});
        
        // console.log("<><><><><><><><><><><><><>",find_userToken)
        if(userDetails){
          req.currentUser.emailId = decoded.mobile;
          next();
        }
        
      } else {
        globalService.sendMsg('error', 'tokenNF', req, res);
        return false;
      }
    });
  } else {
    globalService.sendMsg('error', 'tokenNA', req, res);
    return false;
  }
};



module.exports = {
  apiValidateToken,
  
}