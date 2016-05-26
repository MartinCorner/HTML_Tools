(function(){
	'use strict';
	var indicatorsContainer;

	document.addEventListener('presentationInit', function(){
		indicatorsContainer = document.getElementById('indicators');

		app.indicators = {
			hide: function(){
				indicatorsContainer.classList.add('hidden');
			},
			show: function(){
				indicatorsContainer.classList.remove('hidden');
			}
		};
	});

	document.addEventListener('slideEnter', function(event){
		var currentSlide = event.target;
		if(currentSlide.classList.contains("indicated") && app.slideshow.length > 1){
			indicatorsContainer.innerHTML = app.slideshow.currentIndex+1+'/'+app.slideshow.length;
		}
		else{
			indicatorsContainer.innerHTML = '';	
		}
	});
})();

