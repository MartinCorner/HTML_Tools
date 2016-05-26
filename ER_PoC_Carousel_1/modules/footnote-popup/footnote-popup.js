/**
 * @author: Sergey Tkalych sergey.tkalych@qa-power.com
 */

(function(global){
	"use strict";
	function FootnotePopup(){
		var self = this,
			footnotePopupList,
			clearFootnote = function(){
				self.popup.innerHTML = '';
				util.removeClass(self.popup, "multi");
			};

		this.popupWrapper = document.getElementById('popup-wrapper');
		this.popup = this.popupWrapper.querySelector('.footnote-popup');

		this.popup.addEventListener(touchy.events.start, function(event){
			touchy.stop(event);
			self.close();
		});
		this.openPopup = function(event){
			touchy.stop(event);
			self.popup.innerHTML = footnotePopupList.innerHTML;
			self.open();
		};
		this.setEvents = function(eventTarget){
			eventTarget.removeEventListener(touchy.events.start, this.openPopup);
			eventTarget.addEventListener(touchy.events.start, this.openPopup);
		};

		document.addEventListener('slideEnter', function(e){
			var button;
			footnotePopupList = e.target.querySelector('.footnote');
			clearFootnote();
			if(footnotePopupList){
				if(footnotePopupList.getElementsByClassName("active").length){
					util.addClass(self.popup, "multi");
				}
				//self.popup.innerHTML = footnotePopupList.innerHTML;
				if(util.hasClass(footnotePopupList, "with-button")){
					button = e.target.getElementsByClassName("foot-button")[0];
					if(!button){
						button = document.createElement("div");
						button.className = "foot-button";
						button.innerText = "Footnote";
						e.target.appendChild(button);
					}
					self.setEvents(button);
				}else{
					self.setEvents(footnotePopupList);
				}
			}
		});
	}

	FootnotePopup.prototype.open = function(){
		util.addClass(this.popupWrapper, 'show');
		util.addClass(this.popup, 'show');
	};
	FootnotePopup.prototype.close = function(){
		util.removeClass(this.popupWrapper, 'show');
		util.removeClass(this.popup, 'show');
	};
	global.FootnotePopup = FootnotePopup;
})(window);