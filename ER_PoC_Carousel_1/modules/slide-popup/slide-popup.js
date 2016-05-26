/* AGNITIO MODULE:  SlidePopup
 * A module that will show and hide a slide on top of current slideshow
 * */
(function() {
  // Custom events for the Slide popup module
  window.slidePopupLoad = document.createEvent('UIEvents');
  window.slidePopupUnload = document.createEvent('UIEvents');
  window.slidePopupEnter= document.createEvent('UIEvents');
  window.slidePopupExit= document.createEvent('UIEvents');
  slidePopupLoad.initEvent('slidePopupLoad', true, false);
  slidePopupUnload.initEvent('slidePopupUnload', true, false);
  slidePopupEnter.initEvent('slidePopupEnter', true, false);
  slidePopupExit.initEvent('slidePopupExit', true, false);

  var d = document;

  window.SlidePopup = function(id, backButtonId) {
    var that=this;
    this.version = '1.2';
    this.id = id;
    this.ele = app.elements.popup = d.getElementById(id);
    this.backButton = document.getElementById(backButtonId);
    this.markup = '';
    this.isVisible = false;
    document.addEventListener("sectionEnter",function(){that.hide();});
  };

  SlidePopup.prototype = {
    show: function(slide) {
      var self = this;
      var markup;

      // If changing content without hiding, call onExit for previous slide
      if (this.isVisible) {
        if (app.slide[this.slide]) {
          app.slide[this.slide].onExit(this.slideEle);
        }
      }

      this.isVisible = true;

      // Close the popup if jumping to another slideshow/collection
      document.addEventListener('contentUnload', function(e) {
        self.hide();
        document.removeEventListener('contentUnload', arguments.callee);
      });

      this.slide = slide;
      this.slideEle;
      // Make sure the slide is not already part of active slideshow
      if (app.slideshow.content.indexOf(slide) === -1) {
        app.getHtml(slide, app.pathToSlides, function(data) { markup = data; });
        this.ele.innerHTML = markup;
        this.slideEle = this.ele.querySelector('.slide');
        util.addClass(this.ele, 'displaying');
        this.slideEle.dispatchEvent(slidePopupLoad);

        if (app.slide[slide]) {
          app.getSlideElements(slide, this.slideEle);
          this.slideEle.dispatchEvent(slideEnter);
          app.slide[slide].onEnter(this.slideEle);
        }
        if (app.scroller) {
            app.scroller.disableAll();
        }
          if(this.backButton){
              this.backButton.style.visibility = 'visible';
              this.backButton.addEventListener('tap', function(e) {
                  self.hide(slide);
                  self.backButton.removeEventListener('tap', arguments.callee);
              });
          }
              self.slideEle.dispatchEvent(slidePopupEnter);
      }
      else {
        console.log('Content is already part of slideshow');
      }
    },
    hide: function() {
      var self = this;
      if (this.isVisible) {
        this.isVisible = false;
        util.removeClass(this.ele, 'displaying');
        if(this.backButton) this.backButton.style.visibility = 'hidden';
        
        if (app.slide[self.slide]) {
          self.slideEle.dispatchEvent(slideExit);
          app.slide[self.slide].onExit(self.slideEle);
          app.removeEvents(self.slide);
          app.removeElements(self.slide);
        }

        setTimeout(function() {
          self.ele.innerHTML = '';
          if (app.scroller) {
            app.scroller.enableAll();
          }
        }, 1000);
        
        this.slideEle.dispatchEvent(slidePopupUnload);
        this.slideEle.dispatchEvent(slidePopupExit);
      }
    }
  };
})();
