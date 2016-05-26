(function(global){
	"use strict";

	function ImagePreload(imageList, callback){
		imageList.forEach(function(imagePath){
			var image = new Image();
			image.src = imagePath;
			if(callback){
				image.onload = function(){
					callback(image);
				};
			}
		});
	}

	global.ImagePreload = ImagePreload;
})(window);