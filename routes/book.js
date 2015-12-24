var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var http = require('http');
var iconv = require('iconv-lite'); 
var BufferHelper = require('bufferhelper');

var scrapt = {};
var baseUrl = 'http://bbs.hupu.com';
var url = 'http://bbs.hupu.com/bxj';
var pageArea = '';
scrapt.get = function(url,cb){
  http.get(url, function(res) {

    var size = 0;
    var chunks = [];
    var bufferHelper = new BufferHelper();
    res.on('data', function(chunk){
      bufferHelper.concat(chunk);
    });

    res.on('end', function(){
      var data = iconv.decode(bufferHelper.toBuffer(),'GBK');
      cb(null, data);
    });

  }).on('error', function(e) {
    cb(e, null);
  });
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('book', { title: '前端知识整理'});
});

module.exports = router;
