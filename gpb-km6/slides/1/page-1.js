(function (){
    
    var title = "",
        reference = "<span>References: 1.</span> Beier J et al. COPD 2013; 10: 511–522. <span>2.</span> SPIRIVA Approved Product Information (13 February 2013). <span>3.</span> Decramer ML et al. Lancet Resp Med 2013; 1: 524–533.",
        studyDesign = "<p>A randomised, double-blind, Phase IIIb study that compared 24-hour bronchodilatory efficacy of Bretaris (400 μg twice daily, morning and evening) vs placebo and SPIRIVA (18 μg once daily) in patients with moderate-to-severe COPD (n=414; FEV<little2>1</little2> ≥30% and <80%). Primary endpoint was change from baseline in FEV<little2>1</little2> AUC for the 24-hour period post-morning dose (FEV<little2>1</little2> AUC<little2>0–24</little2>) at week 6. Data reported as least squares mean differences from baseline (ANCOVA).<little>1</little><br><br>Bretaris<little>®</little> Genuair<little>®</little> is a registered trademark of A. Menarini Australia Pty Ltd.</p>";
    
    app.slides[1] = 
    {
        id: 1,
        
        node: undefined,

        onCreated: function (box)
            {
                requestContent("./slides/1/1.html", this,
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
                this.node.id = "page-1";
                app.references.replaceContent(reference);
                app.study_design.replaceContent(studyDesign);
                
                window.addPressListener($("#page-1 > #study-design-button"), 
                {
                    "onPressEnd": app.study_design.push
                });
                window.addPressListener($("#page-1 > #button"), 
                {
                    "onPressEnd": showChart
                });
                
                var showChartNum = true;
                function showChart(){
                    if(showChartNum){
                        showChart1();
                    }else{
                        showChart2();
                    }
                }
                    
                function showChart1(){
                    $('#button').style.pointerEvents = "none";
                    $('#page-1 #text4-a').style.opacity = "1";
                    $('#page-1 #text4-b').style.opacity = "0";
                    $('#page-1 #title').style.opacity = "1";
                    $('#page-1 #title-b').style.opacity = "0";
                    $('#page-1 #text2').style.opacity = "1";
                    $('#page-1 #chart-bg-a').style.webkitTransform = "translateX(-545px)";
                    $('#page-1 #chart-a').style.webkitTransform = "translateX(-545px)";
                    $('#page-1 #chart-bg-b').style.webkitTransform = "translateX(0px)";
                    $('#page-1 #chart-b').style.webkitTransform = "translateX(0px)";
                    window.setTimeout(function(){
                        ami2();   
                    },1200);
                    showChartNum = false;
                };
                function showChart2(){
                    $('#button').style.pointerEvents = "none";
                    $('#page-1 #text4-a').style.opacity = "0";
                    $('#page-1 #text4-b').style.opacity = "1";
                    $('#page-1 #title').style.opacity = "0";
                    $('#page-1 #title-b').style.opacity = "1";
                    $('#page-1 #text2').style.opacity = "0";
                    $('#page-1 #chart-bg-a').style.webkitTransform = "translateX(0px)";
                    $('#page-1 #chart-a').style.webkitTransform = "translateX(0px)";
                    $('#page-1 #chart-bg-b').style.webkitTransform = "translateX(545px)";
                    $('#page-1 #chart-b').style.webkitTransform = "translateX(545px)";
                    window.setTimeout(function(){
                        ami1();   
                    },1200);
                    showChartNum = true;
                };
                
                function ami1(){
                    $('#page-1 #chart-a').style.webkitTransition = "-webkit-transform 1s, width 1.5s";
                    $('#page-1 #chart-a').style.width = "478px"; 
                    window.setTimeout(function(){                        
                        $('#page-1 #chart-b').style.webkitTransition = "-webkit-transform 1s";
                        $('#page-1 #chart-b').style.width = "0px";
                        window.setTimeout(function(){
                            $('#button').style.pointerEvents = "";
                        },200);
                    },1200);
                };
                function ami2(){
                    $('#page-1 #chart-b').style.webkitTransition = "-webkit-transform 1s, width 1.5s";
                    $('#page-1 #chart-b').style.width = "478px"; 
                    window.setTimeout(function(){
                        $('#page-1 #chart-a').style.webkitTransition = "-webkit-transform 1s";
                        $('#page-1 #chart-a').style.width = "0px";
                        window.setTimeout(function(){
                            $('#button').style.pointerEvents = "";
                        },200);
                    },1200);
                };
                
                window.setTimeout(function(){
                    showChart1(); 
                    window.setTimeout(function(){
                    $('#page-1 #chart-bg-a').style.webkitTransition = "-webkit-transform 1s";
                    $('#page-1 #chart-a').style.webkitTransition = "-webkit-transform 1s";
                    $('#page-1 #chart-bg-b').style.webkitTransition = "-webkit-transform 1s";
                    $('#page-1 #chart-b').style.webkitTransition = "-webkit-transform 1s";  
                    },800); 
                },800);
                
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