
var express = require('express');

var user_C = require("../controllers/User");


var router = express.Router();

var multer = require('multer');
const localStorage = multer.diskStorage({
  destination: (req, res, next) => {
    next(null, global.CONFIGS.uploadPath)
  },
  filename: (req, file, next) => {
    next(null, Date.now() + '-' + file.originalname)
  }
});
var upload = multer({ storage: localStorage});
/* GET home page. */
var cpUpload = upload.fields([
  { name: 'Profile_pic', maxCount: 1 },
  { name: 'assignmentFile', maxCount: 1 }
])

router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.render('pages/dashboard');
});
router.post("/user/login", user_C.loginApi);
router.post("/user/registrationApi",cpUpload, user_C.registerUserApi);
router.post("/user/assignmentApi",cpUpload, user_C.assignmentApi);
router.post("/user/getassignmentApi", user_C.getassignmentApi);






module.exports = router;

