(function() {
	window['i18n'] = i18n;
	window['i18n']['get'] = get;

	window['i18n']['extra'] = extra; // 

	var defaults = {
		lang: "",
		defaultLang: "",
		filePath: "/i18n/",
		filePrefix: "i18n_",
		fileSuffix: "",
		forever: true,
		get: false, // 是否在js中使用 i18n.get("key")
		only: ['value', 'html', 'placeholder', 'title'],
		callback: function() {},
	}

	function i18n(ele, options) {

		defaults.i18nLang = null;
		defaults.$ele = document.querySelectorAll(ele);

		options = _extend(defaults, options);
		if(_getCookie('i18n_lang') != "" && _getCookie('i18n_lang') != "undefined" && _getCookie('i18n_lang') != null) {
			defaults.defaultLang = _getCookie('i18n_lang');
		} else if(options.lang == "" && defaults.defaultLang == "") {
			throw "defaultLang must not be null !";
		};

		if(options.lang != null && options.lang != "") {
			if(options.forever) {
				_setCookie('i18n_lang', options.lang);
			} else {
				_clearCookie("i18n_lang");
			}
		} else {
			options.lang = defaults.defaultLang;
		};

		var tempLang = null;
		var obj = {
			'async': true,
			'success': _success,
			'err': _err,
			'$ele': options.$ele,
			'options': options
		}
		if(options.get) {
			// 如果需要使用 i18n.get("key")
			// 改为同步
			obj.async = false;
		}
		obj.url = options.filePath + options.filePrefix + options.lang + options.fileSuffix + ".json";
		i18nLang = _getJSON(obj); // end get json 

		if(options.get) {
			// 如果需要使用 i18n.get("key")
			// 改回异步
			obj.async = true;
		}
		return window['i18n'];
	}

	function get(key) {
		if(this.i18nLang == null || JSON.stringify(i18nLang) == '{}') {
			return {}
		};
		return this.i18nLang[key];
	}

	function extra(obj) {
		if(!('ele' in obj)  || !('attr' in obj)){
			throw '参数错误，正确的JSON格式为 {"ele":"","attr":""}'
		}
		
		// document.querySelectorAll("button[title]")
		var $ele = document.querySelectorAll(obj.ele);
		$ele.forEach(function($this) {
			let key = $this.getAttribute(obj.attr);
			if(i18n.get(key) == undefined){
				return true;
			}
			$this.setAttribute(obj.attr, i18n.get(key))
		})
		
	}

	/* ==============  内部方法    =============== */
	function _extend(destination, source) {
		for(var prop in source) {
			destination[prop] = source[prop];
		}
		return destination;
	};

	function _getCookie(name) {
		var arr = document.cookie.split('; ');
		for(var i = 0; i < arr.length; i++) {
			var arr1 = arr[i].split('=');
			if(arr1[0] == name) {
				return arr1[1];
			}
		}
		return '';
	};

	function _setCookie(name, value, myDay) {
		var oDate = new Date();
		oDate.setDate(oDate.getDate() + myDay);
		document.cookie = name + '=' + value + '; expires=' + oDate;
	};

	function _clearCookie(name) {
		document.cookie = name + '=' + '' + '; expires=' + -1;
	}

	function _getJSON(obj) {
		// obj = {'async':'','url':'','success':'','err':''}
		//1.创建Ajax对象。js中,使用一个没有定义的变量会报错,使用一个没有定义的属性,是undefined。IE6下使用没有定义的XMLHttpRequest会报错,所以当做window的一个属性使用
		var xhr = null;
		if(window.XMLHttpRequest) {
			xhr = new XMLHttpRequest(); //非IE6
		} else {
			xhr = new ActiveXObject("Microsoft.XMLHTTP"); //IE6
		}
		//2.连接到服务器
		if('async' in obj && obj.async == false) {
			// 如果明确设置异步为false，则，同步操作
			xhr.open("GET", obj.url, false);
		} else {
			xhr.open("GET", obj.url, true);
		}

		//3.发送get请求
		xhr.send(null);

		if('async' in obj && obj.async == false) {
			// 如果是同步请求
			i18n.i18nLang = obj.success(xhr.responseText, obj.$ele, obj.options)
		} else {
			//4.接收返回值
			xhr.onreadystatechange = function() {
				//xhr.readyState--浏览器和服务器之间进行到哪一步了
				if(xhr.readyState == 4) { //读取完成 //读取的结果是成功
					if(xhr.status == 200) {
						i18n.i18nLang = obj.success(xhr.responseText, obj.$ele, obj.options)
					} else {
						obj.err(xhr.responseText); //对失败的原因做出处理
					}
				}
			}
		}

	};

	function _success(data, $ele, options) {
		var i18nLang = {};
		if(data != null) {
			i18nLang = data;
		}
		if(typeof(i18nLang) == 'string') {
			i18nLang = JSON.parse(i18nLang);
		}
		$ele.forEach(function($this) {
			var i18nOnly = $this.getAttribute("i18n-only");
			let i18Onlys = i18nOnly && i18nOnly.split(',') || []
			
			if(i18Onlys.length == 0){
				// 全局默认
				i18Onlys = options.only
			}
			
			// type: html、value、等属性
			i18Onlys.forEach(function(type){
				if(type.indexOf('i18n') == 0){
					return
				}
				if(type == 'html'){
					// 设置html
					if($this.innerHTML) {
						$this.innerHTML = i18nLang[$this.getAttribute("i18n")]
					}
				}else{
					if($this.getAttribute(type)) {
						$this.setAttribute(type, i18nLang[$this.getAttribute("i18n")])
					}
				}
			})
			
		})// end forEach
		options.callback();

		return i18nLang;
	};

	function _err(data) {
		throw data;
	}
})();