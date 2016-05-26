(function (window){
    
    var isTouch = 'ontouchstart' in window;
    var touchEvents = 
    {
        start: isTouch ? 'touchstart' : 'mousedown',
        move: isTouch ? 'touchmove': 'mousemove',
        end: isTouch ? 'touchend' : 'mouseup'
    };
    
    function transformItemViews ()
    {
        for (var i=0; i<_itemViews.length; i++)
        {
            var view = _itemViews[i];
            transformItemView(view, i); 
        }
    }
    
    function transformItemView (view, index)
    {
        var offset = offsetForItemAtIndex(index);
        transformForItemView(view, offset);
    }
     
    function transformForItemView(view, offset)
    {
        var count = _numberOfItems; //circularCarouselItemCount();
        var spacing = 1;
        var arc = Math.PI * 2.0;
        var radius = Math.max(_itemWidth * spacing / 2.0, _itemWidth * spacing / 2.0 / Math.tan(arc/2.0/count));
        var angle = offset / count * arc;
        
        var x = radius * Math.sin(angle),
            z = (radius * Math.cos(angle) - radius) *1.4,
            s = (0.3 * Math.cos(angle) + 0.5);
        
        view.style.webkitTransform = " translate3d(" + x.toFixed(8) + "px, 0px, " + z.toFixed(8)  + "px) scale("+ s.toFixed(8) +")";
        //view.style.webkitTransform = "translateX(" + radius * Math.sin(angle) + "px) scale(" + (Math.cos(angle)*0.2 + 0.7) + ")";
        view.style.opacity = Math.max(Math.cos(angle) + 1, 0.5);
        //view.style.opacity = Math.cos(angle) < 0.9 ? 1: 0.5;

        if (Math.cos(angle) > 0.8)
        {
            view.style.webkitFilter = "";
        }
        else if (Math.cos(angle) > 0.75)
        {
            view.style.webkitFilter = "blur(0.5px) grayscale(1)";
        }
        else
        {
            view.style.webkitFilter = "blur(1px) grayscale(1)";
        }
        
    }
    
    function offsetForItemAtIndex (index)
    {
        var offset = index - _scrollOffset;
    
        if (_wrapEnabled)
        {
            if (offset > _numberOfItems/2)
            {
                offset -= _numberOfItems;
            }
            else if (offset < -_numberOfItems/2)
            {
                offset += _numberOfItems;
            }
        }
        
        //handle special case for one item
        if (_numberOfItems + _numberOfPlaceholdersToShow == 1)
        {
            offset = 0;
        }
    
        return offset;
    }
    function clampedOffset (offset)
    {
        if (_wrapEnabled)
        {
            return _numberOfItems? (offset - Math.floor(offset / _numberOfItems) * _numberOfItems): 0;
        }
        else
        {
            return Math.min(Math.max(0, offset), Math.max(0, _numberOfItems - 1));
        }
    }
    //function clampedIndex (index)
    
    function currentItemIndex ()
    {   
        return clampedOffset(Math.round(_scrollOffset));
    }
    
    function minScrollDistanceFromOffset (fromIndex, toIndex)
    {
        var  directDistance = toIndex - fromIndex;
        if (_wrapEnabled)
        {
            var wrappedDistance = Math.min(toIndex, fromIndex) + _numberOfItems - Math.max(toIndex, fromIndex);
            if (fromIndex < toIndex)
            {
                wrappedDistance = -wrappedDistance;
            }
            return (Math.abs(directDistance) <= Math.abs(wrappedDistance))? directDistance: wrappedDistance;
        }
        return directDistance;
    }
    
    /*
    function updateNumberOfVisibleItems (offset)
    {
        var spacing = 0.25;
        //var width = _vertical ? self.bounds.size.height: self.bounds.size.width;
        var itemWidth = _itemWidth * spacing;
        _numberOfVisibleItems = ceilf(1024 / itemWidth) + 2;
    }*/
    
    function decelerationDistance ()
    {
        var acceleration = -_startVelocity * DECELERATION_MULTIPLIER * (1 - _decelerationRate);
        return -Math.pow(_startVelocity, 2) / (2 * acceleration);
    }
    
    function shouldDecelerate()
    {
        return (Math.abs(_startVelocity) > SCROLL_SPEED_THRESHOLD) &&
        (Math.abs(decelerationDistance()) > DECELERATE_THRESHOLD);
    }
    
    function shouldScroll()
    {
        return (Math.abs(_startVelocity) > SCROLL_SPEED_THRESHOLD) &&
        (Math.abs(_scrollOffset - currentItemIndex()) > SCROLL_DISTANCE_THRESHOLD);
    }
    
    function startDecelerating()
    {
        var distance = decelerationDistance();
        _startOffset = _scrollOffset;
        _endOffset = _startOffset + distance;
        
        if (_stopAtItemBoundary)
        {
            if (distance > 0)
            {
                _endOffset = Math.ceil(_endOffset);
            }
            else
            {
                _endOffset = Math.floor(_endOffset);
            }
        }
        
        distance = _endOffset - _startOffset;
        
        _startTime = ALCurrentMediaTime();
        _scrollDuration = Math.abs(distance) / Math.abs(0.5 * _startVelocity);
    
        if (distance != 0)
        {
            _decelerating = true;
            startAnimation();
        }
    }
    
    function scrollToOffset(offset, duration)
    {
        scrollByOffset(minScrollDistanceFromOffset(_scrollOffset, offset), duration);
    }
    
    function scrollByOffset (offset, duration)
    {
        
        if (duration > 0)
        {
            _decelerating = false;
            _scrolling = true;
            _startTime = ALCurrentMediaTime();
            _startOffset = _scrollOffset;
            _scrollDuration = duration;
            _previousItemIndex = Math.round(_scrollOffset);
            _endOffset = _startOffset + offset;
            if (!_wrapEnabled)
            {
                _endOffset = clampedOffset(_endOffset);
            }
            
            startAnimation();
        }
        else
        {
            _scrollOffset += offset;
        }
    }
    
    function easeInOut(time)
    {
        return (time < 0.5)? 0.5 * Math.pow(time * 2, 3): 0.5 * Math.pow(time * 2 - 2, 3) + 1.0;
    }
    
    function didScroll()
    {
        if (_wrapEnabled)
        {
            _scrollOffset = clampedOffset(_scrollOffset);
        }
        var currentIndex = Math.round(_scrollOffset);
        var difference = minScrollDistanceFromOffset(_previousItemIndex, currentIndex);
        if (difference)
        {
            _toggleTime = ALCurrentMediaTime();
            _toggle = Math.max(-1,  Math.min(1, -difference));
            startAnimation();
        }
        transformItemViews();
    
        if (clampedOffset(_previousItemIndex) != currentItemIndex())
        {   
            window.didRotaryCurrentIndexChange(currentIndex % _numberOfItems);
        }
        _previousItemIndex = currentIndex;
    }
    
    
    function startAnimation ()
    {
        if (!_timer) _timer = window.setInterval(step, 20);
    }
    function stopAnimation ()
    {
        window.clearInterval(_timer);
        _timer = null;
    }
    
    function step()
    {
        var currentTime = ALCurrentMediaTime();
        
        if (_toggle != 0)
        {
            var toggleDuration = _startVelocity? Math.min(1, Math.max(0.0, 1 / Math.abs(_startVelocity))): 1.0;
            toggleDuration = MIN_TOGGLE_DURATION + (MAX_TOGGLE_DURATION - MIN_TOGGLE_DURATION) * toggleDuration;
            var time = Math.min(1, (currentTime - _toggleTime) / toggleDuration);
            var delta = easeInOut(time);
            _toggle = (_toggle < 0)? (delta - 1): (1 - delta);
            didScroll();
        }
        
        if (_scrolling)
        {
            var time = Math.min(1, (currentTime - _startTime) / _scrollDuration);
            
            var delta = easeInOut(time);
            _scrollOffset = _startOffset + (_endOffset - _startOffset) * delta;
            
            didScroll();
            if (time == 1)
            {
                _scrolling = false;
            }
        }
        else if (_decelerating)
        {
            var time = Math.min(_scrollDuration, currentTime - _startTime);
            var acceleration = -_startVelocity / _scrollDuration;
            var distance = _startVelocity * time + 0.5 * acceleration * Math.pow(time, 2);
            _scrollOffset = _startOffset + distance; 
            didScroll();
              
            if (time == _scrollDuration)
            {
                _decelerating = false;
                
                if (_scrollToItemBoundary)
                {
                    if (Math.abs(_scrollOffset - currentItemIndex()) < 0.01)
                    {
                        scrollToOffset(currentItemIndex(), 0.01);
                    }
                    else
                    {
                        scrollToOffset(currentItemIndex(), SCROLL_DURATION);
                    }
                }
                
            }
        }
        else if (_toggle == 0)
        {
            stopAnimation();
        }
    }
    
    function ALCurrentMediaTime()
    {
        return Date.now() / 1000;
    }
    
    var DECELERATION_MULTIPLIER = 20,
        SCROLL_SPEED_THRESHOLD = 1,
        DECELERATE_THRESHOLD = 1,
        SCROLL_DISTANCE_THRESHOLD = 0.1,
        SCROLL_DURATION = 0.4;
        MAX_TOGGLE_DURATION = 0.4,
        MIN_TOGGLE_DURATION = 0.2;
    
    
    var _numberOfItems = 6;
    var _itemWidth = 393;
    var _numberOfPlaceholdersToShow = 0;
    var _decelerationRate = 0.6;
    
    var _wrapEnabled = true;
    var _stopAtItemBoundary = true;
    var _scrollToItemBoundary = true;
    //var _vertical = false;
    
    var _scrollOffset = 0;
    var _offsetMultiplier = 1;
    var _scrollSpeed = 1;
    
    var _previousItemIndex = 0;
    //var _updateNumberOfVisibleItems;
    
    var _decelerating;
    var _didDrag;
    var _scrolling;
    
    var _toggle = 0;
    var _toggleTime;
    
    var _startVelocity;
    var _startTime;
    var _startOffset;
    var _endOffset;
    var _scrollDuration
    
    var _timer;
    var _itemViews;
    
    function onStart(event)
    {
        var touch = isTouch ? event.touches[0] : event,
            fingers = isTouch ? event.touches.length : 1,
            _previousTranslation = touch.clientX;
            _previousTime = ALCurrentMediaTime();
            hasMoved = false;
        
        if (fingers == 1)
        {
            document.addEventListener(touchEvents.move, onMove, false);
            document.addEventListener(touchEvents.end, onEnd, false);
        }
    
        event.preventDefault();
        event.stopPropagation();
    
        function onMove(event)
        {
            hasMoved = true;
            touch = isTouch ? event.touches[0] : event;
            fingers = isTouch ? event.touches.length : 1;
    
            if (fingers == 1)
            {
                var factor = 1;
                
                _scrolling = false;
                _decelerating = false;
                _dragging = true;
                
                var thisTime = ALCurrentMediaTime();
                var translation = touch.clientX - _previousTranslation;
                var velocity = translation / (thisTime - _previousTime);
                previousTime = thisTime;
                //_wrapEnabled
                _previousTranslation = touch.clientX;
                _startVelocity = -velocity * factor * _scrollSpeed / _itemWidth * 10;
                
                if (_startVelocity > 200) _startVelocity = 200;
                else if (_startVelocity < -200) _startVelocity = -200;
                
                _scrollOffset -= translation * factor * _offsetMultiplier / _itemWidth;
                
                didScroll();
            }
        }
    
        function onEnd(event)
        {
            touch = isTouch ? touch : event;
    
            if(fingers == 1)
            {
                if(!hasMoved)
                {
                    if (!_decelerating && !_scrolling)
                    {
                        if (_previousTranslation < 180)
                            scrollToOffset(currentItemIndex() - 1 , SCROLL_DURATION);
                        else if (_previousTranslation > 400)
                            scrollToOffset(currentItemIndex() + 1, SCROLL_DURATION);
                    }
                }
                else
                {   
                    _dragging = false;
                    _didDrag = true;
                    
                    if (shouldDecelerate())
                    {
                        _didDrag = false;
                        startDecelerating();
                    }
                    if (!_decelerating)
                    {
                        if (shouldScroll())
                        {
                            var direction = ~~(_startVelocity / Math.abs(_startVelocity));
                            scrollToOffset(currentItemIndex() + direction, SCROLL_DURATION);
                        }
                        else
                        {
                            scrollToOffset(currentItemIndex(), SCROLL_DURATION);
                        }
                    }
                }           
            }
            
            document.removeEventListener(touchEvents.move, onMove, false);
            document.removeEventListener(touchEvents.end, onEnd, false);
        }
    }
     
    window.initializeRotary = function (element, data)
    {
        _numberOfItems = data.length;
        _itemViews = [];
        
        for (var i=0; i<data.length; i++)
        {
            var image =  new Image();
            image.src = data[i];
            element.appendChild(image);
            _itemViews.push(image);
        }
        
        scrollToOffset(currentItemIndex(), SCROLL_DURATION);
        element.addEventListener(touchEvents.start, onStart, false);
    };
    /*
    window.didRotaryCurrentIndexChange = function (index)
    {
        
    };*/
    
})(window);