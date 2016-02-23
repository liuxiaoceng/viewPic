var viewPic = {};

viewPic.$ = function(selector){
	return document.querySelectorAll(selector);
};

viewPic.addListener =  function(target, type, handler) {
	if(target.addEventListener){
		target.addEventListener(type,handler,false);
	}else if(target.attachEvent){
		target.attachEvent("on"+type,handler);
	}else{
		target["on"+type]=handler;
	}		
};

viewPic.images =  [
		["photo01.jpg","thumb01.jpg"]
		,["photo02.jpg","thumb02.jpg"]
		,["photo03.jpg","thumb03.jpg"]
		,["photo04.jpg","thumb04.jpg"]
		,["photo05.jpg","thumb05.jpg"]
		,["photo06.jpg","thumb06.jpg"]
		,["photo07.jpg","thumb07.jpg"]
		,["photo01.jpg","thumb01.jpg"]
		,["photo02.jpg","thumb02.jpg"]
		,["photo03.jpg","thumb03.jpg"]
		,["photo04.jpg","thumb04.jpg"]
		,["photo05.jpg","thumb05.jpg"]
		,["photo06.jpg","thumb06.jpg"]
		,["photo07.jpg","thumb07.jpg"]
	];

viewPic.showNumber = 0;
viewPic.total = viewPic.images.length;

viewPic.initBigPic = function() {
	var that = this;
	viewPic.$(".preview")[0].style.maxWidth = window.innerWidth+"px";
	viewPic.$(".preview")[0].style.maxHeight = (window.innerHeight-181)+"px";
	if (that.images.length > 0) {
		that.showBigPic();
	}	
};

viewPic.showBigPic = function() {
	viewPic.$(".preview")[0].setAttribute("src",viewPic.images[this.showNumber][0]);
};

viewPic.addListener(viewPic.$(".gallery-ctrl-pre-btn")[0], "click", function(){
	var that = this;
	if(that.showNumber > 0) {
		that.showNumber -= 1;
		that.showBigPic();
		that.updateThumpPositionByClick();
	}
});

viewPic.addListener(viewPic.$(".gallery-ctrl-next-btn")[0], "click", function(){
	var that = this;
	if(that.showNumber < that.total-1) {
		that.showNumber += 1;
		that.showBigPic();
		that.updateThumpPositionByClick();
	}
});



viewPic.updateBrowseInfo = function() {
	var that = this;
	viewPic.$(".gallery-browse-info span")[0].textContent = "第" + that.showNumber + "/" + that.total;
};

viewPic.updateThumpPositionByClick = function() {
	var that = this;
	that.$(".gallery-thumb-list")[0].style.width = that.total*75+"px" || (window.innerWidth-97*2-75) + "px";
	that.$(".gallery-thumb-list")[0].style.left = ((window.innerWidth-97*2-75)/2-75*that.showNumber) +"px";	
}

viewPic.initThump = function() {
	var thumpStr="";
	var that = this;

	for (var i = 0; i < that.total; i++) {
		thumpStr += '<div class="gallery-thumb-item" data-index="'
		  			 + i + '">'
		  			 + '<div class="gallery-thumb-item-img" style="background-image: url());"></div>'
						 + '<div class="gallery-thumb-item-border"></div>'
						 + '</div>';
	}
	that.$(".gallery-thumb-list")[0].innerHTML = thumpStr;
	that.showNumber = 0;
	that.updateThumpPositionByClick();

	var eThumpArr = viewPic.$(".gallery-thumb-item");

	for (var i = 0; i < that.total; i++) {
		
		(function(i) {
			//绑定点击事件
			viewPic.addListener(eThumpArr[i],"click", function(event){
				// 更新当前展示索引
				that.showNumber = i;

				// 更新大图
				that.showBigPic();

				// 更新浏览信息
				that.updateBrowseInfo();

				// 更新 thumb 图
				{
					var ele = event.target||event.srcElement;

					// 获取当前图像容器
					if (!ele.getAttribute("data-index")) {
						ele = ele.parentNode;
					}
					// 取消过去选中的
					if (viewPic.$(".gallery-thumb-item-focus").length > 0) {
						var tmpStr = viewPic.$(".gallery-thumb-item-focus")[0].className;
						viewPic.$(".gallery-thumb-item-focus")[0].className = tmpStr.split("gallery-thumb-item-focus").join("").trim();
					}

					// 选中当前点击的
					ele.className += " gallery-thumb-item-focus";
					that.updateThumpPositionByClick();
			 }

				console.log(ele.getAttribute("data-index"));
			});			
		})(i);

	} // end for
}



viewPic.init = function() {
	this.showNumber = 0;
	this.initBigPic();
	this.updateBrowseInfo();
	this.initThump();
};

viewPic.init();


// 适应窗口变化
window.onresize = function() {
	viewPic.$(".preview")[0].style.maxWidth = window.innerWidth+"px";
	viewPic.$(".preview")[0].style.maxHeight = (window.innerHeight-181)+"px";
	console.log(viewPic.$(".preview")[0].style.maxWidth+" "+viewPic.$(".preview")[0].style.maxHeight);
}
