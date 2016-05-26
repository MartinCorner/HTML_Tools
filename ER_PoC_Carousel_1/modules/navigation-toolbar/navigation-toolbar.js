(function(){
	'use strict';

	var element = document.getElementById('navigationToolbar'),
		hidden = true,
		delay = 800,
		slideshows = {},
		handler = element.getElementsByClassName('handler')[0],
		container = element.getElementsByClassName('container')[0],
		openedSlideshowId;

	function clearEmbedded(){
		setTimeout(function(){
			app.scroller.enableAll();
			if (openedSlideshowId){
				app.navigationToolbar.opened = false;
				slideshows[openedSlideshowId].ele.removeClass('active');
				slideshows[openedSlideshowId].indicator.removeClass('active');
				openedSlideshowId = null;
				app.slideshow = slideshows.previous;
			}
		}, delay);
	}

	function initNavigationBar(){
		handler.addEventListener(touchy.events.end, function(event){
			touchy.stop(event);
			util.toggleClass(element,'showed');
			clearEmbedded();
			element.removeClass('opened');
			app.overlay.tool("close");
			app.navigationToolbar.hidden = hidden = !hidden;
		});

		Array.prototype.forEach.call(element.getElementsByClassName('controls')[0].children, function(button){
			var slideshowId = button.getAttribute('data-ag-slideshow');
			var product =button.getAttribute('data-ag-refs');
			if(product){
				button.addEventListener(touchy.events.end,function(){
					touchy.stop(event);
					app.overlay.tool("close");
					//console.log(product);
					ag.openPDF('content/pdf/' + product, product);
				})
			}
			if (slideshowId){
				app.slideshow.embed(slideshowId, container, button.getAttribute('data-ag-direction') ? new VerticalSroller(container, app.slideshows[slideshowId]) : null);
				slideshows[slideshowId] = {
					scroller: app.slideshows[slideshowId].scroller,
					ele: app.slideshows[slideshowId].ele,
					indicator: button,
					direction: button.getAttribute('data-ag-direction') || "horizontal"
				};
				slideshows[slideshowId].scroller.disableAll();
				button.addEventListener(touchy.events.end, function(event){
					touchy.stop(event);
					app.overlay.tool("close");
					goTo(slideshowId, 0, true);
				});
			}
		});
	}
	function hide(){
		element.style.webkitTransition = '0';
		element.className = 'hidden';
		app.overlay.tool("close");
		app.navigationToolbar.hidden = hidden = true;
		app.navigationToolbar.opened = false;

		setTimeout(function(){
			element.style.webkitTransition = '';
		},1);
	}
	function show(){
		clearEmbedded();
		element.className = '';
		app.scroller.enableAll();
	}
	function goTo(slideshowId, slideId, isFast){
		if(openedSlideshowId){
			slideshows[openedSlideshowId].ele.removeClass('active');
			slideshows[openedSlideshowId].indicator.removeClass('active');
			slideshows[openedSlideshowId].scroller.disableAll();
		}

		slideshows.previous = slideshows[app.slideshow.id] ? slideshows.previous : app.slideshow;
		app.slideshow = app.slideshows[slideshowId];
		app.slideshow.direction = slideshows[slideshowId].direction;

		if(app.slideshow.direction !== "horizontal"){
			container.addClass("collection");
		}else{
			container.removeClass("collection");
		}
		app.scroller.disableAll();
		slideshows[slideshowId].scroller.enableAll();
		if(isFast){
			document.body.addClass('no-scroll');
			app.goTo(slideshowId, slideId);

			setTimeout(function(){
				document.body.removeClass('no-scroll');
			}, 1);
		}else{
			app.goTo(slideshowId, slideId);
		}

		slideshows[slideshowId].ele.addClass('active');
		slideshows[slideshowId].indicator.addClass('active');
		openedSlideshowId = slideshowId;

//		if (hidden){
		element.addClass('showed');
//		}
		element.addClass('opened');
		app.navigationToolbar.opened = true;
	}

	document.addEventListener("sectionEnter", function(){
		if(app.overlay){
			app.overlay.tool("close");
		}
	});

	document.addEventListener('presentationInit',function(event){
		app.navigationToolbar = {
			hidden: hidden,
			opened: false,
			init: initNavigationBar,
			hide: hide,
			show: show,
			goTo: goTo
		};
	}, false);
})();