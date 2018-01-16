/*
* name: 所有dom操作的简单方法
* author: wukangjun
* time: 2017.07.10
*/
var slice = Array.prototype.slice;
var myJq = {};

var trim = function(string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
}
// 目前只支持标签查找--find
myJq.find = function(ele, name){
  var item;
  if(ele instanceof HTMLElement){
    item = ele
  }else{
    item = document.querySelector(ele)
  }
	var arr = [];
    function done(node){
      if(node.children.length!= 0){
        var childrenNodes=node.children;
        for(var index=0,len=childrenNodes.length; index<len; index++){
        	if((childrenNodes[index].nodeName).toLowerCase() == name){
        		arr.push(childrenNodes[index])
        	}         
          	done(childrenNodes[index]);
        }
      }
    }
    done(item)
    return arr;
}

// 绑定事件 -- on
myJq.on = function(element, event, handler){
  if (document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
}()

// 解除绑定 --off
myJq.off = function(element, event, handler){
  if (document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
}()

// 是否有当前类名
myJq.hasClass = function(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
}

//添加类名
myJq.addClass = function(el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || '').split(' ');

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!this.hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};

//移除类名
myJq.removeClass = function(el, cls){
  if (!el || !cls) return;
  var classes = cls.split(' ');
  var curClass = ' ' + el.className + ' ';

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (this.hasClass(el, clsName)){
        curClass = curClass.replace(' ' + clsName + ' ', ' ');
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
};

//添加属性
myJq.attr = function(el, attrName, value){
  if(value){
    el.setAttribute(attrName, value)
  }else{
    return el.getAttribute(attrName)
  }
}

//移除属性
myJq.removeAttr = function(el, attrName){
  el.removeAttribute(attrName)
}

//显示
myJq.show = function(el, type){
  var type = type || 'block';
  el.style.display = type;
  return this
}

// 隐藏
myJq.hide = function(el){
  el.style.display = 'none'
  return this
}

// 设置样式
myJq.css = function(el, name, config){
  if(el){
    if(arguments.length > 2){
      el.style[name] = config;
    }else{
      return el.style[name]
    }
  }
} 

myJq.delegation = event => {
  let target = event.target;
  while(target && target.tagName.toUpperCase() !== 'HTML'){
    if(target.tagName.toUpperCase() === 'LI'){
      return target;
    }
    target = target.parentNode;
  }
  return null;
}

export default myJq