var viewPic = {
	startup: function() {
    this.load();
    this.bind();
    this.init();
	},
	load: function() {
		this.images = [
			["images/biyao.jpg","碧瑶"]
		];

		this.showNumber = 0;
		this.total = this.images.length;
		this.currentAngel = 0;

	},
	bind: function() {
		var that = this;

		// 适应窗口变化
		window.onresize = function() {
			viewPic.$(".preview")[0].style.maxWidth = window.innerWidth+"px";
			viewPic.$(".preview")[0].style.maxHeight = (window.innerHeight-181)+"px";
			console.log(viewPic.$(".preview")[0].style.maxWidth+" "+viewPic.$(".preview")[0].style.maxHeight);
		}		

		// 打开文件夹
		viewPic.addListener(viewPic.$("#chooseFoloder")[0], "change", function(){
			var files = viewPic.$("#chooseFoloder")[0].files;
			var images = [];
			
		  if (files) {
		    [].forEach.call(files, function(file) {
						  if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
						  	var reader = new FileReader();
								viewPic.addListener(reader, "load", function(){
									console.log(this);
								  	images.push([this.result, file.name]);
				  					that.images = images;
										that.total  = images.length;
							
										that.updateThumpList();
										that.showNumber = 0;
										that.showBigPic();
										that.updateThumpPositionBySingle();
										that.updateActiveThump();
								})
								reader.readAsDataURL(file);
					  }	
			  });
		  }
		
			if (images.length > 0) {
				that.images = images;
				that.total  = images.length;
				that.showNumber = 0;
				that.showBigPic();
				that.updateThumpPositionBySingle();
				that.updateActiveThump();
			}		  
			console.log(images);
		});

		// 上一张图片
		viewPic.addListener(viewPic.$(".gallery-ctrl-pre-btn")[0], "click", function(){
			if(that.showNumber > 0) {
				that.showNumber -= 1;
				that.currentAngel = 0;
				that.showBigPic();
				that.updateThumpPositionBySingle();
				that.updateActiveThump();
			}
		});

		// 下一张图片
		viewPic.addListener(viewPic.$(".gallery-ctrl-next-btn")[0], "click", function(){
			if(that.showNumber < that.total-1) {
				that.showNumber += 1;
				that.currentAngel = 0;
				that.showBigPic();
				that.updateThumpPositionBySingle();
				that.updateActiveThump();
			}
		});

		viewPic.addListener(viewPic.$(".gallery-thumb-list")[0], "click", function(event){
			var ele = event.target||event.srcElement;
			var index = ele.parentNode.getAttribute("data-index") || ele.getAttribute("data-index");

			if (index) {
				that.showNumber = parseInt(index);
				that.currentAngel = 0;
				that.showBigPic();
				that.updateThumpPositionBySingle();
				that.updateActiveThump();
			}

		});

		// 按左右键进行上一张和下一张图片选择
		viewPic.addListener(document,"keyup",function(e){
			e = e || event;
			if(e.keyCode == 37){
				that.showNumber -= 1;
				that.showBigPic();
				that.updateThumpPositionBySingle();
				that.updateActiveThump();
			}
			if(e.keyCode == 39){
				that.showNumber += 1;
				that.showBigPic();
				that.updateThumpPositionBySingle();
				that.updateActiveThump();
			}
		});

		viewPic.addListener(viewPic.$(".gallery-thumb-pre-btn")[0], "click", function(){
			
					that.updateThumpPositionByGroup("left");
			
		});

		viewPic.addListener(viewPic.$(".gallery-thumb-next-btn")[0], "click", function(){
		
					that.updateThumpPositionByGroup("right");
			
		});

		viewPic.addListener(viewPic.$(".gallery-counterclockwise-btn")[0], "click", function(){
					that.currentAngel -= 90;
					that.showBigPic();
		});

		viewPic.addListener(viewPic.$(".gallery-clockwise-btn")[0], "click", function(){
					that.currentAngel += 90;
					that.showBigPic();
		});

	},
	init: function() {
		this.showNumber = 0;
		this.initBigPic();
		this.updateBrowseInfo();
		this.initThump();
	},
	$: function(selector){
		return document.querySelectorAll(selector);
	},
	addListener: function(target, type, handler) {
		if (target.addEventListener) {
			target.addEventListener(type,handler,false);
		} else if (target.attachEvent) {
			target.attachEvent("on"+type,handler);
		} else {
			target["on"+type]=handler;
		}		
	},
	removeListener: function(target, type, handler) {
		if (target.removeEventListener) {
			target.removeEventListener(type, handler, false);
		} else if (target.detachEvent) {
			target.detachEvent("on" + type, handler);
		} else {
			target["on"+type]=handler;
		}
	},

	initBigPic: function() {
		viewPic.$(".preview")[0].style.maxWidth = window.innerWidth+"px";
		viewPic.$(".preview")[0].style.maxHeight = (window.innerHeight-181)+"px";
		if (this.images.length > 0) {
			this.showBigPic();
		}	
	},
	showBigPic: function() {
		viewPic.$(".preview")[0].style.transform = "rotate("+this.currentAngel+"deg) scale(1)";
		viewPic.$(".preview")[0].setAttribute("src",this.images[this.showNumber][0]);
	},
	updateBrowseInfo: function() {
		viewPic.$(".gallery-browse-info span")[0].textContent = "第" + this.showNumber + "/" + this.total;
	},
	// 更换下一张图时，thump list 位置
	updateThumpPositionBySingle: function(index) {
		viewPic.$(".gallery-thumb-list")[0].style.width = this.total*75+"px" || (window.innerWidth-97*2-75) + "px";
		index = index || this.showNumber;
		viewPic.$(".gallery-thumb-list")[0].style.left = ((window.innerWidth-97*2-75)/2-75*index) +"px";	
	},
	// 更换下一组图时，thump list 位置
	updateThumpPositionByGroup: function(direction, num) {
		var firstLeft= parseInt((window.innerWidth-97*2-75)/2-75*0);
		var lastLeft= parseInt((window.innerWidth-97*2-75)/2-75*(this.total-1));
		var curLeft = parseInt(viewPic.$(".gallery-thumb-list")[0].style.left);

		viewPic.$(".gallery-thumb-list")[0].style.width = this.total*75+"px" || (window.innerWidth-97*2-75) + "px";
		direction = direction || "left";
		num = num || 3;
		
		if (direction === "left") {
			if (curLeft < firstLeft) {
				if (firstLeft - curLeft <= 75*num) {
					viewPic.$(".gallery-thumb-list")[0].style.left =  firstLeft + "px";
					return ;
				} else {
					viewPic.$(".gallery-thumb-list")[0].style.left = Math.floor(curLeft+75*num)+"px";		
					return ;
				}
			}
			
		} else {
			if (curLeft > lastLeft) {
				if (curLeft - lastLeft<= 75*num) {
					viewPic.$(".gallery-thumb-list")[0].style.left = lastLeft+"px";
					return ;
				} else {
					viewPic.$(".gallery-thumb-list")[0].style.left = Math.floor(curLeft-75*num)+"px";
					return ;
				}
			}
			
		}

	},
	// 更新 thump 图的当前选中状态
	updateActiveThump: function(index) {
		// 取消过去选中的
		if (viewPic.$(".gallery-thumb-item-focus").length > 0) {
			var tmpStr = viewPic.$(".gallery-thumb-item-focus")[0].className;
			viewPic.$(".gallery-thumb-item-focus")[0].className = tmpStr.split("gallery-thumb-item-focus").join("").trim();
		}

		// 使当前选中的显示蓝色边框
		viewPic.$("[data-index='"+this.showNumber+"']")[0].className += " gallery-thumb-item-focus";

	},
	initThump: function() {
		var thumpStr="";
		var that = this;
		
		that.updateThumpList();

		// 初次初始化 thump list
		that.showNumber = 0;
		that.updateThumpPositionBySingle();
		that.updateActiveThump();
	},
	updateThumpList: function() {
		var that = this;
		var curItem = viewPic.$(".gallery-thumb-item");
		

		// 增加 thump
		if (curItem.length < this.total) {
			var addThumpList = "";
			for (var i = curItem.length; i < this.total; i++) {
					addThumpList += '<div class="gallery-thumb-item" data-index="'
	  			 + i + '">'
	  			 + '<div class="gallery-thumb-item-img" style="background-image: url());"></div>'
					 + '<div class="gallery-thumb-item-border"></div>'
					 + '</div>';
			}
			this.$(".gallery-thumb-list")[0].innerHTML += addThumpList;
		}

		var curImage = viewPic.$(".gallery-thumb-item-img");
		[].forEach.call(that.images,function(item, index){
				curImage[index].style.backgroundImage = "url("+item[0]+")";
		});
		
	}

};

viewPic.startup();



