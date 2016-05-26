(function(global){
	"use strict";
	function ReferencePopup(options){
		var that = this, i;
		this.isSetReference = false;
		this.scroll = {};

		this.options = {
			isPopupHasOwnRefList:true,
			attributeFile:"data-pdf",
			attributeReferenceNumbers:"data-ag-references",
			attributeIgnoreReference:"data-ignore-references",
			dataSrc:"sup",
			referencesNumberList:"#references2 ul li span",
			classReferenceButton:"logo"
		};

		for(i in options){
			this.options[i] = options[i];
		}

		document.addEventListener("collectionLoad", function(){
			if(that.options.referencesNumberList.length > 0){
				that.referencesList = document.querySelectorAll(that.options.referencesNumberList).reduce(function(sum, el){
					sum[parseInt(el.innerText)] = el.parentNode;
					return sum;
				}, {});
			}
		});

		this.popupWrapper = document.getElementById("popup-wrapper");
		this.referencePopup = this.popupWrapper.getElementsByClassName("reference-popup")[0];
		this.referenceListWrapper = this.referencePopup.getElementsByClassName("reference-list-wrapper")[0];
		this.closeButton = this.referencePopup.getElementsByClassName("close-button")[0];
		this.scrollIndicator=this.referencePopup.getElementsByClassName("scroll-indicator")[0];

		this.init();
	}

	ReferencePopup.prototype.getSlideReference = function(slideElement){
		var that = this;
		if(!slideElement.referenceList){
			slideElement.referenceList = [];
			if(slideElement.hasAttribute(that.options.attributeReferenceNumbers)){
				var dataAgReferences, referencesArray;
				dataAgReferences = slideElement.getAttribute(that.options.attributeReferenceNumbers);
				referencesArray = (dataAgReferences.trim().length > 0) ? dataAgReferences.split(',') : [];
				for(var i = 0; i < referencesArray.length; i++){
					if(slideElement.referenceList.indexOf(referencesArray[i]) === -1){
						slideElement.referenceList.push(referencesArray[i]);
					}
				}
			}
			else {
				var slideSupTexts = slideElement.getElementsByTagName(that.options.dataSrc).map(function(el){
					return el.innerText;
				}, '');
				for(var i = 0; i < slideSupTexts.length; i++){
					var supList = slideSupTexts[i].match(/\d+/g);
					if(supList){
						for(var j = 0; j < supList.length; j++){
							if(slideElement.referenceList.indexOf(supList[j]) === -1){
								slideElement.referenceList.push(supList[j]);
							}
						}
					}
				}
				slideElement.referenceList = slideElement.referenceList.sort(function(a, b){
					return a - b;
				});
			}
		}
		return slideElement.referenceList;
	};

	ReferencePopup.prototype.init = function(){
		var that = this,
			eventsName = this.options.isPopupHasOwnRefList ? ["slideEnter", "slideExit", "slidePopupEnter", "slidePopupExit"] : ["slideEnter", "slideExit"];
		eventsName.forEach(function(event){
			document.addEventListener(event, function(e){
				var slideElement = event === "slidePopupEnter" ? e.target : document.getElementById(app.currentSlide),
					isIgnore = false;
				if(event === "slidePopupExit" && e.target.hasAttribute(that.options.attributeIgnoreReference)){
					isIgnore = true;
				}
				if(!isIgnore && !slideElement.hasAttribute(that.options.attributeIgnoreReference)){
					that.setReferences(that.getSlideReference(slideElement));
				}
			});
		});
		this.closeButton.addEventListener('click', function(event){
			touchy.stop(event);
			that.toggleReferencesPopup(false);
		});
		document.getElementsByClassName(this.options.classReferenceButton).forEach(function(button){
			button.addEventListener("click", function(event){
				touchy.stop(event);
				that.toggleReferencesPopup(true);
			});
		});
	};
	ReferencePopup.prototype.setReferences = function(arrayOrElement){
		var that = this, list = document.createElement("ul"), arrayNumbers;
		if(arrayOrElement instanceof Array){
			arrayNumbers = arrayOrElement;
		} else {
			arrayNumbers = this.getSlideReference(arrayOrElement);
		}
		utils.removeChildren(this.referenceListWrapper);
		if(arrayNumbers.length > 0){
			arrayNumbers.forEach(function(num){
				var a = that.referencesList[num], link, pdf;
				if(a){
					link = document.createElement("li");
					link.appendChild(a);
					pdf = a.getAttribute(that.options.attributeFile);
					if(pdf){
						link.addEventListener('click', function(){
							//ag.openPDF('content/pdf/' + pdf, pdf);
						});
					}
					list.appendChild(link);
				}
			});
			this.referenceListWrapper.appendChild(list);
			//by linlic begin
			var scrollIndicator = this.scrollIndicator;
			this.scroller = new iScroll(this.referenceListWrapper, {
				hScrollbar:false, 
				vScrollbar:false, 
				desktopCompatibility:true, 
				bounce:false,
				onScrollMove:function(){
	                switch(this.y){
	                    case 0:
	                        scrollIndicator.removeClass("scrolled");
	                        break;
	                    case this.maxScrollY:
	                        scrollIndicator.removeClass("scrolled");
	                        scrollIndicator.addClass("end-scrolled");
	                        break;
	                    default :
	                        scrollIndicator.addClass("scrolled");
	                        scrollIndicator.removeClass("end-scrolled");
	                }
	            },
	            onScrollEnd:function(){
	                switch(this.y){
	                    case 0:
	                        scrollIndicator.removeClass("scrolled");
	                        break;
	                    case this.maxScrollY:
	                        scrollIndicator.removeClass("scrolled");
	                        scrollIndicator.addClass("end-scrolled");
	                        break;
	               	}
            	}
			});
			//by linlic end
			this.isSetReference = true;
		} else {
			this.isSetReference = false;
		}
	};
	ReferencePopup.prototype.toggleReferencesPopup = function(isShow){
		if(isShow && this.isSetReference){
			this.popupWrapper.addClass("show");
			this.referencePopup.addClass("show");
			this.scroller.refresh();
		} else {
			this.popupWrapper.removeClass("show");
			this.referencePopup.removeClass("show");
		}
	};
	global.ReferencePopup = ReferencePopup;
})(window);