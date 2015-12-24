$(function(){
	// $('#pagelet-feedlist ul li').css({"background-color":"#f8f8f8"});

	// $.ajax({
	// 	url:'/ajax/page',
	// 	method:'GET',
	// 	success:function(ret){
	// 		console.log(ret);
	// 	}
	// })
	var topicNewsViewModel = new TopicNewsViewModel();
	topicNewsViewModel.getData();
	ko.applyBindings(topicNewsViewModel);

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(window).height();
		if(scrollTop + windowHeight + 20 >= scrollHeight){
			topicNewsViewModel.showNext();
		}
	})
})

var TopicNewsViewModel = function(){
	var self = this;
	self.TopicNewsList = ko.observableArray();
	self.TotalData = [];
	self.currentCount = 0;
	self.TotalTopicNews = ko.observableArray();

	// get page data
	self.getData = function(){
		$.ajax({
			url:'/page/init',
			method:"GET",
			success:function(resp){
				if(resp.status != 200){
					console.log("Get page data error");
					return;
				}
				self.parseData(resp.data);
			}
		})
	}

	self.parseData = function(data){
		self.TotalTopicNews.removeAll();
		var newsLength = data.length;
		for(var i =0; i < newsLength; i++){
			var topicNews = new TopicNews();
			topicNews.id = data[i].id;
			topicNews.title = data[i].title;
			topicNews.author = data[i].author;
			topicNews.link = data[i].link;
			topicNews.authorLink = data[i].authorLink;
			topicNews.reply = data[i].reply;
			topicNews.read = data[i].read;
			topicNews.createTime = data[i].createTime;
			topicNews.lastReply = data[i].lastReply;
			self.TotalTopicNews.push(topicNews);
		}
		self.TotalTopicNews.sort(function(left,right){
			if(right.reply != left.reply){
				return right.reply - left.reply;
			}else{
				return right.read - left.read;
			}

		})

		self.showNext();
		// self.currentCount = self.TopicNewsList.length;
	}

	self.showDefaultItem = function(){
		self.TopicNewsList = self.TotalTopicNews.slice(0,20);
		console.log(self.TopicNewsList.length);
		self.currentCount = 20;
	}
	self.showNext = function(){
		var nextList = self.TotalTopicNews.slice(self.currentCount,self.currentCount + 20 <= self.TotalTopicNews().length ? self.currentCount + 20 : self.TotalTopicNews().length);
		var itemFrag = document.createDocumentFragment();
		var temp = '';
		for(var i = 0; i< nextList.length;i++){
			var tempTe = '<!--new items-->\
								<li class="item clearfix">\
									<div class="info">\
										<p class="title">\
											<a href="'+ nextList[i].link + '" lastReply="'+ nextList[i].lastReply+ '" title="'+ nextList[i].title + '">'+ nextList[i].title +'</a>\
										</p>\
									</div>\
									<p class="footer">\
										<span class="other">\
											<span class="reply">回复:<span class="red">'+ nextList[i].reply +'</span>&nbsp;&nbsp;&nbsp;&nbsp;</span>\
											<span class="read">阅读:<span class="grey">'+ nextList[i].read +'</span>&nbsp;&nbsp;&nbsp;&nbsp;</span>\
										</span>\
										<span class="footer-right">\
											<span>by:<a href="'+ nextList[i].authorLink +'" title="'+ nextList[i].author +'">'+ nextList[i].author +'</a></span>\
											<span>'+ nextList[i].createTime +'</span>\
										</span>\
									</p>\
								</li>';
			temp += tempTe;				
		}
		$('#pagelet-feedlist ul').append(temp);
		self.currentCount += 20;
	}


}

var TopicNews = function(){
	var self = this;
	self.id = ko.observable("");
	self.author = ko.observable("");
	self.title = ko.observable("");
	self.link = ko.observable("");
	self.authorLink = ko.observable("");
	self.reply = ko.observable("");
	self.read = ko.observable("");
	self.createTime = ko.observable("");
	self.lastReply = ko.observable("");
	// 第一优先权：回帖时间，第二优先权：回复数，第三优先权：阅读数
	// 回帖时间相同时，回复数多的优先，回帖时间、回复数相同时，阅读数多的优先 
	self.priority = ko.observable("");
}