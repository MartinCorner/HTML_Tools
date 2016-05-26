(function(global){
    "use strict";
    function Overlay(){
        var that = this;
        this.setElements();
        this.initEventName();
        this.pencilSize = 10;
        this.brushSize = 14;
        this.curSize = this.pencilSize;
        this.curColor = "#0c9239";
        this.canvas = document.getElementById('sketchpad');
        this.context = this.canvas.getContext('2d');
        this.opened = false;

        this.canvas.addEventListener(this.START_EV, function(event){that.touchStartListener(event);}, false);
        this.canvas.addEventListener(this.MOVE_EV, function(event){that.touchMoveListener(event);}, false);
        this.canvas.addEventListener(this.END_EV, function(event){that.touchEndListener(event);}, false);

        this.isDrawing = false;
        this.pencilGreen = this.drawTool.getElementsByClassName('pencilGreen')[0];
        this.pencil = this.drawTool.getElementsByClassName('pencil')[0];
        this.brush = this.drawTool.getElementsByClassName('brush')[0];
        this.clear = this.drawTool.getElementsByClassName('clear')[0];
        document.getElementsByClassName('drawtool')[0].addEventListener(touchy.events.start, function (event) {
            event.stopPropagation();
            event.preventDefault();
			ag.submit.event({
				unique:true,
				categoryId: "Tools",
				category: "Tools",
				labelId: "Drawing_Tool",
				label: "Drawing Tool",
				valueId: "Drawing_Tool_tapped",
				value: true,
				valueType: "true/false"
			});
            that.opened = !that.opened; 
            that.tool(that.opened ? 'open' : 'close');
        }, false);
        this.pencilGreen.addEventListener(this.START_EV, function (event) {
            event.stopPropagation();
            event.preventDefault();
            that.tool('pencilGreen');
        }, false);
        this.pencil.addEventListener(this.START_EV, function (event) {
            event.stopPropagation();
            event.preventDefault();
            that.tool('pencil');
        }, false);
        this.brush.addEventListener(this.START_EV, function (event) {
            event.stopPropagation();
            event.preventDefault();
            that.tool('brush');
        }, false);
        this.clear.addEventListener(this.START_EV, function (event) {
            event.stopPropagation();
            event.preventDefault();
            that.tool('clear');
        }, false);
    };
    Overlay.prototype.tool = function(toDo){
        switch (toDo) {
            case "open":
                this.drawToolSketchpad.className = app.navigationToolbar.opened ? 'moved': '';
                this.drawTool.className = app.navigationToolbar.opened ? 'revereted': '';
                break;
            case "pencil":
                this.curColor = "#0c9239";
                break;
            case "pencilGreen":
                this.curColor = " #f56019";
                break;
            case "brush":
                this.curColor = "#ed145b";
                break;
            case "clear":
                this.context.clearRect(0, 0, this.canvas.getAttribute("width"), this.canvas.getAttribute("height"));
                break;
            case "close":
                this.context.clearRect(0, 0, this.canvas.getAttribute("width"), this.canvas.getAttribute("height"));
                this.drawToolSketchpad.className = 'hidden';
                this.drawTool.className = 'hidden';
                this.opened = false;
                break;
        }
    };
    Overlay.prototype.touchStartListener = function (event) {
        var coors = this.getEventCoordinates(event);
        this.context.beginPath();
        this.context.lineJoin = "round";
        this.context.moveTo(coors.x, coors.y);
        this.isDrawing = true;
    };
    Overlay.prototype.touchMoveListener = function(event){
        var coors = this.getEventCoordinates(event);
        if (this.isDrawing) {
            this.context.lineWidth = this.curSize;
            this.context.strokeStyle = this.curColor;
            this.context.lineTo(coors.x, coors.y - this.drawToolSketchpad.offsetTop);
            this.context.stroke();
        }
    };
    Overlay.prototype.touchEndListener = function(event){
        if (this.isDrawing) {
            this.isDrawing = false;
        }
    };
    Overlay.prototype.getEventCoordinates = function(event){
        return {
            x: event.touches[0] ? event.touches[0].pageX : event.pageX,
            y: event.touches[0] ? event.touches[0].pageY : event.pageY
        };
    };
    Overlay.prototype.setElements = function(){
        this.drawTool = util.createElement("div", {"id": "drawTool", "class": "hidden"});
        this.drawToolSketchpad = util.createElement("div", {'id': 'drawToolSketchpad', "class": "hidden"});
        document.body.appendChild(this.drawToolSketchpad);
        document.body.appendChild(this.drawTool);
        this.drawToolSketchpad.innerHTML = '<canvas id="sketchpad" width="1024" height="714"></canvas>';
        this.drawTool.innerHTML = '<ul>'
            + '<li class="pencil"><span>Pencil Tool</span></li>'
            + '<li class="pencilGreen"><span>PencilGreen Tool</span></li>'
            + '<li class="brush"><span>Brush Tool</span></li>'
            + '<li class="clear"><span>Erase All</span></li>'
            + '</ul>';
    };
    Overlay.prototype.initEventName = function(){
        var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
            hasTouch = 'ontouchstart' in window && !isTouchPad;
        this.START_EV = hasTouch ? 'touchstart' : 'mousedown';
        this.MOVE_EV = hasTouch ? 'touchmove' : 'mousemove';
        this.END_EV = hasTouch ? 'touchend' : 'mouseup';
    };

    global.Overlay = Overlay;
})(window);