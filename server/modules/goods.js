/**
 * Created by chang on 2018/1/20.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var produtSchema = new Schema({
  "productId":{type:String},
  "productName":String,
  "salePrice":Number,
  "productUrl":String,
  "productNum":Number,
  "productImage":String
});

module.exports = mongoose.model('Good',produtSchema);
