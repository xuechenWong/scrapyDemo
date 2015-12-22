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
})

var TopicNewsViewModel = function(){
	var self = this;
	self.TopicNewsList = ko.observableArray();

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
		self.TopicNewsList.removeAll();
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
			self.TopicNewsList.push(topicNews);
		}
		self.TopicNewsList.sort(function(left,right){
			if(right.reply != left.reply){
				return right.reply - left.reply;
			}else{
				return right.read - left.read;
			}

		})
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