var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var moment = require("moment");
const bcrypt = require("bcryptjs");
var randomstring = require("randomstring");
const passport = require("passport");

const http = require("http");




var globalServices = require("../services/globalService");
var constants = require("../models/modelConstants");
var UserModel = mongoose.model(constants.UserModel);
var assignmentFileModel = mongoose.model(constants.assignmentFileModel);



let usersFunctions = {
registerUserApi: async function (req, res, next) {
    console.log("body===", req.formdata);
    

    console.log("filename", req.files);
    var Profile_pic =
       req.files && req.files.Profile_pic.length
        ? "uploads/" + req.files.Profile_pic[0].filename
        : "";
    
    var data = {
      responseCode: global.CONFIGS.responseCode.success,
      responseMessage: "",
    };
    try {
        UserModel.findOne({
          $or: [{ mobile: req.body.mobile }, { email: req.body.email }],
        }).then((result) => {
          if(result){
                data.responseCode = global.CONFIGS.responseCode.error;
                data.responseMessage = global.CONFIGS.api.registerFail;
                res.send(data);
          } else {
            // generate hash
            bcrypt.genSalt(10, (err, salt) => {
              if (err) {
                data.responseCode = global.CONFIGS.responseCode.error;
                data.responseMessage = err;
                console.log("err",err)
                res.send(data);
              } else {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                  if (err) {
                    data.responseCode = global.CONFIGS.responseCode.error;
                    console.log("err",err)
                    data.responseMessage = err;
                    res.send(data);
                  } else {
                    // save data in db
                    UserModel.create(
                      {
                        avatar: Profile_pic,
                        firstName: req.body.first_name,
                        lastName: req.body.last_name,
                        mobile: req.body.mobile,
                        email: req.body.email,
                        school_name: req.body.school_name,
                        password: hash,
                      }).then((result) => {
                        if (err ) {
                          console.log("err",err)
                          data.responseCode = global.CONFIGS.responseCode.error;
                          data.responseMessage = JSON.stringify(err);
                          res.send(data);
                        } else{
                            data.responseCode = global.CONFIGS.responseCode.success;
                            data.responseMessage =  global.CONFIGS.api.registerSuccess;
                            res.send(data);
                        }
                      }
                    );
                  }
                });
              }
            });
          }
        });
      // }
    } catch (ex) {
      data.responseCode = global.CONFIGS.responseCode.error;
      console.log("err",ex)
      data.responseMessage = "djfh"+JSON.stringify(ex) ;
      res.send(data);
    }
  },

  loginApi: function (req, res, next) {
    const { mobile, password, user_type, device_id, fcm_key, deviceType } =
      req.body;
      console.log("body===",req.body)
    
    var data = {
      responseCode: global.CONFIGS.responseCode.success,
      responseMessage: "",
      userId: "",
      sessionToken: "",
      first_name: "",
      last_name: "",
      mobile: "",
      email: "",
      Profile_pic: "",
    };

    UserModel.findOne({ mobile: mobile}).then (( user) => {
      
      if ( user) {
        
        bcrypt
          .compare(password, user.password)
          .then(async (match) => {
            if (match) {
                  
                    const payload = { mobile: user.mobile,_id:user._id };
                    const options = {
                      expiresIn: global.CONFIGS.token.apiTokenExpiry,
                      issuer: "Ugna",
                    };
                    const secret = process.env.SECRETKEY;
                    const token = jwt.sign(payload, secret, options);
                    data.sessionToken = token;
                    data.responseMessage = global.CONFIGS.api.loginSuccess;
                    data.userId = user._id;
                    data.first_name = user.firstName;
                    data.last_name = user.lastName;
                    data.mobile = user.mobile;
                    data.email = user.email;
                    data.Profile_pic = user.avatar;
                    data.id = user.UserID;
                    res.send(data);
                  
                
              }
              
            else {
              data.responseCode = global.CONFIGS.responseCode.error;
              data.responseMessage = global.CONFIGS.api.loginFail;
              res.send(data);
            }
          })
          .catch((err) => {
            console.log("error", err);

            data.responseCode = global.CONFIGS.responseCode.error;
            data.responseMessage = global.CONFIGS.api.loginFail;
            res.send(data);
          });
      } else {
        data.responseCode = global.CONFIGS.responseCode.error;
        data.responseMessage = global.CONFIGS.api.userNotFound;
        res.send(data);
      }
    });
  },

  assignmentApi : function (req, res, next) {
    console.log("body===", req.body);
    const breck_D_DestAddress = req.body.student.split(/[ .,]+/);
    
    console.log("filename breck_D_DestAddress==", breck_D_DestAddress);

    console.log("filename", req.files);
    var assignmentFile =
       req.files && req.files.assignmentFile.length
        ? "uploads/" + req.files.assignmentFile[0].filename
        : "";
    
    var data = {
      responseCode: global.CONFIGS.responseCode.success,
      responseMessage: "",
    };
    try {
      // save data in db
      assignmentFileModel.create(
        {
          assignmentFile: assignmentFile,
          assignmentTitle: req.body.assignmentTitle,
          student : breck_D_DestAddress
         
        }).then((result) => {
          console.log(result)
          if (!result ) {
            
            data.responseCode = global.CONFIGS.responseCode.error;
            data.responseMessage = JSON.stringify(err);
            res.send(data);
          } else{
              data.responseCode = global.CONFIGS.responseCode.success;
              data.responseMessage =  global.CONFIGS.api.registerSuccess;
              res.send(data);
          }
        }
      );   
                   
    } catch (ex) {
      data.responseCode = global.CONFIGS.responseCode.error;
      console.log("err",ex)
      data.responseMessage = "djfh"+JSON.stringify(ex) ;
      res.send(data);
    }
  },

  getassignmentApi : async function (req, res, next) {
    console.log("body===", req.body);
    
    var data = {
      responseCode: global.CONFIGS.responseCode.success,
      responseMessage: "",
    };
    try {
      // save data in db
      var dsts = await assignmentFileModel.find({student:req.body.studentID});
      if(dsts){
        data.responseCode= global.CONFIGS.responseCode.success;
        data.responseMessage = "data finded";
        data.result = dsts;
        res.send(data);
      }else{
        data.responseCode = global.CONFIGS.responseCode.error;
      // console.log("err",ex)
      data.responseMessage = "something went wrong" ;
      res.send(data);
      }
                   
    } catch (ex) {
      data.responseCode = global.CONFIGS.responseCode.error;
      console.log("err",ex)
      data.responseMessage = "djfh"+JSON.stringify(ex) ;
      res.send(data);
    }
  }
   
}

module.exports = usersFunctions;
