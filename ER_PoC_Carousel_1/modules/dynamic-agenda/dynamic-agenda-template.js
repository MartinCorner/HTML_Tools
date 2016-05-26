///Template for Xarelto presentation, DynamicAgenda
///Author Agnitio A/S
///2012-01
///
(function(){
	window.xareltoDynamicAgendaTemplate = function(config){
		delete app.dynamicChapters;
		this.dynamicContentMap = config.dynamicContentMap;
		this.dynamicAgenda = new DynamicAgenda("ACS New");
		this.order = 0;
		this.createMode = config.createMode;
		app.dynamicChapters = this.dynamicAgenda;
		this.version = "v1.1";

		if(this.createMode){
			this.dynamicContentMap = this.dynamicAgenda.current;
			this.dynamicAgenda.create();
		}

		// app.dynamicChapters.updateApp();
	};
})();
var slide;
xareltoDynamicAgendaTemplate.prototype = {

	addSections:function(divId, listAttr, section){
		var xDA = xareltoDynamicAgendaTemplate.prototype;
		var sections = "";
		var listitem = "";
		var list = document.createElement("ul");
		var chapterIsSaved = false;

		sections = app.collections.buildchapters.content;

		list.setAttribute(listAttr.id, listAttr.idValue);
		list.setAttribute(listAttr.className, listAttr.classValue);

		document.getElementById(divId).appendChild(list);

		for(var i = 0; i < sections.length; i++){
			listitem = document.createElement('li');
			listitem.innerHTML = app.json.structures[sections[i]].name;

			listitem.setAttribute('id', "list_" + sections[i]);
			listitem.sectioncode = sections[i];
			listitem.dynamicAgendaContentMap = this.dynamicContentMap;
			list.appendChild(listitem);

			if(section){
				for(var y = 0; y < section.sections.length; y++){
					var sectionName = section.sections[y].replace(section.name + "_", "");
					if(sections[i] == sectionName){
						chapterIsSaved = true;
					}
				}
			}

			if(!chapterIsSaved){
				listitem.addEventListener("click", xDA.sortarray, false);
			}
		}
	},
	sortarray:function(e){
		var dyAgenda = app.dynamicChapters,
			button = e.target,
			parent = button.parentNode,
			order = dyAgenda.data[dyAgenda.current].sections.length;
		touchy.stop(event);

		button.toggleClass("active");
		if(button.hasClass('active')){
			dyAgenda.addSection(button.sectioncode);
			parent.removeChild(button);
			parent.insertBefore(button, parent.childNodes[order]);
		}else{
			dyAgenda.removeSection(button.sectioncode);
			parent.appendChild(button);
			xareltoDynamicAgendaTemplate.order--;
		}
	},
	addSectionsWithSlides:function(elemId, newSectionAttr){
		var dyAg = this.dynamicAgenda;
		var sectionsChecked = [];
		var wrapper = "";
		var slides = [];
		var slideswrapper = document.getElementById("slidethumbs1");
		var slidelistitem;
		var checkvar = 'Checkbox';

		if(!dyAg){

			console.log("dynamicAgendaName is not mapped");
			return 0;
		}

		sectionsChecked = dyAg.getSections();

		if(sectionsChecked.length == 0){

			return -1;
		}
		wrapper = document.getElementById(elemId);
		wrapper.removeChild(wrapper.childNodes[0]);

		this.buildSectionSlides(sectionsChecked, slideswrapper, newSectionAttr, checkvar);

		$("#chapters").removeClass("unsorted");
		$("#chapters").addClass("sorted");
		$("#slidethumbs1").addClass("sorted");
		//new ScrollNavigationBuilder('#slidethumbs1', '#builder', 1024, 625);
		return 0;

	},
	buildSectionSlides:function(sectionsChecked, slideswrapper, newSectionAttr){

		var childSection;
		var dyAg = app.dynamicChapters;


		slideswrapper.style.height = "100%";
		for(var i = 0; i < sectionsChecked.length; i++){
			var idSection = sectionsChecked[i].split(dyAg.current + "_")[1];
			slides = app.json.structures[idSection];

			var newlist = document.createElement('ul');

			var separateWrapper = slideswrapper.appendChild(document.createElement("div"));
			separateWrapper.appendChild(newlist);
			/*TODO: remove firs unneeded list item*/

			var newLi = document.createElement('li');
			newlist.appendChild(newLi);

			var chapterTitle = document.createElement('h3');
			chapterTitle.setAttribute("id", "list_" + idSection);
			chapterTitle.setAttribute("class", newSectionAttr.className);
			chapterTitle.innerHTML = app.json.structures[idSection].name;
			separateWrapper.appendChild(chapterTitle);

			for(var j = 0; j < slides.content.length; j++){
				slidelistitem = document.createElement('li');
				slidelistitem.style.backgroundImage = 'url(content/img/thumbnails/' + slides.content[j] + '.png)';
				slidelistitem.slidethumb = slides.content[j];
				slidelistitem.setAttribute('id', slides.content[j] + '_slide');
				slidelistitem.setAttribute('class', 'slideitem');
				slidelistitem.slide = slides.content[j];
				slidelistitem.section = idSection;
				slidelistitem.clickstate = 0;
				slidelistitem.slidesorder = 0;
				slidelistitem.addEventListener("click", this.sortslidesarray, false);
				newlist.appendChild(slidelistitem);
			}
			if(slides.content.length > 4){
				var scrollWrapper = separateWrapper.appendChild(document.createElement('div'));
				scrollWrapper.className = "builder-scroll-wrapper";
				scrollWrapper.appendChild(newlist);
				var margin = 10;
				newlist.style.height = (newlist.children[1].offsetHeight + margin) * slides.content.length - 1 + margin + 'px';
				new iScroll(scrollWrapper, {
					bounce:false,
					hScrollbar:false,
					vScrollbar:false,
					momentum:true,
					desktopCompatibility:true,
					vScroll:true,
					hScroll:false
				})
			}
			else{
				separateWrapper.appendChild(newlist);
			}
		}
		app.slide[app.slideshow.current].builderScroller.refresh();
	},
	sortslidesarray:function(e){
		var dyAg = app.dynamicChapters,
			parent = e.target.parentNode,
			xDAT = xareltoDynamicAgendaTemplate.prototype,
			button = e.target,
			targetID = dyAg.current + "_" + button.section,
			index, newPlace, removeChild;

		button.toggleClass('active');
		if(button.hasClass('active')){
			dyAg.addSlide(button.section, button.slide);
			index = dyAg.data[dyAg.current].slides[targetID];
			newPlace = parent.childNodes[index.length];
			removeChild = xDAT.checkSortElements(button, index);
			if(removeChild){
				if(button !== newPlace){
					parent.removeChild(button);
					parent.insertBefore(button, newPlace);
				}
			}
		}else{
			dyAg.removeSlide(button.section, button.slide);
			parent.appendChild(button);
		}
	},
	checkSortElements:function(elem, checkedContainer){
		var removeChild = true,
			indexOfSildes = checkedContainer.length,
			listNode = elem.parentNode,
			checkFirstNode = listNode.childNodes[1].id == elem.id ? true : false,
			checkIfLastNode = elem.nextSibling == null && listNode.childNodes[listNode.childNodes.length - 1].id == elem.id ? true : false,
			checkIfSecondLast = elem.nextSibling != null && elem.nextSibling.nextSibling == null && indexOfSildes != 1 && (listNode.childNodes.length - 1) - indexOfSildes == 1 ? true : false,
			checkIfSecond = elem.id.replace("_slide", "") == checkedContainer[1] && listNode.childNodes[2].id == elem.id ? true : false;

		if(checkFirstNode || checkIfLastNode || checkIfSecondLast || checkIfSecond){
			if((checkIfLastNode) && (listNode.childElementCount - 1 > indexOfSildes)){
				return removeChild
			}
			else{
				removeChild = false;
			}
		}

		return removeChild
	},
	saveSectionSlides:function(presentationName){
		var dyAg = this.dynamicAgenda;
		this.checkSlides(true);
		dyAg.update(presentationName);
	},
	getSlidesChecked:function(){
		var xDA = xareltoDynamicAgendaTemplate.prototype,
			sildesAreChecked = false,
			editMode = true;

		sildesAreChecked = xDA.checkSlides(false, editMode);
		return sildesAreChecked;
	},
	playPresentation:function(section){
		var xDA = xareltoDynamicAgendaTemplate.prototype,
			dyAg = this.dynamicAgenda ? this.dynamicAgenda : app.dynamicChapters,
			sectionMap = dyAg.current ? dyAg.current : dyAg.mappedContent(section),
			res = xDA.buildMenuSection(sectionMap),
			popupSaveButton = document.getElementById("editbutton");

		if(popupSaveButton){
			popupSaveButton.removeEventListener(touchy.events.start, xDA.popupSaveButtonEvent, false);
		}

		if(res){
			// dyAg.updateApp();
			app.navigationToolbar.show();
			app.loader.show();
			app.load(sectionMap);

			while(window.mainmenu.childElementCount >= 2) {
				window.mainmenu.removeChild(window.mainmenu.firstChild);
			};

			utils.fastGoTo(sectionMap, 'home', 'starters_home');
		}
	},
	buildMenuSection:function(sectionID){
		app.menu.collections.add(sectionID);
		return true;
	},
	getSavedSections:function(divID){
		var slideshows = Object.keys(this.dynamicAgenda.contentMap);
		document.getElementById(divID).innerHTML = '';
		// if(!.children[0]){
		slideshows.forEach(function(name){
			var newlink = document.createElement('li'),
				div = document.createElement('div');
			newlink.addEventListener("click", this.openpage, false);
			div.className = 'overflow-li';
			div.innerText = name;
			newlink.appendChild(div);
			document.getElementById(divID).appendChild(newlink);
		}, this);
		// }
	},
	openpage:function(e){
		var buttonSelected = $("#showplaylist .buttonselected")[0],
			name = e.target.children[0].innerText;
		slide = app.slide.showplaylist;

		switch(buttonSelected.className.split(' ')[0]){
			case "play":
				xareltoDynamicAgendaTemplate.prototype.playPresentation(name);
				break;
			case "edit":
				xareltoDynamicAgendaTemplate.prototype.showEditMode(e.target);
				slide.scrollChapters = new iScroll(document.getElementById("chaptersEdit"), {momentum:false, vScroll:true, hScroll:false, hScrollbar:false, vScrollbar:false, bounce:false, desktopCompatibility:true});
				break;
			case "delete":
				xareltoDynamicAgendaTemplate.prototype.deletePresentation(name);
				e.target.parentNode.removeChild(e.target);
				break;
			default :
				return false;
		}
	},
	deletePresentation:function(name){
		var dyAg = app.dynamicChapters;
		dyAg.destroy(name);
	},
	showEditMode:function(elem){
		var dyAg = this.dynamicAgenda ? this.dynamicAgenda : app.dynamicChapters,
			xDA = xareltoDynamicAgendaTemplate.prototype,
			divId = elem.parentNode.parentNode,
			ulNode = elem.parentNode,
			listAttr = {
				"id":"id",
				"idValue":"chapterlist",
				"className":"class",
				"classValue":"chapterlist"
			},
			contentName = "",
			section = "";

		divId.removeChild(ulNode);
		divId.id = "chaptersEdit";

		$("#" + divId.id).removeClass("buttons");
		$("#" + divId.id).addClass("chapters");
		$("#" + divId.id).addClass("unsorted");
		slide.elements.title.innerText = elem.innerText;

		contentName = dyAg.mappedContent(elem.innerText);
		section = dyAg.data[contentName];
		dyAg.edit(elem.innerText);

		xDA.showEditPresentationMenu();
		xDA.initEditmode();
		xDA.addSections(divId.id, listAttr, section);

		for(var i = 0; i < section.sections.length; i++){
			var chapterName = section.sections[i].replace(contentName + "_", ""),
				docElem = document.getElementById("list_" + chapterName);
			xDA.lazySortarray(docElem);
		}
	},
	showEditPresentationMenu:function(){
		slide.elements.playbutton.innerHTML = "编辑";
		slide.elements.editbutton.innerHTML = "保存";
		slide.elements.editbutton.removeClass("buttonselected");
		slide.elements.deletebutton.innerHTML = "播放";

		slide.elements.playbutton.removeEventListener('click', app.slide.showplaylist.buttonSelect, false);
		slide.elements.editbutton.removeEventListener('click', app.slide.showplaylist.buttonSelect, false);
		slide.elements.deletebutton.removeEventListener('click', app.slide.showplaylist.buttonSelect, false);
	},
	initEditmode:function(){
		slide.elements.playbutton.removeEventListener('click', this.playPresentation, false);
		slide.elements.playbutton.addEventListener('click', this.editModeAddSlides, false);
		slide.elements.editbutton.addEventListener('click', this.popupSaveButtonEvent, false);
		slide.elements.deletebutton.addEventListener('click', this.playPresentation, false);

		slide.elements.editbutton.addClass("disabled");
		slide.elements.deletebutton.addClass("disabled");
	},
	editModeAddSlides:function(e){
		var xDA = xareltoDynamicAgendaTemplate.prototype,
			attr = {
				"id":"",
				"className":"chaptertitle"
			},
			slideswrapper = document.getElementById("slidethumbs"),
			dAg = app.dynamicChapters,
			contentName = dAg.contentMap[slide.elements.title.innerText],
			sections = dAg.data[contentName].sections,
			sectionsChecked = sections.length;
		if(sectionsChecked == 0){
			var errorstr = '请选择至少一个章节';
			xDA.showMessageDialog(errorstr);

		}
		else{
			document.getElementById("chaptersEdit").removeChild(document.getElementById("chapterlist"));

			xDA.buildSectionSlides(sections, slideswrapper, attr);

			$("#slidethumbs").addClass("sorted")
			slide.elements.playbutton.addClass("disabled");
			slide.elements.editbutton.removeClass("disabled");

			for(var i = 0; i < sectionsChecked; i++){
				var slides = dAg.data[contentName].slides[sections[i]],
					order = 0;

				if(slides){
					for(var y = 0; y < slides.length; y++){
						var elem = document.getElementById(slides[y] + "_slide");
						xDA.lazySortSlide(elem, y);
					}
				}
			}
		}
	},
	lazySortarray:function(elem){
		var pNode = elem.parentNode,
			xDA = xareltoDynamicAgendaTemplate.prototype,
			dAg = app.dynamicChapters,
			contentName = dAg.contentMap[$(".agendatitleH1").text()],
			sections = dAg.data[contentName].sections,
			order = null;

		for(i = 0; i < sections.length; i++){
			if(sections[i].indexOf(elem.sectioncode) != -1){
				order = i;
				break;
			}
		}

		$("#" + elem.id).addClass("active");

		pNode.removeChild(elem);
		pNode.insertBefore(elem, pNode.childNodes[order]);
	},
	lazySortSlide:function(elem, index){
		var pNode = elem.parentNode;
		var xDA = xareltoDynamicAgendaTemplate.prototype;
		var checkvar = 'Checkbox_flagged';

		$("#" + elem.id).addClass("active");

		pNode.removeChild(elem);
		pNode.insertBefore(elem, pNode.childNodes[index + 1]);
	},
	popupSaveButtonEvent:function(e){
		var xDA = xareltoDynamicAgendaTemplate.prototype,
			saveallbutton = slide.ele.getElementsByClassName("save")[0],
			cancelbutton = slide.ele.getElementsByClassName("cancel")[0];

		$(".savewindow").removeClass("hide");
		$(".savewindow").addClass("show");
		cancelbutton.addEventListener(touchy.events.start, xDA.cancleSave, false);
		saveallbutton.addEventListener(touchy.events.start, xDA.saveCustomPresentation, false);

	},
	saveSectionSlides:function(name){
		var xDA = xareltoDynamicAgendaTemplate.prototype;
		sildesAreChecked = xDA.checkSlides(false, false);

		app.dynamicChapters.update(name);
	},
	cancleSave:function(event){
		event.stopPropagation();
		$(".savewindow").removeClass("show");
	},
	saveCustomPresentation:function(e){
		var xDA = xareltoDynamicAgendaTemplate.prototype,
			dyA = app.dynamicChapters,
			slides = dyA.data[dyA.current].sections,
			checkedOk = false,
			slideName = dyA.data[dyA.current].name,
			emptySlides = xDA.checkSlides(true),
			data = dyA.data[dyA.current].sections, i;

		e.stopPropagation();

		slide.elements.editbutton.removeEventListener('click', this.editModeAddSlides, false);
		slide.elements.playbutton.addEventListener('click', xDA.playPresentation, false);

		$(".savewindow").removeClass("show");
		$(".savewindow").addClass("hide");

		dyA.update(slideName);

		slide.elements.editbutton.addClass("disabled");
		slide.elements.deletebutton.removeClass("disabled");
	},
	checkForEmptySections:function(){
		var dyA = app.dynamicChapters,
			slides = dyA.data[dyA.current];
	},
	checkSlides:function(sendList, editMode){
		var dyAg = app.dynamicChapters,
			slides = dyAg.data[dyAg.current].slides,
			sections = dyAg.data[dyAg.current].sections,
			noSlides = false,
			emptySlides = [],
			countSlides = 0;

		//Sections is the primary object for createing presentations, whith out sections you can not create new ones.
		//this statement gets all invalid object
		if(!editMode){
			for(var i = 0; i < sections.length; i++){

				//for (var name in slides) {
				if(slides[sections[i]]){
					if(slides[sections[i]].length > 0){
						noSlides = true;
					}
					else{
						emptySlides.push(sections[i]);
					}
				}else{
					emptySlides.push(sections[i]);
				}
			}
		}
		//This statment removes all objects that is not valid.
		for(var x = 0; x < emptySlides.length; x++){
			delete slides[emptySlides[x]];

			var order = sections.indexOf(emptySlides[x]);

			if(order !== -1){
				sections.splice(order, 1);
			}

		}

		///this check is only for handeling come marked slides
		if(!sendList){
			//In buildMode/createMode the sections is not yet, extra check.
			if(!noSlides){
				for(name in slides){
					if(slides[name].length > 0){
						noSlides = true;
					}
				}
			}
			return noSlides;
		}
		else{
			return emptySlides;
		}
	},
	showMessageDialog:function(errorstr){
		var xDA = xareltoDynamicAgendaTemplate.prototype;
		$('.errorwindow')[0].addEventListener(touchy.events.start, xDA.closeerror, false);
		$(".errorwindow").addClass('show');
		$('.errordialog').html('<h1>' + errorstr + '</h1>');
	},
	closeerror:function(){
		$(".errorwindow").removeClass('show');
		$('.errordialog').html('');
	}
}