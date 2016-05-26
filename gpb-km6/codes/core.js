(function(){

    window.$ = function(name) {
        var node = document.querySelector(name);
        if (node == null) throw "failed to find " + name;
        return node;

    };
    window.$$ = function(name) {

        return document.querySelectorAll(name);

    };

    $.appendClassName = function(element, className) {

        var classNames = element.className.split(/\s+/);

        if (classNames.indexOf(className) == -1) {
            classNames.push(className);
        }

        element.className = classNames.join(" ");

    };

    $.removeClassName = function(element, className) {

        var classNames = element.className.split(/\s+/);

        var index = classNames.indexOf(className);
        if (index != -1) {
            classNames.splice(index, 1);
        }

        element.className = classNames.join(" ");

    };

    $.replaceClassName = function(element, oldClassName, newClassName) {

        var classNames = element.className.split(/\s+/);

        var index = classNames.indexOf(oldClassName);
        if (index != -1) {
            classNames.splice(index, 1);
        }

        if (classNames.indexOf(newClassName) == -1) {
            classNames.push(newClassName);
        }

        element.className = classNames.join(" ");

    };

    $.containsClassName = function(element, className) {

        if (element.className) {

            var classNames = element.className.split(/\s+/);
            return (classNames.indexOf(className) != -1);
            
        } else {
            return false;
        }
        
    };
    
    $.fade = function (node, value, duration)
    {
        node.style.webkitTransition = duration ? "opacity " + duration + "ms ease-in-out 0ms" : "";
        node.style.opacity = value ? value : 0;
    }
})();
        
(function (window){
    
    var isTouch = 'ontouchstart' in window,
        TouchStart = isTouch ? "touchstart" : "mousedown",
        TouchMove = isTouch ? "touchmove" : "mousemove",
        TouchEnd = isTouch ? "touchend" : "mouseup";

    window.getEventTouch = function (event, id)
        {
            var touch, 
                i = event.changedTouches.length - 1;
            while (i > -1)
            {
                touch = event.changedTouches[i--];
                if (touch.identifier == id)
                {
                    return touch;
                }
            }
        };

    window.getTouchCoordinate = function (touch)
        {
            var point = new WebKitPoint(touch.pageX, touch.pageY);
            return point; 
        };

    window.getElementTouchCoordinate = function (element, touch)
        {
            var point = window.webkitConvertPointFromPageToNode(element, 
                        window.getTouchCoordinate(touch));
            return point;
        };

    window.addPointerListener = isTouch ? function (node, callback)
        {
            var touch_id = 0,
                touching = false,
                touchStart = function (event)
                {
                    if (event.touches.length == 1)
                    {
                        var touch = event.touches[0]
                        touch_id = touch.identifier;
                        
                        (callback.onTouchStart) && callback.onTouchStart(event, touch);
                        if (!touching)
                        {
                            touching = true;
                            document.body.addEventListener(TouchMove, touchMove);
                            document.body.addEventListener(TouchEnd, touchEnd);
                        }
                    }
                },
                touchMove = function (event)
                {
                    if (touching)
                    {
                        var touch = window.getEventTouch(event, touch_id);
                        if (touch)
                        {
                            (callback.onTouchMove) && callback.onTouchMove(event, touch);
                        }
                    }
                },
                touchEnd = function (event)
                {
                    if (touching)
                    {
                        var touch = getEventTouch(event, touch_id);
                        if (touch || event.touches == 0)
                        {
                            (touch && callback.onTouchEnd) && callback.onTouchEnd(event, touch);
                            touching = false;
                            document.body.removeEventListener(TouchMove, touchMove);
                            document.body.removeEventListener(TouchEnd, touchEnd);
                        }
                    }
                };
        
            node.addEventListener(TouchStart, touchStart);
            return {
                uninstall: function ()
                {
                    node.removeEventListener(TouchStart, touchStart);
                    document.body.removeEventListener(TouchMove, touchMove);
                    document.body.removeEventListener(TouchEnd, touchEnd);
                }
            };
        }:
        function (node, callback)
        {
            var touching = false,
                touchStart = function (event)
                {
                    (callback.onTouchStart) && callback.onTouchStart(event, event);
                    if (!touching)
                    {
                        touching = true;
                        document.body.addEventListener(TouchMove, touchMove);
                        document.body.addEventListener(TouchEnd, touchEnd);
                    }
                },
                touchMove = function (event)
                {
                    if (touching)
                    {
                        (callback.onTouchMove) && callback.onTouchMove(event, event);
                    }
                },
                touchEnd = function (event)
                {
                    if (touching)
                    {  
                        (callback.onTouchEnd) && callback.onTouchEnd(event, event);
                        touching = false;
                        document.body.removeEventListener(TouchMove, touchMove);
                        document.body.removeEventListener(TouchEnd, touchEnd);
                    }
                };
            node.addEventListener(TouchStart, touchStart);
            return {
                uninstall: function ()
                {
                    node.removeEventListener(TouchStart, touchStart);
                    document.body.removeEventListener(TouchMove, touchMove);
                    document.body.removeEventListener(TouchEnd, touchEnd);
                }
            };
    };
    
    var isPointInNode = function (node, point)
    {
        if ((point.x >= -30) &&
            (point.y >= -30) &&
            (point.x < node.clientWidth + 30) &&
            (point.y < node.clientHeight + 30))
        {
            return true;
        }
        
        return false;
    };
    
    window.addPressListener = function (node, callback, inNode)
        {
            var isInNode = inNode || isPointInNode,
                isCatched = false;
            var pressEvent = 
                {
                    onTouchStart: function (event, touch)
                    {
                        var relativePoint = getElementTouchCoordinate(node, touch);
                        if (isInNode(node, relativePoint))
                        {
                            $.appendClassName(node, "pressed");
                            (callback.onPressStart) && callback.onPressStart(event);
                            event.stopPropagation();
                            event.preventDefault();
                            isCatched = true;
                        }
                        else
                        {
                            isCatched = false;
                        }
                    },
                    onTouchMove: function (event, touch)
                    {
                        if (!isCatched) return;
                        var relativePoint = getElementTouchCoordinate(node, touch);
                        if (isInNode(node, relativePoint))
                        {
                            $.appendClassName(node, "pressed");
                        }
                        else 
                        {
                            $.removeClassName(node, "pressed");
                        }
                    },
                    onTouchEnd: function (event, touch) 
                    {
                        if (!isCatched) return;
                        var relativePoint = getElementTouchCoordinate(node, touch);
                        if (isInNode(node, relativePoint))
                        {
                            (callback.onPressEnd) && callback.onPressEnd(event);
                        }
                        else 
                        {
                            (callback.onPressCancel) && callback.onPressCancel(event);
                        }
                        
                        $.removeClassName(node, "pressed");
                    }   
                };
        
            var uninstaller = addPointerListener(node, pressEvent);
            return uninstaller;
        };
    
    window.addSwipeListener = function (node, callback, distance)
        {
            var x, isSwiped,
                threshold = distance || 150,
                swipeEvent = 
                {
                    "onTouchStart": function (event, touch)
                    {
                        x = touch.pageX;
                        isSwiped = false;
                    },
                    "onTouchMove": function (event, touch)
                    {
                        if (!isSwiped)
                        {
                            if (x - touch.pageX < -threshold)
                            {
                                (callback.onSwipeLeft) && callback.onSwipeLeft(event);
                                isSwiped = true;
                            }
                            else if (x - touch.pageX > threshold)
                            {
                                (callback.onSwipeRight) && callback.onSwipeRight(event);
                                isSwiped = true;
                            }
                        }
                    }
                };
        
            var uninstaller = addPointerListener(node, swipeEvent);
            return uninstaller;
        };
    window.addTapListener = function (node, callback)
        {
           
            isCatched = false;
            var tapEvent = 
                {
                    onTouchStart: function (event, touch)
                    {
                       isCatched = true;
                        (callback.onTapStart) && callback.onTapStart(event);
                    },
                    onTouchMove: function (event, touch)
                    {
                        isCatched = false;
                    },
                    onTouchEnd: function (event, touch) 
                    {
                        if (isCatched)
                        {
                            (callback.onTapEnd) && callback.onTapEnd(event);
                        }
                    }   
                };
        
            var uninstaller = addPointerListener(node, tapEvent);
            return uninstaller;
        };
        
})(window);
    
(function(document) {
	document.addEventListener("touchstart",
		function(event) {
			event.preventDefault();
			event.stopPropagation();
		});

	document.addEventListener("touchmove",
		function(event) {
			event.preventDefault();
			event.stopPropagation();
		});

	document.addEventListener("touchend",
		function(event) {
			event.preventDefault();
			event.stopPropagation();
		});
})(document);

