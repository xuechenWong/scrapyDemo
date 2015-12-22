var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var http = require('http');
var iconv = require('iconv-lite'); 
var BufferHelper = require('bufferhelper');

var scrapt = {};
var baseUrl = 'http://bbs.hupu.com';
var url = 'http://bbs.hupu.com/bxj-2';
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
router.get('/page', function(req, res, next) {
	var items= [];
	scrapt.get(url,function(err,data){
	  var html = data.toString();
	  $ = cheerio.load(html);
	  console.log('invoke pages http server!');
	  $('#pl tbody').last().find('tr').each(function(){
	  	var item = {};
		item.title = $(this).find('.p_title >a').text();
		item.href = baseUrl + $(this).find('.p_title >a').attr('href');
		item.author = $(this).find('.p_author >a').text();
		item.authorLink = $(this).find('.p_author >a').attr('href');
		$(this).find('.p_author >a').remove();
		item.time = $(this).find('.p_author').text();
		var bigText = $(this).find('.p_re').text();
		item.reply = bigText.split('/')[0];
		item.read = bigText.split('/')[1];
	  	items.push(item);
	  })
	  // res.render('index', { title: '你关心的步行街头条',item:items });
	})
});

module.exports = router;
