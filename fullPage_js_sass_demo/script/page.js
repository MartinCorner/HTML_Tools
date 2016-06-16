$(document).ready(function () {

    var step = 1,
        isStep = false,
        mouseWheelDirection = true; //true = down, false = up
    
    //	$("#demosMenu").change(function(){
    //	  window.location.href = $(this).find("option:selected").attr("id") + '.html';
    //	});
    
    var fullPageController = function(anchorLink, index, event){
        console.log('Load: ' + index);
        console.log(mouseWheelDirection);
        //section 2
        if (index == 2) {
            if (mouseWheelDirection) $.fn.fullpage.moveSectionDown();
            else if (!mouseWheelDirection) $.fn.fullpage.moveSectionUp();
            $('#section1').find('img').delay(500).animate({
                left: '0%'
            }, 1500, 'easeOutExpo');
        }

        if (anchorLink == '3rdPage') {
            $('#section2').find('.intro').delay(500).animate({
                left: '0%'
            }, 1500, 'easeOutExpo');
        }
        if (anchorLink == 'step1') {
            isStep = true;
        }
    }

    var stepController = function (delta, event) {
        if (delta < 0) {
            step++;
        } else {
            step--;
        }
        if (step < 1) isStep = false;
        else event.stopPropagation();
        console.log(step);
        stepAmi(step);
    }
    
    var stepAmi = function(step){
        switch(step){
            case 1:
                $('#section3 .intro')[0].className = "intro";
                $('#section3 .intro').addClass('step1');
                break;
            case 2:
                $('#section3 .intro')[0].className = "intro";
                $('#section3 .intro').addClass('step2');
                break;
            case 3:
                $('#section3 .intro')[0].className = "intro";
                $('#section3 .intro').addClass('step3');
                break;
            case 4:
                $('#section3 .intro')[0].className = "intro";
                $('#section3 .intro').addClass('step4');
                break;
        }
    }
    
    $('#fullpage').fullpage({
        sectionsColor: ['#6dbee0', '#54e26f', '#a36d36'],
        anchors: ['firstPage', 'secondPage', '3rdPage', 'step1'], // , 'step2' , 'step3'
        scrollingSpeed: 1000,
        css3: true,
        easingcss3: 'linear',
        afterLoad: function(anchorLink, index, event){
            fullPageController(anchorLink, index, event);
        }
    });

    document.body.onmousewheel = function (event) {
        var delta = 0;
        if (!event) event = window.event;
        if (event.wheelDelta) {
            delta = event.wheelDelta / 120;
            if (window.opera) delta = -delta;
        } else if (event.detail) {
            delta = -event.detail / 3;
        }
        mouseWheelDirection = delta < 0;
        if (delta && isStep && delta < 5) stepController(delta, event)
    };
    
});