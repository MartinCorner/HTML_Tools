document.addEventListener('presentationInit', function() {
	var addbutton, returnbutton, popupSaveButton,
		playbutton, errorwindow, savewindow, overwriteWindow, cancelbutton, overwriteButton, savebutton, saveNameInput,
		agendTitle = '',
		slide = app.slide.builder = {
			dynamicTemplate: null,
			onEnter: function(ele){
				this.init(ele);
				/*$("#builder .agendatitle").html("<h1 data-ag-editable='header'>Build New Presentation</h1>");*/
				setTimeout(function(){
					slide.scroll.refresh();
				}, 0);
			},
			onExit: function(){},
			init: function (ele){
				var listAttr = {
					"id":"id",
					"idValue":"chapterlist",
					"className":"class",
					"classValue":"chapterlist unsorted"
				}, that = this;

				agendTitle = ele.getElementsByClassName('agendatitle')[0];
				agendTitle.removeClass('hide');
				if (!ele.isInit){
					errorwindow = slide.ele.getElementsByClassName("errorwindow")[0];
					savewindow = slide.ele.getElementsByClassName("savewindow")[0];
					overwriteWindow = slide.ele.getElementsByClassName("overwrite-window")[0];
					addbutton = ele.getElementsByClassName("addslides")[0];
					returnbutton = ele.getElementsByClassName("home")[0];
					savebutton =  ele.getElementsByClassName("save")[0];
					overwriteButton =  ele.getElementsByClassName("overwrite")[0];
					popupSaveButton = ele.getElementsByClassName("saveall")[0];
					cancelbutton = ele.getElementsByClassName("cancelsave");
					playbutton = ele.getElementsByClassName("play")[0];
					saveNameInput = ele.getElementsByClassName("title")[0];

					addbutton.addEventListener('click', this.addslides, false);
					returnbutton.addEventListener('click', this.returnToHome, false);
					popupSaveButton.addEventListener('click', this.popupSaveButtonEvent, false);
					cancelbutton.forEach(function(button){
						button.addEventListener(touchy.events.start, that.cancleSave, false);
					});
					playbutton.addEventListener('click', this.playPresentation, false);
					overwriteButton.addEventListener(touchy.events.start, this.savePresentation, false);

					this.builderScroller = new ScrollNavigationBuilder(ele);
					ele.isInit = true;
				}

				savewindow.removeClass('show');
				overwriteWindow.removeClass('show');
				errorwindow.removeClass('show');

				$("#slidethumbs1").html("");
				$("#chapters").html("");
				app.slideshow.scroller.disableAll();

				addbutton.removeClass("disabled");
				savebutton.addClass("disabled");
				playbutton.addClass("disabled");


				slide.dynamicTemplate = new xareltoDynamicAgendaTemplate({
					dynamicContentMap : null,
					createMode: true
				});

				this.dynamicTemplate.addSections("chapters", listAttr);
				slide.scroll = new iScroll("chapters", {checkDOMChanges: true, momentum:false, vScroll:true, hScroll:false, hScrollbar:false, vScrollbar:false, bounce:false, desktopCompatibility:true});
			},
			addslides: function(e){
				var attr = {
						"id": "",
						"className": "chaptertitle"
					},
					res = slide.dynamicTemplate.addSectionsWithSlides("chapters", attr);


				if(res == 0){
					agendTitle.addClass('hide');
					$("."+e.target.className).addClass("disabled");
					savebutton.removeClass("disabled");
					savebutton.addEventListener('click', slide.saveCustomPresentation, false);
					//slide.builderScroller.refresh();
					var params = app.analytics.getParams(slide.ele.id);
					params.name = "Add Slides";
					params.id = params.name.replace(/ /g, "_");
					app.analytics.save(params);
				}
				else {
					errorstr = '请选择至少一个章节';
					slide.showMessageDialog(errorstr);
				}
			},
			saveCustomPresentation: function(e){
				if(!slide.dynamicTemplate.getSlidesChecked())
				{
					errorstr = '请选择至少一个页面';
					slide.showMessageDialog(errorstr);
				}else{
					saveNameInput.value = "";
					savewindow.removeClass("hide");
					savewindow.addClass("show");
					saveNameInput.focus();
				}
			},
			returnToHome: function(e){
				app.navigationToolbar.goTo("builder", "start_index", true);
			},
			popupSaveButtonEvent: function(e){
				var presId = saveNameInput.value,
					data = slide.dynamicTemplate.dynamicAgenda.data, i, errorName = false;
				e.stopPropagation();
				saveNameInput.blur();

				if(presId){
					for(i in data){
						if(data[i].name === presId){
							errorName = true;
							break;
						}
					}
					if(!errorName){
						slide.dynamicTemplate.saveSectionSlides(presId);

						savedPresentation(presId);

						savewindow.removeClass("show");
						playbutton.removeClass("disabled");
						savebutton.addClass("disabled");
					}else{
						overwriteWindow.removeClass('hide');
						overwriteWindow.addClass('show');
					}
				}
			},
			cancleSave: function(){
				var popup = this.parentNode.parentNode;
				saveNameInput.blur();
				popup.removeClass('show');
				saveNameInput.focus();
			},
			playPresentation:function(e){
				var dyAg = slide.dynamicTemplate.dynamicAgenda,
					section = dyAg.data[dyAg.current].name;

				slide.dynamicTemplate.playPresentation(section);
			},
			showMessageDialog: function(errorstr){
				errorwindow.addEventListener(touchy.events.start, this.closeerror, false);
				errorwindow.addClass('show');
				errorwindow.children[0].innerHTML = '<h1>'+errorstr+'</h1>';
			},
			closeerror: function() {
				errorwindow.removeClass('show');
				errorwindow.childNodes[0].innerHTML = '';
			},
			savePresentation: function(event){
				var presId =  saveNameInput.value;
				touchy.stop(event);
				saveNameInput.blur();
				if(presId){
					savedPresentation(presId);

					slide.dynamicTemplate.saveSectionSlides(presId);
					savewindow.removeClass("show");
					overwriteWindow.removeClass('show');
					playbutton.removeClass("disabled");
					savebutton.addClass("disabled");
				}
			}
		};

	function savedPresentation(name){
		var monitoringBuilder = {
			"unique": true,
			"category": "Builder Save presentation",
			"categoryId": "Builder_Save_presentation",
			"valueType": "true/false",
			"value": true,
			"valueId": "Builder_Save_presentation_button_tapped",
			"label": "Builder Save presentation button",
			"labelId": "Builder_Save_presentation_button"
		};

		ag.submit.event(monitoringBuilder);

		monitoringBuilder["valueType"] = "text";
		monitoringBuilder["value"] = name;
		monitoringBuilder["label"] = "Builder save presentation name";
		monitoringBuilder["labelId"] = "Builder_save_presentation_name";

		ag.submit.event(monitoringBuilder);
	}
});