var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var http = require('http');
var iconv = require('iconv-lite'); 
var BufferHelper = require('bufferhelper');

var pageArea = '';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('book', { title: '前端知识整理'});
});

module.exports = router;
