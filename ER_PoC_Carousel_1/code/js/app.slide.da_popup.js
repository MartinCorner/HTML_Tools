document.addEventListener('presentationInit', function() {
  var slide = app.slide.da_popup = {
    elements: {
      daList: "#daSelection"
    },
    onEnter: function(ele) {
      var sectionList = '';

    /*  for(obj in app.json.structures){
        if(app.json.structures[obj].custom === 'da'){
          slide.element.daList.innerHTML += '<li id="'+app.json.structures[obj].id+'">'+app.json.structures[obj].name+'</li>';
        }
      }*/

      sectionList = ele.querySelectorAll("#daSelection li");
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