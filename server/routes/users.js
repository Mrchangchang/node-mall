var express = require('express');
var User = require('./../modules/user')

/* GET users listing. */
function router() {
  var router = express.Router();
  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

  router.post('/login',function(req, res) {
    "use strict";
    var params = {
      userName: req.body.userName,
      userPwd: req.body.userPwd
    };
    User.findOne(params,(err, doc) => {
      if (err) {
        res.json({
          status: "1",
          msg: err.message
        })
      } else {
        if (doc) {
          res.cookie('userId',doc.userId,{
            path: "/",
            maxAge: 1000*60*60
          });
          res.cookie("userName",doc.userName,{
            path:'/',
            maxAge:1000*60*60
          });
          console.log(req.session)
          // req.session.user = doc;
          res.json({
            status: "0",
            msg: "",
            result: {
              userName: doc.userName
            }
          })
        } else {
          res.json({
            status: "1",
            msg: '用户不存在'
          })
        }
      }
    })
  });
  //登出接口的实现
  router.post('/logout', (req, res) => {
    "use strict";
    res.cookie('userId', {
      path: "/",
      maxAge: -1
    });
    res.cookie('userName', {
      path: "/",
      maxAge: -1
    });
    res.json({
      status: "1",
      msg: "",
      result: ""
    })
  });
  //购物车列表
  router.get('/cartList', (req, res) => {
    "use strict";
    let userId = req.cookies.userId;
    User.findOne({userId: userId}, (err, doc) =>{
      if (err) {
        res.json({
          status: "1",
          mes: err.message,
          result: ""
        })
      } else {
        if(doc) {
          res.json({
            status: "0",
            mes: '',
            result: doc.cartList
          })
        }
      }
    })
  })
  return router;
}

module.exports = router;
