

// helper functions for including js and css in document head
window.includeJavaScript = function(jsFile)
	{
		document.write('<script src="' + jsFile + '"></script>'); 
	};

window.includeCss = function (cssFile)
	{
		document.write('<link rel="stylesheet" href="' + cssFile + '"/>');
	};

// you can add your others in here.
includeJavaScript("./codes/veeva.js");

includeJavaScript("./slides/0/page-0.js");
includeCss("./slides/0/page-0.css");

includeJavaScript("./slides/1/page-1.js");
includeCss("./slides/1/page-1.css");

includeJavaScript("./slides/2/page-2.js");
includeCss("./slides/2/page-2.css");
//
//includeJavaScript("./slides/3/page-3.js");
//includeCss("./slides/3/page-3.css");
//
//includeJavaScript("./slides/4/page-4.js");
//includeCss("./slides/4/page-4.css");
//
//includeJavaScript("./slides/5/page-5.js");
//includeCss("./slides/5/page-5.css");
//
//includeJavaScript("./slides/6/page-6.js");
//includeCss("./slides/6/page-6.css");
//
//includeJavaScript("./slides/7/page-7.js");
//includeCss("./slides/7/page-7.css");
//
//includeJavaScript("./slides/8/page-8.js");
//includeCss("./slides/8/page-8.css");

//includeJavaScript("./slides/9/page-9.js");
//includeCss("./slides/9/page-9.css");

//includeJavaScript("./slides/10/page-10.js");
//includeCss("./slides/10/page-10.css");
//
//includeJavaScript("./slides/11/page-11.js");
//includeCss("./slides/11/page-11.css");
//
//includeJavaScript("./slides/12/page-12.js");
//includeCss("./slides/12/page-12.css");
//
//includeJavaScript("./slides/13/page-13.js");
//includeCss("./slides/13/page-13.css");
//
//includeJavaScript("./slides/14/page-14.js");
//includeCss("./slides/14/page-14.css");
//
//includeJavaScript("./slides/15/page-15.js");
//includeCss("./slides/15/page-15.css");
//
//includeJavaScript("./slides/16/page-16.js");
//includeCss("./slides/16/page-16.css");
//
//includeJavaScript("./slides/17/page-17.js");
//includeCss("./slides/17/page-17.css");
//
//includeJavaScript("./slides/18/page-18.js");
//includeCss("./slides/18/page-18.css");
//
//includeJavaScript("./slides/19/page-19.js");
//includeCss("./slides/19/page-19.css");
//
//includeJavaScript("./slides/20/page-20.js");
//includeCss("./slides/20/page-20.css");
//
//includeJavaScript("./slides/21/page-21.js");
//includeCss("./slides/21/page-21.css");
//
//includeJavaScript("./slides/20/page-20.js");
//includeCss("./slides/20/page-20.css");
//
//includeJavaScript("./slides/22/page-22.js");
//includeCss("./slides/22/page-22.css");
//
//includeJavaScript("./slides/23/page-23.js");
//includeCss("./slides/23/page-23.css");
//
//includeJavaScript("./slides/24/page-24.js");
//includeCss("./slides/24/page-24.css");
//
//includeJavaScript("./slides/25/page-25.js");
//includeCss("./slides/25/page-25.css");
// initilaize should be run in the final.
document.write('<script>initilaize();</script>'); 