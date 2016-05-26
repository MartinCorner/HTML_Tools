(function (){
    
    var title = "",
        reference = "<span>References: 1.</span> Wedzicha JA et al. Lancet Respir Med 2013; 1:199–209. <span>2.</span> SPIRIVA Approved Product Information (13 February 2013). <span>3.</span> Decramer ML et al. Lancet Resp Med 2013; 1: 524–533.",
        studyDesign = "<p>A 64-week study of 2224 patients with severe and very severe COPD (GOLD stages III–IV) and one or more moderate COPD exacerbations in the past year) randomly assigned (1:1:1) to once-daily QVA149 (fixed-dose combination of indacaterol 110 mcg and glycopyrronium 50 mcg), glycopyrronium (50 mcg) or tiotropium (18 mcg). Assignment to QVA149 and glycopyrronium was double-blinded; tiotropium was open-label.<little>1</little><br/><br>The primary objective was to demonstrate superiority of QVA149 compared with glycopyrronium for the rate of moderate or severe COPD exacerbations during the treatment period. The key secondary objective was to demonstrate superiority of QVA149 compared with tiotropium with respect to the rate of moderate to severe COPD exacerbations during the treatment period.<little>1</little><br/><br>The study met its primary endpoint, the dual LABA/LAMA bronchodilator QVA149 significantly reduced the rate of moderate to severe exacerbations by 12% compared with the LAMA glycopyrronium.<little>1</little></p>",
    tapAmiNum = 0;
    
    app.slides[2] = 
    {
        id: 2,
        
        node: undefined,

        onCreated: function (box)
            {
                requestContent("./slides/2/2.html", this,
                    function (text)
                    {
                        box.innerHTML = text;
                    });
                
            },
        
        oninited: function ()
        {
        },

        onVisibled: function ()
            {
                this.node.id = "page-2";
                app.references.replaceContent(reference);
                app.study_design.replaceContent(studyDesign);
                
                            $('#page-2 > #chart > #chart-1').style.height = "0px";
                            $('#page-2 > #chart > #chart-2').style.height = "0px";
                            $('#page-2 > #chart > #chart-2').style.opacity = "1";
                            $('#page-2 > #chart > #chart-3').style.height = "0px";
                            $('#page-2 > #chart > #chart-a').style.opacity = "0";
                            $('#page-2 > #chart > #chart-b').style.opacity = "0";
                
                var tapAmi = function(){
                    switch (tapAmiNum){
                        case 0:
                            $('#page-2 > #chart').style.pointerEvents = 'none';
                            $('#page-2 > #chart > #chart-1').style.webkitTransition = "height 0.7s";
                            $('#page-2 > #chart > #chart-2').style.webkitTransition = "opacity 0.7s, height 0.7s";
                            $('#page-2 > #chart > #chart-3').style.webkitTransition = "height 0.7s";
                            $('#page-2 > #chart > #chart-a').style.webkitTransition = "opacity 0.7s";
                            $('#page-2 > #chart > #chart-b').style.webkitTransition = "opacity 0.7s";
                            window.setTimeout(function(){
                                $('#page-2 > #chart > #chart-1').style.height = "81px";
                                $('#page-2 > #chart > #chart-2').style.height = "94px";
                                window.setTimeout(function(){
                                    $('#page-2 > #chart > #chart-a').style.opacity = "1";  
                                    tapAmiNum = 1;
                                    $('#page-2 > #chart').style.pointerEvents = '';                                  
                                }, 800);
                            }, 20);
                        break;
                        case 1:
                            $('#page-2 > #chart').style.pointerEvents = 'none';
                            window.setTimeout(function(){
                                $('#page-2 > #chart > #chart-2').style.opacity = "0";
                                $('#page-2 > #chart > #chart-a').style.opacity = "0";   
                                window.setTimeout(function(){
                                    $('#page-2 > #chart > #chart-2').style.height = "0px";                                 
                                    window.setTimeout(function(){
                                        $('#page-2 > #chart > #chart-3').style.height = "91px";
                                        window.setTimeout(function(){
                                            $('#page-2 > #chart > #chart-b').style.opacity = "1";   
                                            tapAmiNum = 2;
                                            $('#page-2 > #chart').style.pointerEvents = '';                                 
                                        }, 600);
                                    }, 100);
                                }, 600);
                            }, 20);
                        break;
                        case 2:
                            $('#page-2 > #chart').style.pointerEvents = 'none';
                            window.setTimeout(function(){
                                $('#page-2 > #chart > #chart-2').style.opacity = "1";
                                window.setTimeout(function(){
                                    $('#page-2 > #chart > #chart-2').style.height = "94px";
                                    window.setTimeout(function(){
                                        $('#page-2 > #chart > #chart-a').style.opacity = "1";
                                        tapAmiNum = 3;
                                        $('#page-2 > #chart').style.pointerEvents = '';
                                    }, 600);
                                }, 20);
                            }, 20);
                        break;
                        case 3:
                            $('#page-2 > #chart > #chart-2').style.opacity = "1";
                            $('#page-2 > #chart > #chart-a').style.opacity = "0";
                            $('#page-2 > #chart > #chart-b').style.opacity = "0";
                            window.setTimeout(function(){
                                $('#page-2 > #chart > #chart-1').style.height = "0px";
                                $('#page-2 > #chart > #chart-2').style.height = "0px";
                                $('#page-2 > #chart > #chart-3').style.height = "0px";
                                tapAmiNum = 0;
                            }, 600);
                        break;
                    }
                }
                
                window.addPressListener($("#page-2 > #chart"), 
                {
                    "onPressEnd": tapAmi
                });
                
                window.addPressListener($("#page-2 > #study-design-button"), 
                {
                    "onPressEnd": app.study_design.push
                });
            },

        onEntered: function ()
            {
                                
            },

        onLeave: function ()
            {
            },

        onHidden: function ()
            {
                this.node.id = "";
            },

        onRemoved: function ()
            {
            },
        
        onSwipeLeft: function ()
            {
//                window.slideTo(9, 6);
            },
        
        onSwipeRight: function ()
            {
//                window.slideTo(9, 10);                
            }
    }

})();