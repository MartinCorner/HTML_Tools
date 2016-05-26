/* AGNITIO FRAMEWORK MODULE: Dynamic Agenda
 * This module will save and retrieve slideshows created
 * inside a presentation. Will not create collections.
 * @author Stefan Liden sli@agnitio.com
 */
(function() {
  window.DynamicAgenda = function(name) {
    // TODO: generate error if name is not supplied
    this.name = name;
    this.version = 'v1.0';
    this.contentMap = {};
    this.data = null;
    this.temp = null;
    this.editMode = false;
    this.hasChanged = false;
    this.store = localStorage.getItem('DynamicAgenda: ' + this.name); 
    this.init();
  };
  DynamicAgenda.prototype = {
    // Check for existing data, else create new object
    init: function() {
      if (!this.store) {
        this.data = {};
      }
      else {
        this.data = JSON.parse(this.store);
        this.mapContent();
        this.updateApp();
      }
    },
    /* === MODEL === */
    updateApp: function() {
      var slideshows = this.data;
      for (id in slideshows) {
        this.updateAppContent(id);
      }
    },
    // Create a map between content name and index in array
    mapContent: function() {
      for (id in this.data) {
        this.contentMap[this.data[id].name] = id;
      };
    },
    mappedContent:function(name){
      for(var i in this.contentMap){
        if(i.toLowerCase() === name.toLowerCase()){
          return this.contentMap[i];
        }
      }
    },
    // Update the localStorage value
    save: function() {
      var data = JSON.stringify(this.data);
      localStorage.setItem('DynamicAgenda: ' + this.name, data);
    },
    // Remove localStorage data
    clear: function() {
      localStorage.removeItem('DynamicAgenda: ' + this.name);
    },
    getSections: function(name) {
      
      //if name is not assigned we return by default the current else try the specific sections.
      var slideshow = typeof(name)? this.current : this.contentMap[name];
      
      if (slideshow) {
        return this.data[slideshow].sections;
      }
      else {
        throw new Error('Dynamic Agenda Sections with name "' + name + '" does not exist');
      }
    },
    getSingleSlide: function (name) {
      var slideshow = this.contentMap[name];
      if (slideshow) {
        return this.data[slideshow].slides;
      }
      else {
        throw new Error('Dynamic Agenda slideshow with name "' + name + '" does not exist');
      }
    },

    /* === CONTROLLER === */
    // Create new Dynamic Agenda temporary object
    create: function() {
      var now = new Date().getTime(),
          data = this.data,
          id = 'DA_' + now,
          obj = {
            name: "Not saved",
            type: "collection",
            sections: [],
            slides: {} //section: [slides]//
          };
      this.current = id;
      data[id] = obj;
      this.editMode = false;
      this.hasChanged = false;
    },
    // Add chapter to temporary object
    addSection: function(chapter, order) {
      var current = this.data[this.current],
          i = order ? (order - 1) : current.sections.length;
      var newChapter = this.current + "_" + chapter; 
      // Make sure we don't add a slide twice
      if (current.sections.indexOf(newChapter) === -1) {
        current.sections.splice(i, 0, newChapter);
      }
      // Move it if already in agenda
      else {
        this.removeSection(chapter);
        this.addSection(chapter, order);
      }
      this.hasChanged = true;
    },
    // Add slide to temporary object
    addSlide: function(chapter, slideName, order) {
    
      if(!typeof(chapter)){
         throw new Error('Dynamic Agenda addSlide(): chapter is null');
      }
      if(!typeof(slide)){
         throw new Error('Dynamic Agenda addSlide(): slideName is null');
      }
      var newChapter = this.current + "_" + chapter; 
      var newSlideName = this.current + "_" + slideName; 
      var current = this.data[this.current];
      var slidesInChapters = [];
      
      if(typeof(current.slides[newChapter]) )
      {
        if(current.slides[newChapter]){
        
        }
        else {
          current.slides[newChapter] = [];
          
        }   
      }
      
      slidesInChapters = current.slides[newChapter];
      var i = order ? (order - 1) : slidesInChapters.length;
          
          if (slidesInChapters.indexOf(slideName) === -1) {
            slidesInChapters.splice(i, 0, slideName);
          }
          // Move it if already in agenda
          else {
            this.removeSlide(chapter,slideName);
            this.addSlide(slideName, order);
          }
          this.hasChanged = true;
      
    },
    // Remove slide in temporary object
    removeSection: function(name) {
      // TODO: REMOVE SLIDES ARRAY AS WELL
      var newChapter = this.current + "_" + name;    
      var current = this.data[this.current],
          order = current.sections.indexOf(newChapter);
      
      if (order !== -1) {
        current.sections.splice(order, 1);
      }
      this.hasChanged = true;
    },
    removeSlide: function(section, slideName) {
      var current = this.data[this.current];
      var newChapter = this.current + "_" + section; 
      var newSlideName = this.current + "_" + slideName; 
        //order = current.slides.indexOf(slideName);
      var slidesInChapters = current.slides[newChapter];
      order = slidesInChapters.indexOf(slideName);
      
        if(order !== -1)
        {
          slidesInChapters.splice(order,1);
        }
        this.chasChanged = true;
    },
    // Add or remove slide
    toggle: function(name) {
      var current = this.data[this.current],
          index = current.slides.indexOf(name);
      if (index !== -1) {
        current.slides.splice(index, 1);
      }
      else {
        current.slides.push(name);
      }
      this.hasChanged = true;
    },
    // Open an existing slideshow/collection for editing
    edit: function(name) {
      this.current = this.contentMap[name];
      this.editMode = true;
      this.hasChanged = false;
    },
    destroy: function(name) {
      var id = this.mappedContent(name);
      if (id) {
        delete this.data[id];
        delete this.mappedContent(name);
        this.save();
      }
    },
    // When closing Dynamic agenda without saving we need to reset
    reset: function() {
      var name = this.data[this.current].name;
      console.log(name);
      if (name === 'Not saved') {
        delete this.data[this.current];
      }
      this.current = null;
      this.editMode = false;
      this.hasChanged = false;
    },
    // Save to the data object
    // Will add content to this.data and localStorage
    // Will add content to app (for loading)
    update: function(name) {
      if (!this.current) { return; }
      var now = new Date().getTime(),
          id = this.current,
          slideshow = app.slideshows[id],
          collection = app.collections[id],
          obj = this.data[id];
      if (name) {
        obj.name = name;
        this.contentMap[name] = id;
      }
      else if (!this.editMode) {
        throw new Error('No name given');
        return;
      }
      // Make sure to update the content of an existing slideshow
      if (slideshow) {
        slideshow.content = obj.slides;
        
      }
      else {
        
          var customSection = app.sections.defaultbuildchapters.concat(obj.sections);       
          app.add(id, customSection,"collection");
        
          for (var name in obj.slides) {
             var slide = obj.slides[name];
            app.add(name, slide);       
           }
        
        
      }
      this.editMode = true;
      this.hasChanged = false;
      this.save();
    },
    
    /* === VIEW === */
    // Load a slideshow from the Dynamic Agenda
    show: function(name) {
      var ss = this.contentMap[name];
      if (ss) {
        app.load(ss);
      }
    },
    // Build a HTML list with custom presentations
    // Will insert data-slideshow attribute with name of slideshow
    list: function() {
      var slideshows = Object.keys(this.contentMap);
      var markup = '<ul class="DA-list">';
      
      // Create the markup for existing custom slideshows
      slideshows.forEach(function(name) {
        markup += '<li data-slideshow="' + name + '">' + name + '</li>';
      });
      markup += '</ul>';
      return markup;
    },
    updateAppContent: function(name)
    {
//      var id = this.contentMap[name];
//      
//      if(!id)
//        return false;
        
      var obj = this.data[name];
      //obj.name = name;
      
      
      var customSection = app.sections.defaultbuildchapters.concat(obj.sections);       
        app.add(id, customSection,"collection");
      
        for (var name in obj.slides) {
           var slide = obj.slides[name];
          app.add(name, slide);       
         }
      
      
    }
    
  };
})();
