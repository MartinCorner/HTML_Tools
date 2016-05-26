(function(){
	'use strict';
	var indicatorsContainer, indicators = {};

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

	document.addEventListener('sectionEnter', function(){
		var slideshowContainer = document.getElementById(app.slideshow.id + 'Container'),
			slides = slideshowContainer.querySelectorAll('article.slide.indicated');

		indicators = {};
		utils.removeChildren(indicatorsContainer);

		if(slides.length > 1){
			slides.forEach(function(slide){
				var indicator = indicators[slide.id] = document.createElement('input');

				indicator.type = 'radio';
				indicator.name = 'indicator';
				indicatorsContainer.appendChild(indicator);
			});
		}
	});

	document.addEventListener('slideEnter', function(event){
		var slideId = event.target.id;

		if(indicators.hasOwnProperty(slideId)){
			indicators[slideId].checked = true;
		}
	});
})();