/*
* name: 所有数据优化处理方法
* author: wukangjun
* time: 2017.07.05
*/
var toString = Object.prototype.toString;
var hasOwn = Object.prototype.hasOwnProperty;
var getProto = Object.getPrototypeOf;

var service = {};

/*
* num: 01-isType
* name: isType  判断是否符合类型
* isObject isArray isNull isUndefined isNumber isArguments isFunction isString isDate isRegExp Error
* author: wukangjun
* time: 2017-06-11
*/
service.isObject = function (obj) {
	let type = typeof obj;
	return type === 'function' || type === 'object' && !!obj;
};

service.isArray = Array.isArray || function (obj) {
	return toString.call(obj) === '[object Array]';
};

service.isNull = function (obj) {
	return obj === null;
};

service.isUndefined = function (obj) {
	return obj === void 0;
};

service.isContext = function (obj) {
	return obj === ""
};

service.isEmptyObject = function (obj) {
	var t;
	for (t in obj)
		return !1;
	return !0
};

service.isIe = function () {
	return (!!window.ActiveXObject || 'ActiveXObject' in window) ? true : false;
};

['Number', 'Arguments', 'Function', 'String', 'Date', 'RegExp', 'Error']
	.forEach(function (name) {
		service['is' + name] = function (obj) {
			return toString.call(obj) === '[object' + name + ']'
		}
	});

/*
* num: 02-throttle 
* name: 函数节流. 限制频率过多的操作
*/
service.throttle = function (fn, interval) {
	var timer,
		firstTime = true;
	return function () {
		var self = this;
		if (firstTime) {
			fn.apply(self, arguments);
			return firstTime = false;
		}
		if (timer) {
			return false;
		}
		timer = setTimeout(function () {
			clearTimeout(timer);
			timer = null;
			fn.apply(self, arguments);
		}, interval || 500);
	}
};

/*
* num: 03-chunk 
* name: 函数分块计算
*/
service.devchunk = function (array, fn, finish, count) {
	if (this.isArray(array)) {
		var obj, t;
		var len = array.length;
		var start = function () {
			for (var i = 0; i < Math.min(count || 1, array.length); i++) {
				var obj = array.shift();
				fn(obj, len);
			}
		};
		return function () {
			t = setInterval(function () {
				if (array.length === 0) {
					if (typeof finish === 'function') {
						finish(len)
					}
					return clearInterval(t);
				}
				start();
			}, 50);
		}
	} else {
		throw new Error('The first parameter must be an array')
	}
};
service.chunk = function (array, fn, finish, count) {
	var render = this.devchunk(array, fn, finish, count);
	render();
};

service.isPlainObject = function (obj) {
	var proto, Ctor;

	// Detect obvious negatives
	// Use toString instead of jQuery.type to catch host objects
	if (!obj || toString.call(obj) !== "[object Object]") {
		return false;
	}

	proto = getProto(obj);

	// Objects with no prototype (e.g., `Object.create( null )`) are plain
	if (!proto) {
		return true;
	}
	// Objects with prototype are plain iff they were constructed by a global Object function
	Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
	return typeof Ctor === "function" && hasOwn.toString.call(Ctor) === ObjectFunctionString;
};
// 对象深层覆盖
service.extend = function () {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === "boolean") {
		deep = target;

		// Skip the boolean and the target
		target = arguments[i] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if (typeof target !== "object" && !this.isFunction(target)) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if (i === length) {
		target = this;
		i--;
	}

	for (; i < length; i++) {

		// Only deal with non-null/undefined values
		if ((options = arguments[i]) != null) {

			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (this.isObject(copy) ||
					(copyIsArray = Array.isArray(copy)))) {

					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];

					} else {
						clone = src && this.isObject(src) ? src : {};
					}
					// Never move original objects, clone them
					target[name] = this.extend(deep, clone, copy);

					// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}
	return target;
};

/*
* 获取url最后一个字符串-- 后面不能带参数
*/
service.urlLastStr = function (str) {
	var detail = str.split('/');
	return detail[detail.length - 1];
};

/*
 * 把字符串转为数字类型数组
 */
service.numArr = function (str) {
	let arr = [];
	if (str) {
		if (str.indexOf(",") > -1) {
			let strArr = str.split(',');
			strArr.forEach((data) => {
				arr.push(parseInt(data));
			})
		} else {
			arr.push(parseInt(str));
		}
		return arr;
	} else {
		return arr;
	}
}
/*
 * 把字符串转为字符类型数组
 */
service.stringArr = function (str) {
	let arr = [];
	if (str) {
		if (str.indexOf(",") > -1) {
			let strArr = str.split(',');
			strArr.forEach((data) => {
				arr.push(data.toString());
			})
		} else {
			arr.push(str.toString());
		}
		return arr;
	} else {
		return arr;
	}
}
/*
* 复杂数组的去重
*/
service.unique = function (arr, keys, others) {
	var ret = [], hash = {};
	if (service.isArray(arr) && arr.length > 0) {
		for (let i = 0, len = arr.length; i < len; i++) {
			if (arguments.length == 0) {
				let item = arr[i], key = typeof (item) + item;
				if (hash[key] !== 1) {
					ret.push(item);
					hash[key] = 1;
				}
			} else {
				let item = arr[i], key = typeof (item[keys]) + item[keys] + item[others];
				if (hash[key] !== 1) {
					ret.push(item);
					hash[key] = 1;
				}
			}
		}
		return ret;
	} else {
		throw new Error('arguments is must be Array')
	}
}
/*
* 2个数组去重取反
*/
service.isUnique = function (more, less, keys) {
	var tempArray1 = [], tempArray2 = [];

	for (var i = 0; i < less.length; i++) {
		tempArray1[less[i][keys]] = true;
	}

	for (let i = 0; i < more.length; i++) {
		if (!tempArray1[more[i][keys]]) {
			tempArray2.push(more[i]);
		}
	}
	return tempArray2;
},

//获取2个数组之间的差异组成的新数组
service.diffArry=function(arr1, arr2) {  
	var newArr = [];  
	var arr3 = [];  
	for (var i=0;i<arr1.length;i++) {  
	  if(arr2.indexOf(arr1[i]) === -1)     
		arr3.push(arr1[i]);  
	}  
	 var arr4 = [];  
	for (var j=0;j<arr2.length;j++) {  
	  if(arr1.indexOf(arr2[j]) === -1)  
		arr4.push(arr2[j]);  
	}  
	 newArr = arr3.concat(arr4);  
	return newArr;  
  }  ,

// 2个数组是否添加还是减少相等
service.addRemoveUnique = function (newVal, oldVal, param) {
	let newLen = newVal.length, oldLen = oldVal.length;
	if (newLen > oldLen) {
		/* add */
		return {
			name: 'add',
			data: service.isUnique(newVal, oldVal, param)
		}
	}
	if (newLen < oldLen) {
		/* remove */
		return {
			name: 'remove',
			data: service.isUnique(oldVal, newVal, param)
		}
	}
	if (newLen == oldLen) {
		/* equal*/
		return {
			name: 'equal',
			data: service.isUnique(newVal, oldVal, param)
		}
	}
}
/*
*模板解析器
 */
service.compile = function (template) {
	var evalExpr = /<%=(.+?)%>/g;
	var expr = /<%([\s\S]+?)%>/g;
	template = template
		.replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
		.replace(expr, '`); \n $1 \n  echo(`');
	template = 'echo(`' + template + '`);';
	var script =
		`(function parse(data){
                var output = "";
                function echo(html){
                output += html;
                }
                    ${ template}
                    return output;
                })`;
	return script;
}

/*
* 
*/
service.dateTimeParse = function (dateTime) {
	var dateTimeArr = dateTime.split(' ');
	var dateArr = dateTimeArr[0].split('-');
	var timeArr = dateTimeArr[1].split(':');
	return new Date(dateArr[0], dateArr[1] - 1, dateArr[2], timeArr[0], timeArr[1], timeArr[2]);
}
service.timeParse = function (time) {
	var timeArr = time.split(':');
	return new Date(1970, 1, 1, timeArr[0], timeArr[1], timeArr[2]);
}

/*
*  url ----页面跳转方法 window.open
*/
service.winOpen = function (router) {
	var root = window.location.origin + '/';
	window.open(root + '#' + router);
}

service.winParams = function (url, params) {
	return url + urlParams(params);
	function urlParams(params) {
		var html = "?";
		if (/[?]/.test(url)) {
			html = "&";
		}
		for (var i in params) {
			html += i + '=' + encodeURIComponent(params[i]) + '&';
		}
		return html.substring(0, html.length - 1);
	}
}
service.blank =function(router){
	window.open(router);
}
/**
 *  获取表格最大高度  getAutoHeight
 * header:表头行数
 * tabs:tab页签嵌套数
 */
service.getAutoHeight = function (header, tabs) {
	var height = $('.cv-content').height()
	if (header && tabs) {
		return height - header * 40 - 30 - tabs * 45;
	} else if (header) {
		return height - header * 40 - 30;
	} else {
		return height - 40 - 30;
	}
}

export default service;