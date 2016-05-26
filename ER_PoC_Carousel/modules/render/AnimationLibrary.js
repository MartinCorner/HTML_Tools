(function()
{
	
	(new HKframes("flash")).configframe(
		{
			"0%,50%,100%" :
			{
			   opacity: 1
			},			
			"25%,75%" :
			{
			   opacity: 0
			}	
		}
	);
	
	(new HKframes("shake")).configframe(
		{
			"0%,100%":{
			 transform: "translateX(0)"
			},
			
			"10%,30%,50%,70%,90%":{
			 transform: "translateY(-2px)"
			},
			
			"20%,40%,60%,80%":{
			 transform: "translateY(2px)"
			}
		}
	);
	
	HKframes.refresh();
})();