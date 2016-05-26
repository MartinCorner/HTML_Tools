(function(){
	/* global XMLHttpRequest, HTMLElement */
	'use strict';
	var utils = {};

	utils.ajax = function(url, callback, isAsync){
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function(){
			if(this.readyState === 4){
				callback.call(this);
			}
		};

		xhr.open('GET', url, isAsync);
		xhr.send(null);
	};

	utils.extend = function(receiving, giving, keys){
		var index;

		if(!keys || !keys.length){
			keys = Object.keys(giving);
		}

		for(index = 0; index < keys.length; index++){
			receiving[keys[index]] = giving[keys[index]];
		}
	};

	utils.getElement = function(selector){
		if(selector instanceof HTMLElement){
			return selector;
		}
		if(/[\*\.\#\>\+\:\s\[\]\(\)]/.test(selector)){
			return document.querySelector(selector);
		}
		return document.getElementById(selector) || document.getElementsByTagName(selector)[0];
	};

	utils.getElementParent = function(element, parentTag){
		element = this.getElement(element);
		parentTag = parentTag.toUpperCase();

		if(element){
			while(element.tagName !== parentTag){
				element = element.parentNode;

				if(element.tagName === 'BODY'){
					return null;
				}
			}
		}

		return element;
	};
	
	utils.fastGoTo = function(){
		document.body.addClass('no-scroll');

		app.goTo.apply(app, arguments);
		setTimeout(function(){

			document.body.removeClass('no-scroll');
			app.menu.refresh();


		}, 1);
	};

	utils.removeChildren = function(element){
		while(element.firstChild){
			element.removeChild(element.firstChild);
		}
	};

	window.utils = utils;
})();