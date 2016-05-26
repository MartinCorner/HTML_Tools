document.addEventListener('tabGroupOpen', function(e){
	var currentPerson = getElementParent(e.target, "article").querySelector('[data-group]').getAttribute('class'),
		currentSlide;
	if(currentPerson){
		currentSlide = document.querySelector("#" + currentPerson.split(" ")[0] + " .content.active");
		currentSlide.referenceList = false;
		app.referencePopup.setReferences(currentSlide);
	}
});