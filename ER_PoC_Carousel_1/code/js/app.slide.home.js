document.addEventListener('presentationInit', function(){
	app.slide.home = {
		onEnter:function(slideElement){
        
		},
		onExit:function(){
		}
	};
	app.slide.splash = {
		onInit:function(slideElement){
			slideElement.addEventListener(
                                "click", function (event)
                                {
                                	app.init('play');
                                    app.goTo('play', 'predefined', 'predefined');
									app.navigationToolbar.show();
                                });
			
		},
		onEnter:function(slideElement){
			if(!slideElement.isInit){
				slideElement.isInit = true;
				this.onInit(slideElement);
			}
			 
           
		},
		onExit:function(){
		
		}
	};

});
