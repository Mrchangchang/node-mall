/**
 * Created by chang on 2018/1/15.
 */
var express = require('express');
const url = "mongodb://127.0.0.1:27017/node_mall";
const mongoose = require('mongoose');
const goods = require('./../modules/goods');
const User = require('./../modules/user');
function router() {
  var router = express.Router();
//连接本地数据库

  const db = mongoose.connect(url).then(()=> {
    "use strict";
    console.log('连接成功');
  },(err) => {
    "use strict";
    console.log(err);
    console.log('连接错误');
  });

  /** 创建Schema、创建Model **/
/*  var ProductSchema = new mongoose.Schema({
    productId: {type:String},
    productName: {type:String},
    salePrice: {type:Number},
    productImage: {type:String},
    productUrl: {type:String}
  });

  /!** 获取Model，创建Book的实例 Entity **!/
  var goods = mongoose.model('good', ProductSchema);

  var good = new goods({
    "productId":"201710005",
    "productName":"严畅严畅-3",
    "salePrice":80,
    "productImage":"2.jpg",
    "productUrl":""
  });*/
  /* GET home page. */

  router.get('/list', function (req, res, next) {
    "use strict";
    let page = req.param('page');
    let pageSize = parseInt(req.param("pageSize"));
    let priceLevel = req.param('priceLevel');
    let priceGt = '', priceLte = '';
    let skip = (page - 1) * pageSize;
    let sort = req.param('sort');
    let params = {};
    if (priceLevel != 'all') {
      switch (priceLevel) {
        case '0':
          priceGt = 0;
          priceLte = 100;
          break;
        case '1':
          priceGt = 100;
          priceLte = 500;
          break;
        case '2':
          priceGt = 500;
          priceLte = 1000;
          break;
        case '3':
          priceGt = 1000;
          priceLte = 5000;
          break;
      }
      params = {
        salePrice: {
          $gt: priceGt,
          $lte: priceLte
        }
      }
    }
    let goodsModel = goods.find(params).skip(skip).limit(pageSize);
    goodsModel.sort({
      'salePrice': sort
    });
    goodsModel.exec((err, data) => {
      if (err) {
        console.log(err);
        res.json({
          status: 1,
          msg: err.message
        })
      } else {
        console.log(data);
        res.send({
          status: 0,
          result: {
            count: data.length,
            list: data
          }
        }).end()
      }
    })
  });
  router.post('/addCart',(req, res, next) => {
    "use strict";
    let userId = '100000077';
    var productId = req.body.productId;
    User.findOne({userId: userId},(err, userDoc) => {
      if (err) {
        console.log(err);
        res.json({
          status: "1",
          msg: err.message
        })
      } else {
        console.log(userDoc);
        if (userDoc) {
          var goodsItem = '';
          userDoc.cartList.forEach((item) => {
            if (item.productId == productId) {
              goodsItem = item;
              item.productNum ++;
            }
          });
          if (goodsItem) {
            userDoc.save(function (err2,doc2) {
              if(err2){
                res.json({
                  status:"1",
                  msg:err2.message
                })
              }else{
                res.json({
                  status:'0',
                  msg:'',
                  result:'success'
                })
              }
            })
          } else {
            goods.findOne({productId: productId}, (err1, doc) => {
              if (err1) {
                console.log(err1);
                res.json({
                  status: "1",
                  msg: err1.message
                })
              } else {
                console.log('查询商品成功',doc)
                if (doc) {
                  doc.checked = 1;
                  doc.productNum = 1;
                  console.log(User.cartList);
                  userDoc.cartList.push(doc);
                  userDoc.save((err2, doc2) => {
                    if(err2) {
                      console.error(err2);
                      res.json({
                        status: "1",
                        msg: err2.message
                      })
                    } else {
                      res.json({
                        status: 0,
                        msg: "",
                        result:'success'
                      })
                    }
                  })
                } else {
                  console.log(req.body.productId);
                  res.json({
                    status: "1",
                    msg: '没有查询到商品'
                  })
                }
              }
            })
          }

        }
      }
    })
  })
  return router;
}

module.exports = router;
