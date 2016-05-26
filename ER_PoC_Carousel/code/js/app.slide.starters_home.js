document.addEventListener('presentationInit', function(){
	app.starters = {
	
	};
	app.slide.starters_home = {
		onInit:function(slideElement){
			
		},
		onEnter:function(slideElement){
			if(!slideElement.isInit){
				slideElement.isInit = true;
				this.onInit(slideElement);
			}
			
			util.removeClass(window.mainmenu, 'hidden');
		},
		onExit:function(){
		}
	}
});