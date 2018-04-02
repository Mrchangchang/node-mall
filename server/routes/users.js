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

  //购物车删除
  router.post('/cart/del',(req, res, next) => {
    "use strict";
    var userId = req.cookies.userId, productId = req.body.productId;
    User.update({
        userId:userId
      }, {
        $pull: {
          'cartList': {
            'productId': productId
          }
        }
      }, (err, doc) => {
        if (err) {
          console.log(err);
          res.json({
            status: "1",
            message: err.message,
            result: ''
          })
        } else {
          res.json({
            status: "0",
            message: '',
            result: 'suc'
          })
        }
      })
  });

  //购物车编辑
  router.post('/cart/edit',(req, res, next) => {
    "use strict";
    var userId = req.cookies.userId;
    var productId = req.body.productId;
    var productNum = req.body.productNum;
    var checked = req.body.checked;
    User.update({"userId": userId,"cartList.productId": productId},{
      "cartList.$.productNum": productNum,
      "cartList.$.checked": checked
    },(err, doc) => {
      if (err) {
        console.log(err);
        res.json({
          status: "1",
          message: err.message,
          result: ''
        })
      } else {
        res.json({
          status: "0",
          message: '',
          result: 'suc'
        })
      }
    })
  });

  //购物车全选
  router.post('/editCheckAll', (req,res, next) => {
    var userId = req.cookies.userId;
    var checkAll = req.body.checkAll?'1': '0';

    "use strict";
    User.findOne({userId: userId}, (err, user) => {
      if (err) {
        console.log(err);
        res.json({
          status: "1",
          message: err.message,
          result: ''
        })
      } else {
        if (user) {
          user.cartList.forEach( (item) => {
            item.checked = checkAll;
          })
          user.save(function (err, doc) {
            if (err) {
              res.json({
                status: "1",
                message: err.message,
                result: ''
              })
            } else {
              res.json({
                status:'0',
                msg:'',
                result:'suc'
              });
            }
          })
        } else {
          res.json({
            status: "1",
            message: 'not find',
            result: ''
          })
        }
      }
    })
  })

  //地址列表
  router.get('/addressList', (req, res, next) => {
    "use strict";
    var userId = req.cookies.userId;
    User.findOne({userId: userId}, (err, doc) => {
      if (err) {
        console.log(err);
        res.json({
          status: '1',
          message: err.message,
          result: ''
        })
      } else {

        res.json({
          status: '0',
          message: '',
          result: doc.addressList || []
        })
      }
    })
  });

  //设置默认地址
  router.post('/setDefault', (req, res, next) => {
    "use strict";
    var userId = req.cookies.userId,
        addressId = req.body.addressId;
    if (!addressId) {
      res.json({
        status: '1003',
        message: "not params",
        result: ''
      })
      return;
    } else {
      User.findOne({userId: userId}, (err, doc) => {
        if (err) {
          console.log(err);
          res.json({
            status: '1',
            message: err.message,
            result: ''
          })
          return;
        } else {
          let addressList = doc.addressList;
          addressList.forEach( (item) => {
            if (item.addressId == addressId) {
              item.isDefault = true;
            } else {
              item.isDefault = false;
            }
          })
          doc.save((err1, doc1) => {
            if (err1) {
              res.json({
                status: '1',
                message: err1.message,
                result: ''
              })
              return;
            } else {
              res.json({
                status: '0',
                message: '',
                result: ''
              })
              return;
            }
          })
        }
      })
    }

  });

  return router;
}

module.exports = router;
