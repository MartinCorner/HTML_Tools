(function (){
    
    var title = "",
        reference = "<span>References: 1.</span> Data on File. Boehringer Ingelheim. <span>2.</span> SPIRIVA Approved Product Information (13 February 2013). <span>3.</span> Bretaris Genuair Approved Product Information (25 March 2014). <span>4.</span> Seebri Breezhaler Approved Product Information (26 June 2014). <span>5.</span> National Institutes of Health. www.clinicaltrials.gov (last accessed 10 September 2014). <span>6.</span> Tashkin DP et al. N Engl J Med 2008; 359: 1543–1554. <span>7.</span> Celli B et al. Am J Respir Crit Care Med 2009; 180: 948–955. <span>8.</span> Casaburi R et al. Eur Respir J 2002; 19: 217–224. <span>9.</span> Gjaltema D et al. Abstract P3384. 23rd Ann Cong of the European Respiratory Society (ERS). September 2013. <span>10.</span> Casarosa P et al. JPET 2009; 330: 660–668. <span>11.</span> Decramer ML et al. Lancet Resp Med 2013; 1: 524–533.",
        studyDesign = "UPLIFT study: A 4-year, randomised, double-blind, placebo-controlled trial of SPIRIVA in 5993 patients with moderate-to-very severe COPD (FEV<sub>1</sub> <70% predicted). All respiratory medications, except inhaled anticholinergics, were permitted in all patients (usual care). Co-primary endpoints, the rate of decline in the mean pre-and post-bronchodilator FEV<sub>1</sub>, were not met (p>0.05).<sup>6</sup> A pre-specified analysis from the UPLIFT study investigated the effect of SPIRIVA on mortality.<sup>7</sup>";
    
    app.slides[0] = 
    {
        id: 0,
        
        node: undefined,

        onCreated: function (box)
            {
                requestContent("./slides/0/0.html", this,
                    function (text)
                    {
                        box.innerHTML = text;
                        
                        this.runtime++;
                        this.onVisibled();
                    });
                
            },
        
        oninited: function ()
        {
        },

        onVisibled: function ()
            {
                this.node.id = "page-0";
                app.references.replaceContent(reference);
                app.study_design.replaceContent(studyDesign);
                
                window.addPressListener($("#page-0 #button-spiriva"), 
                {
                    "onPressEnd": button_spiriva
                });
                
                window.addPressListener($("#page-0 #button-bretaris"), 
                {
                    "onPressEnd": button_bretaris
                });
                
                window.addPressListener($("#page-0 #button-seebri"), 
                {
                    "onPressEnd": button_seebri
                });
                
                function button_spiriva(){
                    window.gotoSlide('gpb-km7');
                };
                function button_bretaris(){
                    window.slideTo(0,1);
                };
                function button_seebri(){
                    window.slideTo(0,2);
                };
                window.addPressListener($("#page-0 > .study-design-icon"), 
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