(function(){
	"use strict";
	var exitSlideId, isExit = true;
	function onEnter(event){
		isExit = exitSlideId !== event.target.id;
		event.target.addClass('active');
	}

	function onExit(event){
		exitSlideId = event.target.id;
		setTimeout(function(){
			if(isExit){
				event.target.removeClass('active');
			}
		}, 600);
	}

	document.addEventListener('slideEnter', onEnter);
	document.addEventListener('slideExit', onExit);
})();
