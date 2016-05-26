(function ()
    {
        
       var render = cssRender;
	   
       HTMLElement.prototype.unanimate=function(preventTrigger,delayFinish)
           {
               var htmlElement = this;
                htmlElement.style[render.uc_label+"AnimationName"] = "";
				htmlElement.style[render.uc_label+"AnimationIterationCount"] = "";
				htmlElement.style[render.uc_label+"AnimationDelay"] = "";
				htmlElement.style[render.uc_label+"AnimationTimingFunction"] = "";
				htmlElement.style[render.uc_label+"AnimationDuration"] = "";
               
               if(htmlElement.endAnimation)
                     {
                       
						
                        htmlElement.removeEventListener(render.ANIMATION_END,htmlElement.endAnimation);
						
						var endAnimation = htmlElement.endAnimation;
						delete htmlElement.endAnimation;
						
                        if(delayFinish)
					    {		
						   endAnimation();
					    };
                        endAnimation = null;
                     }
             
               return htmlElement;
            }
            
        HTMLElement.prototype.animate = function (configInfo,endOperation)
            {

                var htmlElement = this;
                var eventScheduled;
				
                function setAnimationProperty()
                {
					
					var animateList = [[],[],[],[],[]],tempAy;
					eventScheduled = [];
					
					for(var p in configInfo)
                    {
                            tempAy = configInfo[p];
                            //delete configInfo[p];
				
                            animateList[0].push(p);
                            animateList[1].push((tempAy[0] || 500) + "ms");
                            animateList[2].push(tempAy[1] || "ease-in-out");
                            animateList[3].push(tempAy[2] || 1);
							animateList[4].push((tempAy[3] || 0) + "ms");
							
							if(tempAy[2]!="infinite")eventScheduled.push(p);
                    
                    }
					
                    htmlElement.style[render.uc_label+"AnimationName"] = animateList[0].join(',');
                    htmlElement.style[render.uc_label+"AnimationIterationCount"] = animateList[3].join(',');
                    htmlElement.style[render.uc_label+"AnimationDelay"] = animateList[4].join(',');
                    htmlElement.style[render.uc_label+"AnimationTimingFunction"] = animateList[2].join(',');
                    htmlElement.style[render.uc_label+"AnimationDuration"] = animateList[1].join(',');
                }
    
						 setAnimationProperty();  //boot time effect animate

                         if (htmlElement.style.display == "none")
                                    {
                                        htmlElement.style.display = "block";
                                    }
                  
                  
				  if(htmlElement.endAnimation)htmlElement.removeEventListener(render.ANIMATION_END,htmlElement.endAnimation);
                    
				  if(eventScheduled.length != 0)
                     {
						
						htmlElement.endAnimation = function (event)
						   {            
								event.stopPropagation();
								
								delete configInfo[event.animationName];	
								setAnimationProperty();
							
	                            if(eventScheduled.length == 0)
								{
									
									configInfo = eventScheduled = null;
									htmlElement.removeEventListener(render.ANIMATION_END,htmlElement.endAnimation);
	
									if (typeof(endOperation) == "function")
									{
										endOperation(htmlElement);
														
									}
								}
	
						  }
						   
						htmlElement.addEventListener(render.ANIMATION_END,htmlElement.endAnimation);
					 }
					 else
					 {
						 configInfo = eventScheduled = null;
					 }
                  
                   
                   return this;
            }
 
    })();