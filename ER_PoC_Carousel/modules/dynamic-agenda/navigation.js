(function(global){
	"use strict";
	var events = ['swipeleft', 'swiperight'], itemPerPage = 4, offset;

	function ScrollNavigationBuilder(slideElement){
		var i, that = this;

		offset = app.dimensions[0];
		this.scrollElement = slideElement.getElementsByClassName('slidethumbs')[0];
		for(i in events){
			if(events.hasOwnProperty(i)){
				slideElement.getElementsByClassName('agendascroller')[0].addEventListener(events[i], function(event){
					touchy.stop(event);
					that.swipe(event.type);
				});
			}
		}
		this.refresh();
	}

	ScrollNavigationBuilder.prototype.refresh = function(){
		var itemCount, fullPage, modPage;

		this.curPosition = 0;
		itemCount = this.scrollElement.children.length;
		fullPage = Math.floor(itemCount / itemPerPage);
		modPage = itemCount % itemPerPage > 0 ? 1 : 0;
		this.limitations = [0, -Math.abs((fullPage + modPage - 1) * offset)];

		this.setPosition(this.curPosition, true);
	};

	ScrollNavigationBuilder.prototype.swipe = function(type){
		type === 'swipeleft' ? this.curPosition -= offset : this.curPosition += offset;
		if(this.curPosition > this.limitations[0]){
			this.curPosition = this.limitations[0];
		}else if(this.curPosition < this.limitations[1]){
			this.curPosition = this.limitations[1];
		}
		this.setPosition(this.curPosition);
	};

	ScrollNavigationBuilder.prototype.setPosition = function(x, skipTransition){
		var that = this;
		if(skipTransition){
			this.scrollElement.addClass('skip-transition');
			setTimeout(function(){
				that.scrollElement.removeClass('skip-transition');
			}, 10);
		}
		this.scrollElement.style.cssText = '-webkit-transform: translateX(' + x + 'px)';
	};

	global.ScrollNavigationBuilder = ScrollNavigationBuilder;
})(window);

