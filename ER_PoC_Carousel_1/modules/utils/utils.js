/**
 * @name Utils
 * @description collection with some useful functions
 * @author Alexey Raspopov, alexey.raspopov@qa-power.com
 */
(function(){
	'use strict';
	var utils = {};
	utils.ajax = function(url, callback, async){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = callback;
		xhr.open('GET', url, async);
		xhr.send(null);
	};
	utils.extend = function(sub, sup){
		var F = function(){};
		F.prototype = sup.prototype;
		sub.prototype = new F();
		sub.prototype.constructor = sub;
	};
	utils.augment = function(receiving, giving){
		var i, methodName;
		if(arguments[2]){
			for(i = 2; i < arguments.length; i++){
				receiving.prototype[arguments[i]] = giving.prototype[arguments[i]];
			}
		}else{
			for(methodName in giving.prototype){
				receiving.prototype[methodName] = giving.prototype[methodName];
			}
		}
	};
	utils.getElement = function(selector){
		var element;
		if(typeof selector === 'string'){
			element = /[\*\.\#\>\+\:\s\[\]\(\)]/.test(selector) ? document.querySelector(selector) : document.getElementById(selector) || document.getElementsByTagName(selector)[0];
		}else if(selector instanceof HTMLElement){
			element = selector;
		}
		return element;
	};
	utils.getElements = function(selector){
		var node;
		if(typeof selector === 'string'){
			node = /[\*\.\#\>\+\:\s\[\]\(\)]/.test(selector) ? document.querySelectorAll(selector) : document.getElementsByTagName(selector) || document.getElementsByClassName(selector);
		}else{
			node = selector instanceof HTMLElement ? selector : selector instanceof NodeList ? selector : null;
		}
		return node;
	};
	utils.getElementParent = function(element, parentTag){
		element = this.getElement(element);
		parentTag = parentTag.toUpperCase();
		if(element){
			while(element.tagName !== parentTag){
				element = element.parentNode;
				if(element.tagName === 'BODY'){
					return false;
				}
			}
		}
		return element;
	};
	utils.getOriginalEvent = function(event){
		return event.changedTouches ? event.changedTouches[0] : event;
	};
	utils.exports = function(globalName, value){
		window[globalName] = value;
	};
	utils.fastGoTo = function(){
		document.body.addClass('no-scroll');
		app.goTo.apply(app, arguments);
		setTimeout(function(){
			document.body.removeClass('no-scroll');
		}, 1);
	};
	utils.clearChild  = function(el){
		while (el.firstChild) {
			el.removeChild(el.firstChild)
		}
	};
	utils.formatVal = function(value, floatingSeparator, serialSeparator){
  var floatingSeparator = floatingSeparator || '.',
   serialSeparator = serialSeparator || ',',
   tempStr = value.toString(),
   isNegative = tempStr.charAt(0) === '-',
   parts = tempStr.replace('-', '').split(floatingSeparator),
   integral = parts[0],
   formatedStr,
   i, j = 1;
  if (value % 1 !== 0){
	  formatedStr = floatingSeparator + parts[1];
  }else{
	  formatedStr = "";
  }
  for(i = integral.length - 1; i >= 0; i--){
   formatedStr = integral[i] + formatedStr;
   if(j !== integral.length && j % 3 === 0){
    formatedStr = serialSeparator + formatedStr;
   }
   j++;
  }

  if(isNegative){
   formatedStr = '-' + formatedStr;
  }

  return formatedStr;
 };
	utils.exports('utils', utils);
})();