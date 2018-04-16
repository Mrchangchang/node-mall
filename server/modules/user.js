/**
 * Created by chang on 2018/1/26.
 */
const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  "userId": String,
  "userName": String,
  "userPwd": String,
  "orderList": Array,
  "cartList": [{
    "productId": String,
    "productName": String,
    "salePrice": String,
    "productImage": String,
    "checked": String,
    "productNum": String,
  }],
  "addressList": [{
    "addressId": String,
    "userName": String,
    "streetName": String,
    "postCode": String,
    "tel": Number,
    "isDefault": Boolean
  }]
},{
  usePushEach: true
});

module.exports = mongoose.model('user',userSchema);
