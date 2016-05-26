(function ()
    {
        var // Useragent RegExp
        rwebkit = /(webkit)[ \/]([\w.]+)/,
        ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
        rmsie = /(msie) ([\w.]+)/,
        rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;

       var renders=
       {
            "webkit":
               {
                   "Reg":/(webkit)[ \/]([\w.]+)/,
                   "uc_label":"Webkit",
                   "lc_label":"-webkit-",
                   "TRANSITION_END":"webkitTransitionEnd",
                   "ANIMATION_END" : "webkitAnimationEnd"
                },
            "opera":
               {
                   "Reg":/(opera)(?:.*version)?[ \/]([\w.]+)/,
                   "uc_label":"O",
                   "lc_label":"-o-",
                   "TRANSITION_END":"oTransitionEnd",
                   "ANIMATION_END" : "oAnimationEnd"
                },
            "msie":
               {
                   "Reg":/(msie) ([\w.]+)/,
                   "uc_label":"ms",
                   "lc_label":"-ms-",
                   "TRANSITION_END":"MSTransitionEnd",
                   "ANIMATION_END" : "MSAnimationEnd"
                },
            "trident":
                { "Reg":/(trident)\/([\w.]+)/,
                   "uc_label":"ms",
                   "lc_label":"-ms-",
                   "TRANSITION_END":"MSTransitionEnd",
                   "ANIMATION_END" : "MSAnimationEnd"
                 },
            "mozilla":
               {
                   "Reg":/(mozilla)(?:.*? rv:([\w.]+))?/,
                   "uc_label":"Moz",
                   "lc_label":"-moz-",
                   "TRANSITION_END":"transitionend",
                   "ANIMATION_END" : "animationend"
                }
            
       }
       
    window.getUserAgent = function() 
        {
            Agent = navigator.userAgent.toLowerCase();
            //ua.indexOf("compatible") < 0 
            var match=[],temp=null;
    
            for (var p in renders)
            {  
             
               temp=renders[p].Reg.exec( Agent );
               if(temp)
               { 
                 match=temp;
                 break;
               }
            }
            
            return { browser: match[1] || "", version: match[2] || "0" };
        };
        
        
     var render = renders[getUserAgent().browser];
            
     window.cssRender = render;
	 
     window.getPathParameter = function (id, defaultValue)
            {

             /*   var value = window.location.search.match(
                   new RegExp("[\?\&]" + id + "=([^\&]*)(\&?)", "i")
                
                   );*/
                   var href=window.location+"";
                   var index=href.search("#"+id );
                   var value=defaultValue;
                   if(index!=-1)
                   {
                    value = href.substr(index+1)
                
                   }

                   return value;
            }
			
	   render.PropToCss = function( prop )
			{    
			     if(prop.indexOf( render.uc_label ) == 0)
				 {
					 var  value = prop.replace(render.uc_label,""),
						  value =value.charAt( 0 ).toLowerCase() + value.substr( 1 );
					 return render.lc_label+value;
				 }
				 return prop;
			}
			
	   render.CssToProp = function( prop )
			{   
			     if(prop.indexOf( render.lc_label ) == 0)
				 {
					 var  value = prop.replace(render.lc_label,""),
						  value = value.charAt( 0 ).toUpperCase() + value.substr( 1 );
					 return render.uc_label+value;
				 }
				 return prop;
			}
			
       HTMLElement.prototype.cssPropExists = function( prop )
        {  
           var htmlElements =this;
           var uc_prop = render.uc_label + prop.charAt( 0 ).toUpperCase() + prop.substr( 1 ),
               lc_prop = render.lc_label + prop.charAt( 0 ).toLowerCase() + prop.substr( 1 ),
               props = ( prop  + " " + uc_prop + " " + lc_prop).split( " " );
			
           for ( var v in props )
           {
              
                if (htmlElements.style[ props[ v ] ] !== undefined ) 
                {
					
                    return  props[ v ];
					
                    break;
                }
           }
           return  null;
         }
	   
	    HTMLElement.prototype.css=function(cssList,verify)
           {  
		        var htmlElement = this;
            
                if(typeof(cssList) == "object")
				{
					var css = cssList;
					var value = null;
					
					for(var p in css)
					{  
						value = css[p];
						if(verify) 
						{
							p = htmlElement.cssPropExists(p);
						    p = render.PropToCss(p);
						}
						htmlElement.style[p] = value;				
					} 
				}
				
                return htmlElement;
           }
	   
	}
)();