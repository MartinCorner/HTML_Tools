(function(global){
	HTMLElement.prototype.hasClass = function (c) {
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
		return re.test(this.className);
	};
	HTMLElement.prototype.addClass = function (c) {
		if (this.hasClass(c)) {
			return this;
		}
		this.className = (this.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
		return this;
	};
	HTMLElement.prototype.removeClass = function (c) {
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
		this.className = this.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
		return this;
	};
	HTMLElement.prototype.toggleClass = function (c) {
		this.hasClass(c) ? this.removeClass(c) : this.addClass(c);
		return this;
	};
	HTMLElement.prototype.appendFirstChild = function (node) {
		this.firstChild ? this.insertBefore(node, this.firstChild) : this.appendChild(node);
	};
	HTMLElement.prototype.exchange = function(refNode) {
		var tempParentNode = refNode.parentNode,
				tempBeforeNode = refNode.nextElementSibling;
		this.parentNode.insertBefore(refNode,this);
		if (tempBeforeNode) {
			tempParentNode.insertBefore(this,tempBeforeNode);
		} else {
			tempParentNode.appendChild(this);
		}
		return refNode;
	};

	if (!Function.prototype.bind) {
		Function.prototype.bind = function (oThis) {
			if (typeof this !== "function") {
				// closest thing possible to the ECMAScript 5 internal IsCallable function
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}

			var aArgs = Array.prototype.slice.call(arguments, 1),
					fToBind = this,
					fNOP = function () {},
					fBound = function () {
						return fToBind.apply(this instanceof fNOP
								? this
								: oThis || window,
								aArgs.concat(Array.prototype.slice.call(arguments)));
					};

			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();

			return fBound;
		};
	}

	var extend = function(Child, Parent) {
		var F = function() { }
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
		Child.superclass = Parent.prototype;
		if(Parent.prototype.constructor==Object.prototype.constructor){
			Parent.prototype.constructor = Parent;
		}
	}

	if (!Array.prototype.reduce){
		Array.prototype.reduce = function(fun /*, initial*/){
			var len = this.length;
			if (typeof fun != "function")
				throw new TypeError();

			// no value to return if no initial value and an empty array
			if (len == 0 && arguments.length == 1)
				throw new TypeError();

			var i = 0;
			if (arguments.length >= 2){
				var rv = arguments[1];
			}
			else{
				do{
					if (i in this){
						rv = this[i++];
						break;
					}

					// if array contains no values, no initial value to return
					if (++i >= len)
						throw new TypeError();
				}
				while (true);
			}
			for (; i < len; i++){
				if (i in this)
					rv = fun.call(null, rv, this[i], i, this);
			}

			return rv;
		};
	}

	if (!Array.prototype.remove){
		Array.prototype.remove = function(elem) {
			var index = this.indexOf(elem);

			if (index !== -1) {
				this.splice(index, 1);
			}
		};
	}

	window.augment = function(receivingClass, givingClass) {
		/* only provide certain methods */
		if (arguments[2]) {
			for (var i=2, len=arguments.length; i<len; i++) {
				receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
			}
		}
		/* provide all methods*/
		else {
			for (methodName in givingClass.prototype) {
				/* check to make sure the receiving class doesn't
				 have a method of the same name as the one currently
				 being processed */
				if (!receivingClass.prototype[methodName]) {
					receivingClass.prototype[methodName] = givingClass.prototype[methodName];
				}
			}
		}
	}
	augment(NodeList,Array,'forEach','filter','indexOf','map', 'reduce');

	if(!window.util){
		window.util = {};
	}

	window.util.createElement = function(type,attrs,childs){
		var element = document.createElement(type), key;
		if(attrs){
			for(key in attrs){
				if(attrs.hasOwnProperty(key)){
					if(key === "id" || key === "innerHTML" || key === "value" || key === "src" || key === "className"){
						element[key] = attrs[key];
					}else{
						element.setAttribute(key, attrs[key]);
					}
				}
			}
		}
		if(childs){
			if(!childs instanceof  Array){
				childs = [childs];
			}
			childs.forEach(function(el){
				element.appendChild(el);
			});
		}
		return element;
	};

	window.util.getBase64Image=function(img) {
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		var dataURL = canvas.toDataURL("image/png");
		return dataURL;//.replace(/^data:image\/(png|jpg);base64,/, "");
	};


	window.util.newLine2br = function(myString){
		var regX = /\n/gi ;
		s = new String(myString);
		s = s.replace(regX, "<br /> \n");
		return s;
	}

	function Post(url, data, callback) {
		var request = new XMLHttpRequest(),
			params = '';
		request.onreadystatechange = function () {
			callback(request);
		};
		request.open('POST', url);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		for (var property in data) {
			params += property + '=' + data[property]+'&';
		}
		if (params.length > 0){
			params = params.substr(0, params.length-1);
		}
		request.send(params);
	}
	function stripTags(input, allowed) {
		allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
		var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
				commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
		return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
			return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
		});
	}
	global.stripTags = stripTags;
	global.Post = Post;
})(window);
