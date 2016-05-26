(function(){
	"use strict";

	var menu = {
		element: null,
		hidden: null,
		setCollectionList: function(list){
			this.collections.list = list;
		},
		show: function(){
			util.addClass(window.mainmenu, "showed");
			this.hidden = false;
		},
		hide: function(){
			util.removeClass(window.mainmenu, "showed");
			this.hidden = true;
			this.navigation.close();
		},
		collections: {
			list: [],
			contains: function(collection){
				return this.list.indexOf(collection) !== -1;
			},
			add: function(collection){
				if(!this.contains(collection)){
					this.list.push(collection);
				}
			},
			remove: function(collection){
				var index = this.list.indexOf(collection);
				if(index !== -1){
					this.list.splice(index, 1);
				}
			},
			toggle: function(collection){
				if(this.contains(collection)){
					this.remove(collection);
				}else{
					this.add(collection);
				}
			}
		},
		navigation: {
			element: null,
			closed: null,
			handler: null,
			wrapper: null,
			open: function(fast){
				if(!menu.hidden){
					this.element.style.cssText = "";
					util.addClass(this.element,"opened");
					util.addClass(window.mainmenu,"fillmode");
					this.closed = false;
					panelTempY = -0;
					panelCurrentY = -0;
				}
			},
			close: function(fast){
				this.element.style.cssText = "";
				util.removeClass(this.element,"opened");
				util.removeClass(window.mainmenu,"fillmode");
				this.closed = true;
				panelTempY = -panelMaxY;
				panelCurrentY = -panelMaxY;
			}
		}
	}, onSectionEnter, onSlideEnter,
		panelStartY, panelTempY, panelCurrentY, panelMaxY, scrollers;

	function createMenu(collection){
		var menuElement = document.createElement("div"),
			wrapper = document.createElement("div"),
			homeEle, menuEle;

		menuElement.className = "menu";
		wrapper.className = "menu-wrapper";
		app.collections[collection].content.forEach(function(slideshow){
			var item = document.createElement("div");
			item.className = "menu-item";
			if(slideshow === "home"){
				item.className += " home";
			}else{
				item.innerText = app.json.structures[slideshow.replace(collection + "_", "")].name;
			}
			item.setAttribute("data-slideshow", slideshow);
			wrapper.appendChild(item);
		});
		
		menuElement.appendChild(wrapper);

		homeEle = menuElement.getElementsByClassName("home")[0];
		menuEle = menuElement.getElementsByClassName("menu-wrapper")[0];
		setTimeout(function(){
			menuEle.style.minWidth = app.dimensions[0] + homeEle.offsetLeft + "px";
		},0);

		menuElement.addEventListener("tap", function(event){
			var slideshowId = event.target.getAttribute("data-slideshow");
			if(slideshowId === app.slideshow.id){
				app.slideshow.scrollToStart();
			}else{
				app.goTo(collection, slideshowId);
			}
		}, false);
		menu.element = menuElement;
		window.mainmenu.appendChild(menuElement);

		setTimeout(function(){
			document.addEventListener("sectionEnter", onSectionEnter, false);
			menu.scroll = new iScroll(menuElement, {momentum: false, bounce: false, hScroll: true, hScrollbar: false, desktopCompatibility: true});
			menu.show();
			createPanel(collection);
		},0);
	}

	function destroyMenu(){
		destroyPanel();
		menu.scroll.destroy();
		document.removeEventListener("sectionEnter", onSectionEnter);
		window.mainmenu.removeChild(menu.element);
	}

	function createPanel(collection){
		var navigation = document.createElement("div"),
			wrapper = document.createElement("div"),
			handler = document.createElement("div");

		navigation.className = "navigation";
		wrapper.className = "navigation-wrapper";
		handler.className = "handler";
		handler.addEventListener("tap", function(event){
			if(event instanceof UIEvent){
				if(menu.navigation.closed){
					menu.hidden ? menu.show() : menu.hide();
				}
			}
		}, false);

		scrollers = [];

		app.collections[collection].content.forEach(function(slideshow){
			var slideshowElement = document.createElement("div"),
				scrollWrapper = document.createElement("div"),
				scroll;

			slideshowElement.className = "chapter-block";
			slideshowElement.setAttribute("data-slideshow", slideshow);
			scrollWrapper.className = "scroll-wrapper";
			if(slideshow === "home"){
				slideshowElement.className += " home";
			}
			app.slideshows[slideshow].content.forEach(function(slide){
				var slideElement = document.createElement("div"),
					image = new Image();

				slideElement.className = "slide-block";
				slideElement.setAttribute("data-slide", slide);
				image.className = "thumb";
				image.src = "content/img/thumbnails/" + slide + ".png";

				slideElement.addEventListener("tap", function(event){
					if(event instanceof UIEvent){
						if(app.slideshow.id === slideshow){
							app.slideshow.scrollTo(slide);
						}else{
							app.goTo(collection, slideshow, slide);
						}
					}
				}, false);

				slideElement.appendChild(image);
				scrollWrapper.appendChild(slideElement);
			});
			slideshowElement.appendChild(scrollWrapper);
			wrapper.appendChild(slideshowElement);
			scroll = new iScroll(slideshowElement, {
				momentum: false, bounce: false,
				hScroll: false, vScroll: true,
				hScrollbar: false, vScrollbar: false,
				desktopCompatibility: true,
				onScrollMove: function(){
					if(this.y > this.maxScrollY){
						util.addClass(slideshowElement,"continuation");
					}else{
						util.removeClass(slideshowElement,"continuation");
					}
				}});
			scrollers.push(scroll);
		});
		navigation.appendChild(menu.navigation.wrapper = wrapper);
		navigation.appendChild(menu.navigation.handler = handler);
		document.addEventListener("slideEnter", onSlideEnter, false);
		window.mainmenu.appendChild(menu.navigation.element = navigation);
		menu.navigation.closed = true;

		app.menu.scroll.options.onScrollMove = function(){
			menu.navigation.wrapper.style.cssText = "-webkit-transform: translateX(" + this.x + "px);  -webkit-transition: 0s";
		};
	}

	function destroyPanel(){
		document.removeEventListener("slideEnter", onSlideEnter);
		window.mainmenu.removeChild(menu.navigation.element);
	}
	
	menu.refresh = function refresh()
	{
		onSectionEnter();
		onSlideEnter();
	}

	onSectionEnter = (function(){
		var activeMenuItem, activeChapterColumn, leftOffset, rightOffset;
		return function(){
			var value = null;
			if(activeMenuItem){
				util.removeClass(activeMenuItem,"active");
			}
			if(activeChapterColumn){
				util.removeClass(activeChapterColumn,"active");
			}
			activeMenuItem = menu.element.querySelector("[data-slideshow='" + app.slideshow.id + "']");
			activeChapterColumn = menu.navigation.element.querySelector("[data-slideshow='" + app.slideshow.id + "']");
			leftOffset = activeMenuItem.getBoundingClientRect().left;
			rightOffset = leftOffset + activeMenuItem.offsetWidth - window.mainmenu.offsetWidth;
			if(leftOffset < 0){
				value = menu.scroll.x - leftOffset;
			}
			if(rightOffset > 0){
				value = menu.scroll.x - rightOffset;
			}
			if(value !== null){
				menu.navigation.wrapper.style.cssText = "-webkit-transform: translateX(" + value + "px);  -webkit-transition: 0.5s;";
				menu.scroll.scrollTo(value, 0, 500);
			}
			util.addClass(activeMenuItem,"active");
			util.addClass(activeChapterColumn,"active");
		};
	})();

	onSlideEnter = (function(){
		var activeSlide;
		return function(){
			if(activeSlide){
				util.removeClass(activeSlide,"active");
			}
			activeSlide = menu.navigation.element.querySelector("[data-slide='" + app.slideshow.current + "']");
			if(activeSlide){
				util.addClass(activeSlide,"active");
			}
			menu.navigation.close();
		};
	})();

	(function(){
		var element;

		panelStartY = null;
		panelCurrentY = 0;
		panelTempY = 0;
		panelMaxY;

		document.addEventListener(touchy.events.start, function(event){
			if(event.target === menu.navigation.handler && !menu.hidden){
				if(touchy.isTouch){
					event = event.changedTouches[0];
				}
				panelStartY = event.pageY;
				if(!panelMaxY){
					panelMaxY = menu.navigation.element.offsetHeight;
					panelCurrentY = -panelMaxY;
					panelTempY = -panelMaxY;
				}
				element = menu.navigation.element;
				util.addClass(window.mainmenu,"fillmode");
			}
		}, false);
		document.addEventListener(touchy.events.move, function(event){
			if(panelStartY !== null){
				if(touchy.isTouch){
					event = event.changedTouches[0];
				}
				panelTempY = event.pageY - panelStartY + panelCurrentY;
				if(panelTempY >= 0){
					panelTempY = 0;
				}
				if(panelTempY <= -panelMaxY){
					panelTempY = -panelMaxY;
				}
				element.style.cssText = "-webkit-transform: translate3d(0, " + panelTempY + "px, 0); -webkit-transition-duration: 0;";
			}
		}, false);
		document.addEventListener(touchy.events.end, function(event){
			if(panelStartY !== null){
				if(panelTempY <= -panelMaxY / 2){
					app.menu.navigation.close();
					panelCurrentY = -panelMaxY;
					panelTempY = -panelMaxY;
					util.removeClass(window.mainmenu,"fillmode");
				}else{
					app.menu.navigation.open();
					panelCurrentY = 0;
					panelTempY = 0;
				}
				panelStartY = null;
			}
		}, false);
	})();

	["left", "right", "up", "down"].forEach(function(side){
		window.mainmenu.addEventListener("swipe" + side, function(event){
			touchy.stop(event);
		}, false);
	});

	document.addEventListener("collectionLoad", function(){
		var collection = app.loaded.id, homeElement, translateX;
		if(menu.collections.contains(collection)){
			createMenu(collection);
			util.addClass(window.mainmenu, "hidden");
			homeElement = menu.element.getElementsByClassName("home")[0];
			setTimeout(function(){
				translateX = homeElement.offsetLeft;
				menu.scroll.scrollTo(-translateX);
				menu.scroll.options.onScrollMove.call(menu.scroll);
			}, 0);
		}
		if(scrollers){
			setTimeout(function(){
				scrollers.forEach(function(scroller){
					scroller.refresh();
					if(scroller.y > scroller.maxScrollY){
						util.addClass(scroller.wrapper,"continuation");
					}else{
						util.removeClass(scroller.wrapper,"continuation");
					}
				});
			}, 0);
		}
	}, false);

	document.addEventListener("collectionUnload", function(){
		var collection = app.collection.id;
		if(menu.collections.contains(collection)){
			destroyMenu();
		}
	}, false);

	document.addEventListener("presentationInit", function(){
		app.menu = menu;
	}, false);
})();