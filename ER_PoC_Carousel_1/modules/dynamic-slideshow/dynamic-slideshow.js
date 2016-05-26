(function(){
	"use strict";
	var DynamicSlideshow = {
		setSlideFunc:function(id){
			app.slide[id] || (app.slide[id] = {});
			['onEnter', 'onExit'].forEach(function(metodName){
				app.slide[id][metodName] || (app.slide[id][metodName] = function(){
				});
			})
		},
		isShowing:function(){
			return !!this.markup;
		},
		setSlide:function(id, slide){
			app.slideElements[id] = slide;
		},
		_createMarkupForSlide:function(id){
			var fragment = document.createElement("div");
			app.getHtml(id, app.pathToSlides, function(html){
				fragment.innerHTML = html;
			});
			return fragment.childNodes[0];
		},
		addSlides:function(ids){
			var slide, fragment = document.createDocumentFragment();
			ids.forEach(function(id){
				var slideWrapper;
				if(!app.json.slides[id]){
					throw new Error("add not existing slide");
				}
				if(this.content.indexOf(id) !== -1){
					return;
				}
				this.content.push(id);
				this.setSlideFunc(id);
				if(!this.isShowing()){
					return;
				}
				slide = this._createMarkupForSlide(id);
				this.setSlide(id, slide);
				if(app.wrapSlides){
					slideWrapper = document.createElement("div");
					slideWrapper.className = "slideWrap";
					slideWrapper.appendChild(slide);
				}else{
					slideWrapper = slide;
				}
				app.slide[id].parent = this;
				fragment.appendChild(slideWrapper);
			}, this);
			if(this.isShowing()){
				this.ele.appendChild(fragment);
				this.refreshMeasurements();
			}
			this.sendUpdateEvent();
		},
		removeSlides:function(ids){
			ids.forEach(function(id){
				var slideIndex = this.content.indexOf(id);
				if(slideIndex === -1){
					return;
				}
				this.content.splice(slideIndex, 1);
				if(!this.isShowing()){
					return;
				}
				this.ele.removeChild(this.ele.childNodes[slideIndex]);
			}, this);
			if(this.isShowing()){
				this.refreshMeasurements();
			}
			this.sendUpdateEvent();
		},
		setSlides:function(ids){
			var that = this,
				contentCopy = this.content.slice(0);
			this.content = [];
			ids.forEach(function(id, index){
				var copyIndex = contentCopy.indexOf(id);
				if(copyIndex === -1){
					that.addSlides([id]);
				}else{
					if(copyIndex !== index){
						that.content.push(id);
						that.ele.appendChild(app.slideElements[id].parentNode);
					}else{
						that.content.push(id);
					}
				}
			});
			contentCopy.forEach(function(id){
				if(that.content.indexOf(id) === -1){
					that.ele.removeChild(app.slideElements[id].parentNode);
				}
			});
			if(this.isShowing()){
				this.refreshMeasurements();
			}
			this.sendUpdateEvent();
//			console.log(that.content);
		},
		clear:function(){
			this.removeSlides(this.content.slice(0));
		},
		refreshMeasurements:function(){
			var slide = this.current, index = this.currentIndex;
			this.length = this.content.length;
			this._setMeasurements();
			this.ele.style.width = this.width + "px";
			if(this.content.indexOf(slide) !== -1){
				index = this.content.indexOf(slide);
			}
			index = Math.min(index, this.length - 1);
			if(index !== -1){
				this._scroll(index);
			}
		},
		sendUpdateEvent: function(){
			if(!this._sendEvent){
				this._sendEvent = debounce(function(){
					var slideshowUpdated = document.createEvent('UIEvents');
					slideshowUpdated.initEvent('slideshowUpdated', true, false);
					slideshowUpdated.slideshow = this.id;
					document.dispatchEvent(slideshowUpdated);
				});
			}
			this._sendEvent();
		}
	};

	function debounce(func, wait){
		var timer;
		return function(){
			var context = this, args = arguments,
				callback = function(){
					timer = null;
					func.apply(context, args);
				};
			if(timer){
				clearTimeout(timer);
			}
			timer = setTimeout(callback, wait || 100);
		};
	}

	function addMetods(recepient, givingObj){
		var methodName;
		for(methodName in givingObj){
			if(givingObj.hasOwnProperty(methodName)){
				recepient.prototype[methodName] = givingObj[methodName];
			}
		}
	}

	addMetods(Slideshow, DynamicSlideshow);
})();