(function (window)
    {
        window.classAugment = function(receivingClass, givingClass) 
        {
      
            if (arguments[2]) 
            {
                for (var i=2, len=arguments.length; i<len; i++) 
                {
                    receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
                }
            }
            else 
            {
                for (var methodName in givingClass.prototype) 
                {
                    if (!receivingClass.prototype[methodName]) 
                    {
                        receivingClass.prototype[methodName] = givingClass.prototype[methodName];
                    }
                }
            }
        };

        classAugment(NodeList, Array, 'forEach','filter','indexOf','map', 'reduce',"reduce");

    })(window);

(function(window){
    
    window.app = {};
        
    var reference_box = $("#references"),
        study_design_box =  $("#study-design"),
//        information_box =  $("#informations"),
        SidebarMenu_box = $('#side-menu'),
        screen = $('#screen'),
        logo2 = $('#logo2'),
        background_mask_box =  $("#background-mask");
//        title_box = $("#title-background");

//    title_box.style.webkitTransform = "translateZ(0)";
//    reference_box.style.visibility = "visible";
    reference_box.style.webkitTransform = "translateY(512px)";
    
//    study_design_box.style.visibility = "visible";
    study_design_box.style.webkitTransform = "translateX(512px)";

//    information_box.style.webkitTransform = "translateX(512px)";
//    information_box.style.visibility = "visible";
    

    var status = 0;
    
    app.references = 
        {
            push: function ()
            {
                background_mask_box.style.visibility = "visible";
                reference_box.style.visibility = "visible";
                reference_box.style.webkitTransition = "-webkit-transform 0.3s ease-out";
                reference_box.style.webkitTransform = "translateY(0px)";
                
                status |= 0x1;
            },
            pop: function ()
            {
                if (status ^ 0x1 == 0) background_mask_box.style.visibility = "hidden";
                reference_box.style.webkitTransition = "-webkit-transform 0.3s ease-out";
                reference_box.style.webkitTransform = "translateY(512px)";
                
                status ^= 0x1;
            },
            replaceContent: function (html)
            {
                $("#references > .reference-content").innerHTML = html;
            }
        };
    
    app.study_design = 
        {
            push: function ()
            {
                background_mask_box.style.visibility = "visible";
                study_design_box.style.visibility = "visible";
                study_design_box.style.webkitTransition = "-webkit-transform 0.3s ease-out";
                study_design_box.style.webkitTransform = "translateX(0px)";
                
                status |= 0x2;
            },
            pop: function ()
            {
                if (status ^ 0x2 == 0) background_mask_box.style.visibility = "hidden";
                study_design_box.style.webkitTransition = "-webkit-transform 0.3s ease-out";
                study_design_box.style.webkitTransform = "translateX(512px)";
                
                status ^= 0x2;
            },
            replaceContent: function (html)
            {
                $("#study-design > .study-design-content").innerHTML = html;
            }
        };
    
    app.SidebarMenu = 
        {
            push: function ()
            {
                background_mask_box.style.visibility = "visible";
//                SidebarMenu_box.style.visibility = "visible";
                SidebarMenu_box.style.webkitTransition = "-webkit-transform 0.5s";
                SidebarMenu_box.style.webkitTransform = "translateX(0px)";
                screen.style.webkitTransition = "-webkit-transform 0.5s";
                screen.style.webkitTransform = "translate3d(-220px, 0, 0)";
                logo2.style.webkitTransition = "-webkit-transform 0.5s";
                logo2.style.webkitTransform = "translate3d(-220px, 0, 0)";
                status |= 0x4;
            },
            pop: function ()
            {
//                if (status ^ 0x4 == 0) background_mask_box.style.visibility = "hidden";
                SidebarMenu_box.style.webkitTransition = "-webkit-transform 0.5s";
                SidebarMenu_box.style.webkitTransform = "translateX(220px)";
                screen.style.webkitTransition = "-webkit-transform 0.5s";
                screen.style.webkitTransform = "translate3d(0px, 0, 0)";
                logo2.style.webkitTransition = "-webkit-transform 0.5s";
                logo2.style.webkitTransform = "translate3d(0px, 0, 0)";
                
                status ^= 0x4;
            }
        };

//    app.informations = 
//        {
//            push: function ()
//            {
//                background_mask_box.style.visibility = "visible";
//                information_box.style.visibility = "visible";
//                information_box.style.webkitTransition = "-webkit-transform 0.3s ease-out";
//                information_box.style.webkitTransform = "translateX(0px)";
//                
//                status |= 0x4;
//            },
//            pop: function ()
//            {
//                if (status ^ 0x4 == 0) background_mask_box.style.visibility = "hidden";
//                information_box.style.webkitTransition = "-webkit-transform 0.3s ease-out";
//                information_box.style.webkitTransform = "translateX(512px)";
//                
//                status ^= 0x4;
//            }
//        };
    
    window.addPressListener(background_mask_box,
                {
                    "onPressEnd": function (event)
                    {
                        (status ^ 0x1 == 0) && app.study_design.pop();
                        (status ^ 0x2 == 0) && app.references.pop();
                        (status ^ 0x4 == 0) && app.SidebarMenu.pop();
                    }
                });
    
    window.addPressListener($("#study-design > .study-design-close-button"), 
                {                    
                    "onPressEnd": app.study_design.pop
                });
    
    window.addPressListener($("#reference-button"), 
                {
                    "onPressEnd": app.references.push
                });

    window.addPressListener($("#information-button"), 
                {
//                    "onPressEnd": app.informations.push
                    "onPressEnd": app.SidebarMenu.push
                });

//    window.addPressListener($("#informations > .information-close"), 
//                {
//                    "onPressEnd": app.informations.pop
//                });

//    var menuButtons = $$("#informations >.information-menu >li>span");
//    
        window.addPressListener(logo2, 
        {
            "onPressEnd": function (event)
            {
                window.gotoSlide('gpb-km6');
            }
        });
    window.addPressListener($('#gotoSlide-gpb-km1'), 
                {
                    "onPressEnd": function (event)
                    {
                        window.gotoSlide("gpb-km1");
                    }
                });
//    
    window.addPressListener($('#gotoSlide-gpb-km2'), 
                {
                    "onPressEnd": function (event)
                    {
                        window.gotoSlide("gpb-km2");
                    }
                });
//    
    window.addPressListener($('#gotoSlide-gpb-km3'), 
                {
                    "onPressEnd": function (event)
                    {
                        window.gotoSlide("gpb-km3");
                    }
                });
//    
    window.addPressListener($('#gotoSlide-gpb-km4'), 
                {
                    "onPressEnd": function (event)
                    {
                        window.gotoSlide("gpb-km4");
                    }
                });
//    
    window.addPressListener($('#gotoSlide-gpb-km5'), 
                {
                    "onPressEnd": function (event)
                    {
                        window.gotoSlide("gpb-km5");
                    }
                });
//    
    window.addPressListener($('#gotoSlide-gpb-km6'), 
                {
                    "onPressEnd": function (event)
                    {
                        window.gotoSlide("gpb-km6");
                    }
                });
//    
    window.addPressListener($('#gotoSlide-gpb-km7'), 
                {
                    "onPressEnd": function (event)
                    {
                        window.gotoSlide("gpb-km7");
                    }
                });
//    
    window.addPressListener($('#gotoSlide-gpb-resources'), 
                {
                    "onPressEnd": function (event)
                    {
                        window.gotoSlide("gpb-resources");
                    }
                });
//    
    window.addPressListener($('#gotoSlide-gpb-summary'), 
                {
                    "onPressEnd": function (event)
                    {
                        window.gotoSlide("gpb-summary");
                    }
                });
//    
//    window.addPressListener(menuButtons[9], 
//                {
//                    "onPressEnd": function (event)
//                    {
//                        slideTo(undefined, 13);
//            app.informations.pop();
//                    }
//                });
//    
//    window.addPressListener(menuButtons[10], 
//                {
//                    "onPressEnd": function (event)
//                    {
////                        slideTo(undefined, 14);
//                        slideTo(undefined, 25);
//            app.informations.pop();
//                    }
//                });
//    
//    window.addPressListener(menuButtons[11], 
//                {
//                    "onPressEnd": function (event)
//                    {
//                        window.gotoSlide("STRIVERDI");
//                    }
//                });
//    
//    window.addPressListener(menuButtons[12], 
//                {
//                    "onPressEnd": function (event)
//                    {
//                        window.gotoSlide("RESPIMAT");
//                    }
//                });
    

//    var menu = $("#informations > .information-menu");
//    
//    menu.style.webkitOverflowScrolling = "touch";
//
//    menu.addEventListener("touchstart", function (event)
//        {
//            var scrollY = menu.scrollTop,
//                maxY = menu.scrollHeight - menu.offsetHeight;
//
//            if (scrollY == 0)  menu.scrollTop = 1;
//            else if (scrollY == maxY)  menu.scrollTop = maxY - 1;
//            event.stopPropagation();
//            
//        });
//    menu.addEventListener("touchmove", function (event)
//        {
//            event.stopPropagation();
//        });
//    menu.addEventListener("touchend", function (event)
//        {
//            event.stopPropagation();
//        });
    
    

    var AutoInvisibleAfterTransition = function (node, callback)
        {
            var transitionEvent = function(event)
                {
                    
                    if (event.target === node)
                    {
                        var flag;
                        
                        if (event.propertyName == "-webkit-transform")
                        {
                            var matrix = new WebKitCSSMatrix(node.style.webkitTransform),
                                x = matrix.m41,
                                y = matrix.m42;
                            
                            flag = (x == 0 && y ==0);
                        }
                        else if (event.propertyName == "opacity")
                        {
                            flag = (node.style.opacity == 1);
                        }
                        
                        if (flag)
                        {
                            callback && callback.onEntered && callback.onEntered(node);
                        }
                        else
                        {
                            node.style.visibility = "hidden";
                            callback && (callback.onHidden) && callback.onHidden(node);
                        }
                        
                    }
                };
        
            node.addEventListener("webkitTransitionEnd", transitionEvent);
            return function ()
            {
                node.removeEventListener("webkitTransitionEnd", transitionEvent);
            }
        }
    
    AutoInvisibleAfterTransition(reference_box);
    AutoInvisibleAfterTransition(study_design_box);


    app.slides = [];
    app.slideIndex = 0;


//    onCreated,
//    onVisibled,
//    onEntered,
//    onLeave
//    onHidden,
//    onRemoved;
    

    

    window.initilaize = function ()
        {
            var wrapper = $("#basket");

            app.slides.forEach (function (callback, index)
                {
                    var box = document.createElement("div");

                    box.className = "slide";
                    box.style.visibility = "hidden";

                    wrapper.appendChild(box);

                    callback.node = box;
                    callback.id = index;
                    callback.runtime = 0;
                    
                    if (callback.onCreated)
                    {
                        try
                        {
                            callback.onCreated(box);
                        }
                        catch (e)
                        {
                            console.log(e);
                        }
                    }
                    
                    AutoInvisibleAfterTransition(box, callback);
                    
                    addSwipeListener(box, callback);
                });

            app.slides[0].node.style.visibility = "visible";
            //app.slides[0].onEntered();
        };
    
                                
    window.slideTo = function (from, to, direct)
        {
            if (to == app.slideIndex) return;
        
            from = app.slideIndex;
        
            if (direct == undefined)//true,Right
            {
                direct = from - to < 0;
            }
        
            var current_controller = app.slides[from],
                next_controller = app.slides[to],
                current_view = current_controller.node,
                next_view = next_controller.node;
        
//            current_view.style.visibility = "visible";
            current_view.style.pointerEvents = "none";
             
            next_view.style.visibility = "visible";
            next_view.style.webkitTransition = "";
            next_view.style.webkitTransform = "translateX(" + (!direct ? "-1024px)" : "1024px)");
            next_view.style.pointerEvents = "";
            next_view.style.opacity = 1;
            
            current_controller.onLeave && current_controller.onLeave();
        
            if (next_controller.runtime++ == 0)
            {
                next_controller.node.id = "page-" + next_controller.id;
                next_controller.oninited && next_controller.oninited();
            }
            next_controller.onVisibled && next_controller.onVisibled();
            
            app.slideIndex = to;
        
            window.setTimeout(function ()
                {
                    current_view.style.webkitTransition = "-webkit-transform 0.5s ease-in-out";
                    current_view.style.webkitTransform = "translateX(" + (direct ? "-1024px)" : "1024px)");
                    next_view.style.webkitTransition = "-webkit-transform 0.5s ease-in-out";
                    next_view.style.webkitTransform = "translateX(0px)";
                           
                }, 100);
        };

   window.goTo = function (from, to)
        {
            if (to == app.slideIndex) return;
        
            from = app.slideIndex;
        
            var current_controller = app.slides[from],
                next_controller = app.slides[to],
                current_view = current_controller.node,
                next_view = next_controller.node;
        
//            current_view.style.visibility = "visible";
            current_view.style.pointerEvents = "none";
            current_view.style.opacity = 1;
             
            next_view.style.visibility = "visible";
            next_view.style.webkitTransition = "";
            next_view.style.webkitTransform = "";
            next_view.style.pointerEvents = "";
            next_view.style.opacity = 0;
       
            current_controller.onLeave && current_controller.onLeave();
        
            if (next_controller.runtime++ == 0)
            {
                next_controller.node.id = "page-" + next_controller.id;
                next_controller.oninited && next_controller.oninited();
            }
            next_controller.onVisibled && next_controller.onVisibled();
            
            app.slideIndex = to;
        
            window.setTimeout(function ()
                {
                    current_view.style.webkitTransition = "opacity 0.3s ease-in";
                    current_view.style.webkitTransform = "";
                    current_view.style.opacity = 0;
                    next_view.style.webkitTransition = "opacity 0.3s ease-out";
                    next_view.style.webkitTransform = "";
                    next_view.style.opacity = 1;
                           
                }, 50);
        };
        
        
    window.requestContent = function (path, self, callback)
        {
            var xhr = new XMLHttpRequest(),
                url = path + "?" + Date.now();

            xhr.open("POST", url, true);
        
            xhr.onreadystatechange = function()
                {
                    if (this.readyState == 4)
                    {
                        if (this.status == 200 || this.status == 0)
                        {
                            callback && callback.call(self, this.responseText);
                        }
                        else
                        {
                            console.error("failed to load: " + url + "[" + this.status + "]");
                        }
                    }
                };
        
            xhr.send();
        };
    
})(window);
    