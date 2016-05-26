
function HKframes(name)
{ 
    var This=this;
	
    var chain = HKframes.prototype;
	var inherit = null;
	
    inherit&&inherit.apply(This, arguments);
	
	This.configCss = {};
	This.animationName = name;
	
	if(!HKframes.view)HKframes.view = {};
	HKframes.view[name] = This;
	
if(chain.Constructor)
{
	chain = null;
	inherit = null;
	return;
}

chain.Constructor=function()
{
	
	 var Extend=this;
	
	inherit&&inherit.prototype.Constructor.call(Extend);
	
	Extend.type = 'frame';
	var cssStyleSheet = document.createElement("style");
	cssStyleSheet.type = "text/css";
	document.head.appendChild(cssStyleSheet);
	
	Extend.label = cssRender.lc_label;
	
	HKframes.refresh = function()
	{
		var views = HKframes.view;
		var str = "";
		
		for(var p in views) 
		{
			str = str + views[p].toString(true) + '\n';
		}
		cssStyleSheet.textContent = str ;
		return cssStyleSheet;
	}
	
	Extend.refresh = function()
	{
		HKframes.refresh();
	}
	
	Extend.configframe = function(FrameTarget,complete)
	{
		var configCss = complete?{}:this.configCss;
		for(var p in FrameTarget) 
		{
			var css = FrameTarget[p];
			var piece = {},str = "";
			
			for(var k in css) 
			{
				str = cssStyleSheet.cssPropExists(k);
				piece[cssRender.PropToCss(str)] = css[k];
			}
			configCss[p] = piece;
			
			str = null;
		}

		this.configCss = configCss;	
	}
	
	Extend.setframe = function(FrameTarget,complete)
	{
	    var configCss = complete?{}:this.configCss ;
		
		for(var p in FrameTarget) 
		{
			var arr = FrameTarget[p].split(";");
			var css = {},prop,str = "";
			for(var i = 0; i < arr.length-1; i++) 
			{	
				prop = arr[i].split(":");
				str = cssStyleSheet.cssPropExists(prop[0]);
				css[cssRender.PropToCss(str)] = prop[1]||"";
			}
			
			configCss[p] = css;
			str = null;
		}

		this.configCss = configCss;
		
	}
	
	Extend.toString = function(uncompress)
	{
		var Instance = this, config = Instance.configCss;
		var str = '@'+Extend.label+'keyframes ' + Instance.animationName + '{';
		
		for(var p in config) 
		{
			var piece = p + '{';
			var css = config[p];
			
			for(var k in css) 
			{
				piece = piece + k + ":"+ css[k] + ";";
			}
			piece = piece + '}';
			str =  str + piece;
			piece = null;
		}
        str =  str + '}';
		
		if(uncompress)
		{
			str = str.replace(/;/g, ";\n");
			str = str.replace(/\{/g, "{\n");
			str = str.replace(/\}/g, "}\n");
		}
		
		return str;
		
	}
	
	Extend.depose=function()
	{
		var Instance = this
		    configCss = this.configCss;

        delete HKframes.view[Instance.animationName];
		for (var prop in configCss)
		 {
			  delete configCss[prop];
		 }
		 configCss = null; 
		 
		for (var prop in Instance)
		 {
			  delete this[prop];
		 }
		
		//delete this;
	}	
	
};

chain.Constructor();

return ;
};

