(function ()
    {
       var render = cssRender;
      
       HTMLElement.prototype.untransit=function(preventTrigger,delayFinish)
           {
               var htmlElement = this;
               
               if(htmlElement.endTransition)
                     {
                        htmlElement.style[render.uc_label+"TransitionProperty"] = "";
                        htmlElement.style[render.uc_label+"TransitionDuration"] = "";
                        htmlElement.style[render.uc_label+"TransitionDelay"] = "";
                        htmlElement.style[render.uc_label+"TransitionTimingFunction"] = "";
                        htmlElement.removeEventListener(render.TRANSITION_END,htmlElement.endTransition);
                       if(delayFinish){htmlElement.endTransition()}
                     
                     }
             
               return htmlElement;
            }
            
        HTMLElement.prototype.transit = function (configInfo,endOperation)
            {

                var htmlElement = this;
                var eventScheduled;//count;
                var infoList = {};
				
				(function checkTransitionProperty()
				{
					var p;
					for(var c in configInfo)
                    {
						p = htmlElement.cssPropExists(c);
						if(htmlElement.style[p] != (configInfo[c][0]+""))
                        {
                            infoList[p] = configInfo[c];
                        }
					}
					
				})();
                
                function setTransitionProperty()
                {
					var animateList = [[],[],[],[],[]],tempAy;
					
                    for(var c in infoList)
                    {    
					        tempAy = infoList[c];

                            animateList[0].push(render.PropToCss(c));
                            animateList[1].push((tempAy[2] || 300) + "ms");
                            animateList[2].push(tempAy[1] || "ease-in-out");
							animateList[3].push((tempAy[3] || 0) + "ms");
							
                    }
                    eventScheduled = animateList[0];
					
                    htmlElement.style[render.uc_label+"TransitionProperty"] = animateList[0].join(',');
                    htmlElement.style[render.uc_label+"TransitionDuration"] = animateList[1].join(',');
                    htmlElement.style[render.uc_label+"TransitionDelay"] = animateList[3].join(',');
                    htmlElement.style[render.uc_label+"TransitionTimingFunction"] =  animateList[2].join(',');
				 
					
                }
            
               
                  window.setTimeout(function ()
                    {   
                         var value = null;
                           
						             setTransitionProperty();  //boot time effect animate

                            for(var param in infoList)
                            {
                             
                                   value = infoList[param][0];
                                    
                                   if(typeof(value) != "object")
                                       {
                                           htmlElement.style[param] = value;
									
                                       }
                                   else if( render.CssToProp(param) == transform.label)
                                       {
                                
                                           htmlElement.transform(value);
                                    
                                       }
                             } 

                         if (htmlElement.style.display == "none")
                                    {
                                        htmlElement.style.display = "block";
                                    }
                     },0);
                  
                    if(htmlElement.endTransition)htmlElement.removeEventListener(render.TRANSITION_END,htmlElement.endTransition);
                    
                    this.endTransition=function (event)
                       {            
                            event.stopPropagation();
						
                            delete infoList[render.CssToProp(event.propertyName)];
                            setTransitionProperty();

                            if(eventScheduled.length == 0)
                            {
                                infoList = eventScheduled = null;
                                htmlElement.removeEventListener(render.TRANSITION_END,htmlElement.endTransition);
                                delete htmlElement.endTransition;
                               
                                if (typeof(endOperation) == "function")
                                {
                                    endOperation(htmlElement);
                                                    
                                }
                            }
                       }
                        
                   htmlElement.addEventListener(render.TRANSITION_END,htmlElement.endTransition);
                   return this;
            }
 
  
	   var transform = 
	   {
		   "RegExp":function(key){return new RegExp(key+"\\(([^\\)]*)\\)?")},
		   "label": render.uc_label+"Transform" //error 
	   }
	   
	   HTMLElement.prototype.hasTransform = function(key)
         {     
               var htmlElement = this;
			   var style = this.style[transform.label];
			   if(style)
					   {
						   var flag = style.match(transform.RegExp(key));
						   if(flag) return flag;
						   return false;
					   }
					   return false;
		 }
		 
	   HTMLElement.prototype.setTransform = function(key,value)
         {     
             var style = this.style[transform.label],htmlElement = this;
			       flag = style.match(transform.RegExp(key));
			
				   htmlElement.style[transform.label] = style.replace(flag[0], key+"("+value+")");
		 }
		 
	   HTMLElement.prototype.removeTransform = function(key)
         {     
               var style = this.style[transform.label],htmlElement = this;
			       flag = style.match(transform.RegExp(key));
				  
				   htmlElement.style[transform.label] = style.replace(flag[0], "");
		 }
		 
	   HTMLElement.prototype.addTransform = function(key,value)
         {     
		       var htmlElement = this;
               var style = htmlElement.style[transform.label];
			   if(style =="")
			   {
				   htmlElement.style[transform.label] = key+"("+value+")";
			   }
			   else
			   {
				   htmlElement.style[transform.label] = style  +" "+ key +"("+value+")";
			   }
		 }

         HTMLElement.prototype.transform = function(info)
         {     
               var htmlElement = this;
			 
                if (typeof(info) == "object")
                {   
				    var list = info;

                    for(var p in list)
                    {  
                      
					   if( htmlElement.hasTransform(p) )
					   {
						   if(list[p])
						   {
							   htmlElement.setTransform(p,list[p]);
						   }
						   else
						   {
							   htmlElement.removeTransform(p);
						   }
						   
					   }
					   else if(list[p])
					   {
						   htmlElement.addTransform(p,list[p]) 
					   }

                     }

                }
                return htmlElement;
    
          }
        
        HTMLElement.prototype.fade = function (duration, delay,size,opacity,style,endOperation)
            {  
               var Xer=["center","left","right"],Yer=["center","top","bottom"];
               var i=(style||0)%3, j=((style||0)-i)/3;
               this.style[render.uc_label+"TransformOrigin"]=Xer[j]+" "+Yer[i];
               Xer=Yer=i=j=null;
               this.transit({"opacity":[opacity,"ease-out",duration,delay],"transform":[{"scale":size },"ease-in-out",duration,delay] },function(Dom){Dom.style[render.uc_label+"TransformOrigin"]="";endOperation&&endOperation(Dom);});
            };
            
        HTMLElement.prototype.show = function (duration, delay,endOperation)
            {
                this.transit({"opacity":[1,"ease-out",duration,delay]},endOperation);
            };
        HTMLElement.prototype.hide = function (duration, delay, endOperation)
            {
                this.transit({"opacity":[0,"ease-out",duration,delay]},endOperation);
                        
            };

       HTMLElement.prototype.move = function (duration, delay,left,top, endOperation)
            {
                this.transit({"left":[left+"px","linear",duration,delay],"top":[top+"px","linear",duration,delay]},endOperation);
           
            };
			
       HTMLElement.prototype.translateMove=function(duration,delay,left,top, deep,endOperation)
       {
           
            this.transit({"transform":[{"translate3d":(left||0)+"px, "+(top||0)+"px, "+(deep||0)+"px"},"ease-out",duration,delay]},endOperation);
         
       }

    })();