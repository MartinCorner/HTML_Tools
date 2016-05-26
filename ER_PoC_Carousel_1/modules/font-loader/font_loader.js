/**
 * font_loader.js
 * cached fonts are used in presentation
 *
 * @author  Sergey Zvyahelskiy
 */
(function () {
	function FontLoader(){
		var hrefTypography = "code/css/typography.css",
			cssRuleList = document.styleSheets[0].cssRules, CSSImportRule, index, li, i, ruleList, ul = document.createElement("ul"), fontName, fontWeight, liStyle;
		for (index in cssRuleList){
			CSSImportRule = cssRuleList[index];
			if (CSSImportRule.href === hrefTypography) {
				ruleList = CSSImportRule.styleSheet.cssRules;
				for (i in ruleList) {
					if (ruleList[i] instanceof CSSFontFaceRule){
						fontName = ruleList[i].style.fontFamily;
						fontWeight = ruleList[i].style.fontWeight;
						fontStyle = ruleList[i].style.fontStyle;
						li = document.createElement("li");
						liStyle = li.style;
						li.setAttribute("file", ruleList[i].cssText);
						liStyle.fontFamily = fontName;
						liStyle.fontWeight = fontWeight;
						liStyle.fontStyle = fontStyle;
						li.innerText = fontName;
						ul.appendChild(li);
					}
				}
				document.body.appendChild(ul);
				setTimeout(function(){
					document.body.removeChild(ul);
/*					ul.style.background = "#FFF";
					ul.style.position = "absolute";
					ul.style.left = "0";
					ul.style.right = "0";*/
				},1);
				return;
			}
		}
	}
	document.addEventListener("DOMContentLoaded", function () {
		FontLoader();
	}, false);
}());