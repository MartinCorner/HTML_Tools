document.addEventListener('presentationInit', function() {
  var slide = app.slide.scenario_popup = {
    elements: {
      scenarioList: "#scenarioSelection"
    },
    onEnter: function(ele) {
      var sectionList = '';

 /*     for(obj in app.json.structures){
        if(app.json.structures[obj].custom === 'scenario'){
          slide.element.scenarioList.innerHTML += '<li id="'+app.json.structures[obj].id+'">'+app.json.structures[obj].name+'</li>';
        }
      }*/

      sectionList = ele.querySelectorAll("#scenarioSelection li");
    	for (var i = 0; i < sectionList.length; i++) {
    		app.addEvent('click', slide.loadPresentation, sectionList[i]);
    	};
    },
    onExit: function(ele) {
    },
    loadPresentation: function(e){
    	touchy.stop(e);
    	var ele = e.target;
    	if (ele.nodeType === 3) {
        ele = ele.parentNode;
      }
      app.loader.show();
      utils.fastGoTo(ele.id, 'home', 'starters_home');
    }
  };
});