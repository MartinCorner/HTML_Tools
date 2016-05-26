(function (window) {
    
    window.isVeeva = navigator.userAgent.search(/eReach/) <= -1;

    window.gotoSlide = function(keymessage, presentation)
    {
        if (packageMap.hasOwnProperty(keymessage))
        {
            keymessage = packageMap[keymessage];
        }
        
        if (isVeeva)
        {
            document.location = 'veeva:gotoSlide(' + keymessage + (presentation ? ".zip, " + presentation + ".zip)" : ".zip)");
        }
        else 
        {   
            document.location = '../' + keymessage + '/' + keymessage + '_wrapper.html';
        }
    };
    
    window.packageMap = 
        {
            "HOME": "10_SPI_HSR_Selector_14C2",
            "STRIVERDI": "20_SPI_HSR_STRIVERDI_14C2",
            "SPIRIVA": "40_SPI_HSR_Spiriva_14C2",
            "RESPIMAT": "30_SPI_HSR_Respimat_14C2"
        };

})(window);