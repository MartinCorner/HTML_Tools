
window.onload = function start() {
	SpinningWheel.addSlot({1: 'Background', 2: 'Study Design', 3: 'Endpoints', 4: 'Patient population', 5: 'Results'});
	
	SpinningWheel.setDoneAction(done);
	
	SpinningWheel.open();
}

function done() {
	var results = SpinningWheel.getSelectedValues();
	alert('values: ' + results.values);
}

window.addEventListener('load', function(){ setTimeout(function(){ window.scrollTo(0,0); }, 100); }, true);
