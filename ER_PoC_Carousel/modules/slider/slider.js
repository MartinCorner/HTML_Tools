/**
 * @name Slider
 * @description this library should be used to create slider element.
 * 		new Slider(selector, options);
 * 		selector should be a string or HTML element
 * 		options should be an object with 'min', 'max' and 'value' fields (optional)
 * @example to create slider you can use some of this variants:
 * 		new Slider(document.getElementById('someId'));
 * 		new Slider(document.getElementById('someId'), {min: 0, max: 20, value: 10});
 * 		new Slider('.some-class:nth-of-type(1)');
 * 		var slider = new Slider('someId');
 * 		slider.onchange = function(){ //some action when slider value was changed
 * 			console.log(this.value);
 *		}
 * 		slider.onfinalchange = function(){ //some action when slider value was changed and user has left slider element
 *			console.log(this.value);
 *		}
 * @require touchy.js, utils.js
 * @autor Alexey Raspopov, alexey.raspopov@qa-power.com
 */
(function(global){
	'use strict';
	function Slider(element, options){
		var neededOption;
		element = utils.getElement(element);
		if(!element){
			throw new TypeError('Element doesn\'t exist. Can\'t create slider');
		}
		if(!options){
			options = {min: 0, max: 100, value: 0};
		}
		this.element = element;
		this.min = options.min || 0;
		this.max = options.max || 100;
		if(this.min >= this.max){
			throw new Error('Minimum value should be less than maximum');
		}
		this.handler = document.createElement('div');
		element.appendChild(this.handler);
		this.axis = element.offsetWidth >= element.offsetHeight ? 'X' : 'Y';
		neededOption = this.axis === 'X' ? 'left' : 'top';
		if(this.axis === 'X'){
			this.maxTranslate = element.offsetWidth - this.handler.offsetWidth;
		}else{
			this.maxTranslate = element.offsetHeight - this.handler.offsetHeight;
		}
		this.fold = this.maxTranslate / (this.max - this.min);
		this.elementOffset = element.getBoundingClientRect()[neededOption] - utils.getElementParent(element, 'article').getBoundingClientRect()[neededOption];
		this.wasTouched = false;
		this.isEnable = true;
		['start', 'move', 'end'].forEach(function(eventName){
			element.addEventListener(touchy.events[eventName], this, false);
		}, this);
		this.halfOfHandlerSize = this.handler['offset' + (this.axis === 'X' ? 'Width' : 'Height')] / 2;
		this.onchange = function(){};
		this.onfinalchange = function(){};
		this.setValue(options.value || this.min);
	}
	Slider.prototype.handleEvent = function(event){
		var type = event.type, translate;
		event.preventDefault();
		event.stopPropagation();
		event = utils.getOriginalEvent(event);
		if(this.isEnable){
			switch(type){
				case touchy.events.start:
					this.wasTouched = true;
				case touchy.events.move:
					if(this.wasTouched){
						translate = event['client' + this.axis] - this.elementOffset - this.halfOfHandlerSize;
						this.value = Math.round(this.setHandlerTranslate(translate) / this.fold) + this.min;
						this.onchange();
					}
					break;
				case touchy.events.end:
					this.wasTouched = false;
					this.onfinalchange();
					break;
			}
		}
	};
	Slider.prototype.setHandlerTranslate = function(translate){
		if(translate < 0){
			translate = 0;
		}else if(translate > this.maxTranslate){
			translate = this.maxTranslate;
		}
		this.handler.style.webkitTransform = 'translate' + this.axis + '(' + translate + 'px)';
		return translate;
	};
	Slider.prototype.setValue = function(value){
		if(value >= this.min && value <= this.max){
			this.value = value;
			this.setHandlerTranslate((value - this.min) * this.fold);
			this.onchange();
		}
	}
	global.Slider = Slider;
})(window);