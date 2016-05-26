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
        app.add(id, slideshows[id].slides);
      }
    },
    // Create a map between content name and index in array
    mapContent: function() {
      for (id in this.data) {
        this.contentMap[this.data[id].name] = id;
      };
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
    get: function(name) {
      var slideshow = this.contentMap[name];
      if (slideshow) {
        return this.data[slideshow];
      }
      else {
        throw new Error('Dynamic Agenda slideshow with name "' + name + '" does not exist');
      }
    },
    getSlides: function (name) {
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
            type: "slideshow",
            slides: []
          };
      this.current = id;
      data[id] = obj;
      this.editMode = false;
      this.hasChanged = false;
    },
    // Add slide to temporary object
    add: function(name, order) {
      var current = this.data[this.current],
          i = order ? (order - 1) : current.slides.length;
      // Make sure we don't add a slide twice
      if (current.slides.indexOf(name) === -1) {
        current.slides.splice(i, 0, name);
      }
      // Move it if already in agenda
      else {
        this.remove(name);
        this.add(name, order);
      }
      this.hasChanged = true;
    },
    // Remove slide in temporary object
    remove: function(name) {
      var current = this.data[this.current],
          order = current.slides.indexOf(name);
      if (order !== -1) {
        current.slides.splice(order, 1);
      }
      this.hasChanged = true;
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
      var id = this.contentMap[name];
      if (id) {
        delete this.data[id];
        delete this.contentMap[name];
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
        app.add(id, obj.slides);
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
    }
  };
})();
