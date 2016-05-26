(function(){
	'use strict';
	var trackTimeout,
		pName = 'ACS';

	function onEnter(event){
		var slideElement = event.target,
			slideId, slideJSON, data, params = {};
		if(!slideElement.hasAttribute('data-ignore-tracking')){
			slideId = slideElement.id;
			slideJSON = app.json.slides[slideId];

			if(slideJSON){
				data = slideJSON.monitoring;
				if(data){
					save(getParams(slideId));
				}else{
					console.log('-----Slide: ' + slideId + ' doesn\'t has monitoring field!');
				}
			}else{
				console.log('-----Slide: ' + slideId + ' doesn\'t present in structure!');
			}
		}
	}

	function getParams(slideId){
		var slideJSON = app.json.slides[slideId],
			data = slideJSON.monitoring,
			params = {};

		params.name = slideJSON.name;
		//params.id = params.name.replace(/ /g, '_');
        params.id = slideJSON.id;
		//params.subChapter = data.subchapter || app.slideshow.id;
		//params.subChapterId = params.subChapter.replace(/ /g, '_');
		params.chapter = data.chapter;
		//params.chapterId = params.chapter.replace(/ /g, '_');
        params.chapterId = data.chapterId;
		params.path = app.collection.id + '/' + app.slideshow.id + '/' + slideId;

		return params;
	}

	function save(params){
		clearTimeout(trackTimeout);
		trackTimeout = setTimeout(function(){
//			log(params);
			ag.submit.slide(params);
		}, 200);
	}

	function log(params){
		console.log("id:" + params.id + ", name:" + params.name +
			"\nchapterId:" + params.chapterId + ", chapter:" + params.chapter +
			"\nsubChapterId:" + params.subChapterId + ", subChapter:" + params.subChapter +
			"\npath:" + params.path);
		console.log("************************************************");
	}

	document.addEventListener('slideEnter', onEnter);
	document.addEventListener('slidePopupEnter', onEnter);

	document.addEventListener('presentationInit', function(){
		app.analytics = {
			getParams: getParams,
			save: save
		}
	});
})();