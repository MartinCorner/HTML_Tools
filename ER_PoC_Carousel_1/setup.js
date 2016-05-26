(function (global) {
	//Creating our presentation and global namespace "app"
	global.app = new Presentation({
		type:'json',
		wrapSlides: true
	});

	// Initiate modules
	app.scroller = new Slidescroller();
	app.loader = new Loader({
		delay: 1600,
		type: "text",
		text: "加载中"
	});
	app.slidePopup = new SlidePopup('slidePopup','popupCloseBtn');
	app.menu.setCollectionList(["play","test1_collection","test2_collection","test3_collection","test4_collection","test5_collection","test6_collection","test7_collection","test8_collection","test9_collection"]);
	// Initialize presentation
	//
	app.init("start");
	app.overlay = new Overlay();
	app.navigationToolbar.init();
})(window);

// Prevent vertical bouncing of slides
document.ontouchmove = function (e) {
	e.preventDefault();
};

$(".literature-show").live("click touchstart",function(){
    $('#literature-shadow').addClass('show-refs');
    var aobj = $('#literature-shadow').find("a");
    aobj.each(function(index){
       // console.log('input %d is: %o', index, this)
        this.addEventListener("click", function(){
            var pdf = $(this).attr('data-pdf'),
            pdfFullName =$(this).attr('data-ag-editable');
            console.log(pdf);
            if(pdf){
                ag.openPDF('content/pdf/' + pdf, pdfFullName);
            }
        });
    });
})
$('.literature-close').live("click touchstart",function(){ $(this).parent().removeClass('show-refs') });


