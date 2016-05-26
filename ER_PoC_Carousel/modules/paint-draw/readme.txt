What you need to do before using paint-draw

in index.html add
	script:
 			<script src="modules/paint-draw/overlay.js"></script>
 
 	HTML TAG:
 				<div id="overlay1" class="thumbsOverlay overlay1"></div>
 				<div id="overlay2" class="thumbsOverlay overlay2"></div>

in all.css add
	@import url("modules/paint-draw/overlay.css");
	
	

that´s it. this should work. Remember you can only test it on the iPad and not on the desktop based on the event that is being used. 	