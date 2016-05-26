document.ontouchmove = function(e) {
    e.preventDefault();
};

var touchstartOrClick = "";
var isiPad = navigator.platform.indexOf("iPad") != -1;
isiPad ? touchstartOrClick = "touchstart" : touchstartOrClick = "click";

var panelContainer = $('.panel-container');
var leftPannel = $('.left-panel');
var leftMidContainer = $(".left-mid-container");
var rightMidContainer = $(".right-mid-container");
var leftMidPannel = $('.left-mid-panel');
var rightMidPannel = $('.right-mid-panel');
var rightPannel = $('.right-panel');
var leftContent = $(".left-content");
var rightContent = $(".right-content");
var leftPaneCopy = $(".left-pane-copy");
var rightPaneCopy = $(".right-pane-copy");


var speed = 600;
var ready = true;
var ease = "in-out";
var cubicBezier1 = "cubic-bezier(1, .90, .95, .98)";
var cubicBezier2 = "cubic-bezier(.3, 1, 1, 1)";
var state1Active = false;
var state2Active = false;
var state3Active = false;





function state1() {
    console.log(1);
    panelContainer.transition({ x : 0}, speed, ease);
    
    leftMidPannel.transition({rotateY: "70deg", scale : [1, 1], "background": "#fe8f1c", x : 0}, speed, ease);
    rightMidPannel.transition({rotateY: "-70deg", scale : [1, 1], "background": "#c0701b", x : 0}, speed, ease);
    rightMidContainer.transition({x : 0}, speed, ease);
    leftMidContainer.transition({x : 0}, speed, ease);
    
    leftPaneCopy.transition({opacity : 0, x : 0, scale: 1}, 0, ease);
    rightPaneCopy.transition({opacity : 0, x : 0, scale: 1}, 0, ease);
    
    setTimeout(function(){
        leftPaneCopy.transition({opacity : 1}, 500, ease);
        rightPaneCopy.transition({opacity : 1}, 500, ease);
    }, speed -200);
    
    
    leftContent.transition({ opacity : 0}, speed, ease);
    rightContent.transition({ opacity : 0}, speed, ease);
    
    rightPannel.transition({ scale : [1, 1] , x : 0,"background": "#ffac56" }, speed, ease);
    leftPannel.transition({ scale : [1, 1], x : 0, "background": "#ffac56" }, speed, ease);
   
};

function state2() {
    console.log(2);
    panelContainer.transition({ x : 250}, speed, ease);
    
    leftMidContainer.css({ "z-index": 3 });
    rightMidContainer.css({ "z-index": 2 });
    
    leftMidPannel.transition({ rotateY: "70deg", "background": "#fe8f1c", scale : [1, 1.25], x : 0}, speed, ease);
    rightMidPannel.transition({ rotateY: '0deg', "background": "#c0701b", scale : [1, 1],  x : 0}, speed, ease);
    rightMidContainer.transition({x : 90}, speed, ease);
    leftMidContainer.transition({x : 0}, speed, ease);
    
    
    leftPaneCopy.transition({opacity : 0, x : 2000, scale: 0.8}, 0, ease);
    rightPaneCopy.transition({opacity : 0, x : -230, scale: 0.8}, 0, ease);
    
    setTimeout(function(){
        rightPaneCopy.transition({opacity : 0.8}, 300);
    }, speed - 100);
    
    
    leftContent.transition({ opacity : 1}, speed, ease);
    rightContent.transition({ opacity : 0}, speed, ease);
    
    rightPannel.transition({ scale : [1, 1] , x : 75, "background": "#c0701b"}, speed, ease);
    leftPannel.transition({ scale : [1, 1.25], x : 0, "background-image": "url(../images/left-panel-bg@2x.0-514.png)"}, speed, ease);
    
};

function state3() {
    console.log(3);
    panelContainer.transition({ x : -250}, speed, ease);
    
    leftMidContainer.css({ "z-index": 2 });
    rightMidContainer.css({ "z-index": 3 });
    
    leftMidPannel.transition({ rotateY: '0deg', scale : [1, 1], x : 0}, speed, ease);
    rightMidPannel.transition({ rotateY: "-70deg", scale : [1, 1.25], x : 0}, speed, ease);
    leftMidContainer.transition({x : -90}, speed, ease);
    rightMidContainer.transition({x : 0}, speed, ease);


    leftPaneCopy.transition({opacity : 0, x : 220}, 0, ease);
    rightPaneCopy.transition({opacity : 0, x : -2000}, 0, ease);
    
    setTimeout(function(){
        leftPaneCopy.transition({opacity : 0.8}, 300);
    }, speed - 100);
    
    
    leftContent.transition({ opacity : 0}, speed, ease);
    rightContent.transition({ opacity : 1}, speed, ease);

    rightPannel.transition({ scale : [1, 1.25], x : 0}, speed, ease);
    leftPannel.transition({ scale : [1, 1], x : -75}, speed, ease);
    
};

$(".pill").bind(touchstartOrClick, function() {
    if(ready && !state1Active) {
        ready = false;
        state1Active = true;
        state2Active = false;
        state3Active = false;
        
        state1();
        
        setTimeout(function(){
            ready = true;
        }, speed);
    }
});

$(".left-mid-panel, .left-panel").bind(touchstartOrClick, function() {
    
    if(ready && !state2Active) {
        
        ready = false;
        
        state1Active = false;
        state2Active = true;
        state3Active = false;
        
        state2();

        setTimeout(function(){
            ready = true;
        },speed);
    }
});

$(".right-mid-panel, .right-panel").bind(touchstartOrClick, function() {

    if(ready && !state3Active) {
        ready = false;
        
        state1Active = false;
        state2Active = false;
        state3Active = true;
        
        state3();
        
        setTimeout(function(){
            ready = true;
        }, speed);
    }
});

