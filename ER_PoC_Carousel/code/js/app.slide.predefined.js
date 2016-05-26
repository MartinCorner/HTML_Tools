document.addEventListener('presentationInit', function(){
  var playAll,playEvent;
  app.slide.predefined = {
    onInit:function(slideElement){
      var con = slideElement.querySelector('div.sectionSelection');
      window.initializeRotary(con, 
                        [
                            "./content/img/predefined/Mild_Men.png", 
                            "./content/img/predefined/Severe_couple.png"

                        ]);
      window.setTimeout(function ()
                        {
                           con.style.opacity = 1;
                        }, 100);
       var navboxs = 
      [
        "Mild/Moderate",
        "Severe/Very Severe"
      ],
      title = slideElement.querySelector('div.story_name'),
      nav = slideElement.querySelector('div.nav_name');
        
      nav.innerHTML = navboxs[0];

      window.didRotaryCurrentIndexChange = function (index)
      {
        nav.innerHTML = navboxs[index];

      };
//      slideElement.querySelectorAll("div.sectionSelection img").forEach(function(dom, index){
//     
//         var move = false,
//             fired = false;
//          dom.addEventListener(touchy.events.start, function(e){
//
//           fired = true;
//           move = false;
//
//
//
//         });
//         dom.addEventListener(touchy.events.move, function(e){
//           move = true
//
//
//         });
//
//         dom.addEventListener(touchy.events.end, function(e){
//            
//        
//          if(fired&&!move)
//          {
//             var footer = document.getElementById('mainfooter');
//                util.removeClass(footer, 'hide');
//                touchy.stop(e);
//             var name ='test'+(index+1)+"_collection";//'Da'+(index+1);
//
//                app.loader.show();
//                app.load(name);
//                utils.fastGoTo(name, 'test'+(index+1), 0);
//                util.removeClass(window.mainmenu, 'hidden');
//
//          }
//         });
//          
//         
//       });

    },
    onEnter:function(slideElement){
      if(!slideElement.isInit){
        slideElement.isInit = true;
        this.onInit(slideElement);
        app.addEvent('swipeleft', function(e){
                                  touchy.stop(e);
                                  }, slideElement);
        app.addEvent('swiperight', function(e){
                                  touchy.stop(e);
                                  }, slideElement);
      }
       
           
    },
    onExit:function(){
       app.scroller.enableAll();
    }
  };

});
/*document.addEventListener('presentationInit', function() {
  var firstSlideInit = true;
  var slide = app.slide.predefined = {
    elements: {
      sectionList: ["#sectionSelection li", "all"]
    },
    onEnter: function(ele) {
    	for (var i = 0; i < slide.element.sectionList.length; i++) {
    		app.addEvent('click', slide.enterSection, slide.element.sectionList[i]);
    	};

      if(firstSlideInit){
        firstSlideInit = false;
        app.addEvent('swipeleft', slide.disableSwipe, ele);
        app.addEvent('swiperight', slide.disableSwipe, ele);
      }
    },
    onExit: function(ele) {
      app.scroller.enableAll();
    },
    disableSwipe: function(e){
      touchy.stop(e);
    },
    enterSection: function(e){
        var footer = document.getElementById('mainfooter');
        util.removeClass(footer, 'hide');
    	touchy.stop(e);
    	var ele = e.target;
    	if (ele.nodeType === 3) {
        ele = ele.parentNode;
      }

      switch(ele.id) {
        case "full_pres":
          app.loader.show();
          app.load('play');
          utils.fastGoTo('play', 'home', 'starters_home');
          break;
        case "da_pres":
          app.slidePopup.show('da_popup');
          break;
        case "scene_pres":
          app.slidePopup.show('scenario_popup');
          break;
        case "my_pres":
          app.navigationToolbar.goTo("builder", "showplaylist", true);
          break;
      }
    }
  };
});*/

