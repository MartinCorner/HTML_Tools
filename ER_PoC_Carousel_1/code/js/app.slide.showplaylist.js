document.addEventListener('presentationInit', function () {
	var returnbutton, popupSaveButton, playbutton,
		slide = app.slide.showplaylist = {
		list: null,
		dynamicTemplate:null,
		elements:{},
		onEnter:function (ele) {
			this.init(ele);
			setTimeout(function(){
				new iScroll(document.getElementById("list_wrapper"), {momentum:false, vScroll:true, hScroll:false, hScrollbar:false, vScrollbar:false, bounce:false, desktopCompatibility:true});
				if(slide.scrollChapters){
					slide.scrollChapters.refresh();
				}
			}, 10);
		},
		//onExit is a FrameWork method used when exit slide.
		onExit:function (){},
		init:function (ele) {
			var list = document.getElementById('list'),
				listWrapper,
				curOffset = 0;
		
			if(!ele.isInit){
				returnbutton = ele.getElementsByClassName("home")[0];
				playbutton = ele.getElementsByClassName("play")[0];
				editbutton = ele.getElementsByClassName("edit")[0];
				deletebutton = ele.getElementsByClassName("delete")[0];
				title = ele.getElementsByClassName("agendatitleH1")[0];


				this.elements = {
					playbutton: playbutton,
					editbutton: editbutton,
					deletebutton: deletebutton,
					title: title
				};

				this.builderScroller = new ScrollNavigationBuilder(ele);
				ele.isInit = true;
			}
			app.slideshow.scroller.disableAll();
			if(!list){
				var agendascroller = slide.ele.getElementsByClassName('agendascroller')[0]; 
				listWrapper = util.createElement("div", {"id": "list_wrapper", "class": "list_wrapper"});
				list = util.createElement("ul", {"id": "list", "class": "list agenda1"});
				listWrapper.appendChild(list);
				agendascroller.appendChild(listWrapper);

				var chaptersEdit = document.getElementById('chaptersEdit');
				if (chaptersEdit){
					agendascroller.removeChild(chaptersEdit);
				} 

				
				document.getElementById('slidethumbs').innerHTML = '';
				playbutton.innerHTML = "播放";
				editbutton.innerHTML = "编辑";
				deletebutton.innerHTML = "删除";

				playbutton.removeEventListener('click', this.dynamicTemplate.editModeAddSlides, false);
				editbutton.removeEventListener('click', this.dynamicTemplate.popupSaveButtonEvent, false);
				deletebutton.removeEventListener('click', this.dynamicTemplate.playPresentation, false);
			}

			ele.querySelectorAll('.savewindow, .errorwindow').forEach(function(popup){
				popup.removeClass('show');
			});

			returnbutton.addEventListener('click', this.returnToHome, false);
			playbutton.addEventListener('click', this.buttonSelect, false);
			editbutton.addEventListener('click', this.buttonSelect, false);
			deletebutton.addEventListener('click', this.buttonSelect, false);

			$('#showplaylist .disabled').removeClass('disabled');
			$('#showplaylist .buttonselected').removeClass('buttonselected');
			playbutton.addClass("buttonselected");
			//title.innerText = "My Presentations";
			
			this.dynamicTemplate = new xareltoDynamicAgendaTemplate({
				dynamicContentMap:null,
				createMode:false
			});

			//this.dynamicTemplate.dynamicAgenda.updateApp();
			this.dynamicTemplate.getSavedSections("list");

			//new ScrollNavigationBuilder('#slidethumbs', '#showplaylist', 1024, 625);
		},
		returnToHome:function (e) {
			xareltoDynamicAgendaTemplate.dynamicAgendaName = {};
			app.navigationToolbar.goTo("builder", "start_index", true);
		},
		buttonSelect:function (e) {
			var header = "";
			touchy.stop(e);

			$("#showplaylist nav button").removeClass("buttonselected");

			//Add the class so color can change.
			switch (e.target.className) {
				case "play":
					header = "我的多媒体资料";
					break;
				case "edit":
					header = "编辑多媒体资料";
					break;
				case "delete":
					header = "删除多媒体资料";
					break;
				default:
					break;
			}

			e.target.addClass("buttonselected");
			title.innerText = header;
		}
	}
});
