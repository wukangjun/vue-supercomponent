<template>
	<div class="cv-scrollbar" ref="scrollbar">
		<div 
        :style="{width: width}"
        class="ngscroll-content-container cv-scrollbar-content" 
        ref="wrapContent">
		 	<slot></slot>
		</div>
		<div :style="styleX.scrollbarContainer" ref="scrollbarContentX">
		 	<div :style="styleX.scrollbar" ref="scrollbarX"></div>
		</div>
		<div :style="styleY.scrollbarContainer" ref="scrollbarContentY">
		 	<div :style="styleY.scrollbar" ref="scrollbarY"></div>
		</div>
	</div>
</template>

<script>
	import {service, myJq} from '@/utils'
	export default{
		name: 'cvScrollbar',
		componentName: 'cvScrollbar',
		props: {
			scrollbarConfig: {},
            toBottom: {
                type: Function
            },
            top: {
                default: 0
            },
            width: {
                default: '100%'
            }
		},
		data(){
			return{
				containerElement: null, 
		        contentElement: null, 
		        config: null, 
		        scrollbarMargin: null, 
		        scrollbarHoverMargin: null,
		        defaultConfig:{
			        dragSpeed: 1, //default browser delta value is 120 or -120
			        autoResize: false, // if need auto resize, default false
			        show: false, // if need show when mouse not enter the container element which
			        scrollbar: {
			            width: 6, //scrollbar width
			            hoverWidth: 8, //scrollbar width when the mouse hover on it
			            color: '#e0e5eb' //scrollbar background color
			        },
			        scrollbarContainer: {
			            width: 12, //scrollbarContainer width
			            color: '#e0e5eb' // scrollbarContainer background
			        }
			    },
			    styleX:{
			    	scrollbarContainer: {
                        position: 'absolute',
                        width: '100%',
                        transition: 'background .3s ease-in-out',
                        'border-radius': '4px'
                    },
                    scrollbar: {
                        position: 'absolute',
                        cursor: 'default',
                        opacity: 0,
                        transition: 'opacity .3s ease-in-out, border-radius .1s linear, width .1s linear, right .1s linear',
                        background: '#e0e5eb',
                        'border-radius': '4px'
                    }
			    },
			    styleY:{
			    	scrollbarContainer: {
                        position: 'absolute',
                        width: "",
                        top: 0,
                        right: 0,
                        transition: 'background .3s ease-in-out',
                        'border-radius': '4px'
                    },
                    scrollbar: {
                        position: 'absolute',
                        width: "",
                        right: "",
                        cursor: 'default',
                        opacity: 0,
                        transition: 'opacity .3s ease-in-out, border-radius .1s linear, width .1s linear, right .1s linear',
                        background: "",
                        'border-radius': '4px'
                    }
			    }
			}
		},
		methods: {
            // 获取容器高度
            getContainerHeight(){
                return this.containerElement.offsetHeight;
            },
            getContentHeight(){
                return this.contentElement.offsetHeight;
            },
            scrollTo(top) {
                var top = Math.min(0, Math.max(top, this.getContainerHeight() - this.getContentHeight()));
                var scrollbarTop = -top/this.getContentHeight()*this.getContainerHeight() + this.scrollbarMargin;
                myJq.css(this.contentElement, 'margin-top', top + 'px');
                myJq.css(this.$refs['scrollbarY'], 'top', scrollbarTop + 'px');
            },
            scroll(distance) {
                var newTop = parseInt(myJq.css(this.contentElement, 'margin-top'), 10) + distance;
                this.scrollTo(newTop);
            },
			init(element){
				this.containerElement = element;
				this.config = service.extend(this.defaultConfig, this.scrollbarConfig || {});
				this.contentElement = this.$refs['wrapContent'];
				this.scrollbarMargin = (this.config.scrollbarContainer.width - this.config.scrollbar.width) / 2;
				this.scrollbarHoverMargin = (this.config.scrollbarContainer.width - this.config.scrollbar.hoverWidth) / 2;
				service.extend(this, {
					winEl: window,
			        /**
			         * get the element which need the directive of ngscrollbar
			         * @return {jqlite object}
			         */
			        getContainerElement: function() {
			            return this.containerElement;
			        },
			        /**
			         * the element which transclude the true content
			         */
			        getContentElement: function() {
			            return this.contentElement;
			        },
			        /**
			         * get the config
			         * @return {object}
			         */
			        getConfig: function() {
			            return this.config;
			        },
			        /**
			         * get the scrollbarMargin
			         * @return {number}
			         */
			        getScrollbarMargin: function(){
			            return this.scrollbarMargin;
			        },
			        /**
			         * get the scrollbarHoverMargin
			         * @return {number}
			         */
			        getScrollbarHoverMargin: function() {
			            return this.scrollbarHoverMargin;
			        }
				})
			},
			xScrollbar(){
				var config = this.getConfig(),
                    docEl = document,
                    containerElement = this.getContainerElement(),
                    containerDom = containerElement,
                    contentElement = this.getContentElement(), //the container of content
                    scrollbar = this.$refs['scrollbarX'],
                    scrollbarMargin = this.getScrollbarMargin(),
                    scrollbarHoverMargin = this.getScrollbarHoverMargin();

                this.styleX.scrollbar.background = config.scrollbar.color;
                this.styleX.scrollbarContainer['border-radius'] = config.scrollbarContainer.width / 2 + 'px';
                this.styleX.scrollbarContainer['border-radius'] = config.scrollbar.width / 2 + 'px';

                myJq.css(this.$refs['scrollbarContentX'], 
                	'height', this.config.scrollbarContainer.width + 'px');
                myJq.css(this.$refs['scrollbarContentX'], 'bottom', 0);
                myJq.css(this.$refs['scrollbarContentX'], 'left', 0);
                myJq.css(scrollbar, 'bottom', 0 + 'px');
                myJq.css(scrollbar, 'height', config.scrollbar.width + 'px');

                var getContentWidth = () =>{
                    return contentElement.offsetWidth;
                };

                var getContainerWidth = () =>{
                    return containerDom.offsetWidth;
                };

                var getScrollbarWidth = () =>{
                    return Math.pow(getContainerWidth(), 2) / getContentWidth() - scrollbarMargin * 2;
                };

                var showScrollbar = () =>{
                	myJq.css(scrollbar, 'opacity', 1)
                };

                var hideScrollbar = () =>{
                	myJq.css(scrollbar, 'opacity', 0)
                };

                var isOverflow = () => {
                    return getContentWidth() > getContainerWidth();
                };

                var reset = () => {
                    var oldMarginLeft = parseInt(myJq.css(contentElement, 'margin-left'), 10);

                    myJq.css(contentElement, 'margin-left', '0px');
                    if (isOverflow()) {
                    	myJq.css(this.$refs['scrollbarContentX'], 'display', 'block');
                    	myJq.css(scrollbar, 'width',  getScrollbarWidth() + 'px');
                        scrollTo(oldMarginLeft);
                        if (config.show) {
                            showScrollbar();
                        }
                    } else {
                       myJq.css(this.$refs['scrollbarContentX'], 'display', 'none');
                    }
                };

                var scrollTo = (left) =>{
                    left = Math.min(0, Math.max(left, getContainerWidth() - getContentWidth()));
                    myJq.css(contentElement, 'margin-left', left + 'px');
                    myJq.css(scrollbar, 'left', -left/getContentWidth()*getContainerWidth() + scrollbarMargin + 'px')
                };

                var scroll = (distance) =>{
                    var left = parseInt(myJq.css(contentElement, 'margin-left'), 10) + distance;
                    scrollTo(left);
                };

                myJq.on(this.$refs['scrollbarContentX', 'mouseenter', function(){
                	myJq.css(this.$refs['scrollbarContentX'], 'background', config.scrollbarContainer.color);
                	myJq.css(scrollbar, 'height', config.scrollbar.hoverWidth + 'px');
                	myJq.css(scrollbar, 'top', scrollbarHoverMargin + 'px');
                	myJq.css(scrollbar, 'border-radius', config.scrollbar.hoverWidth / 2 + 'px');
                }]);

                myJq.on(this.$refs['scrollbarContentX', 'mouseleave', function(){
                	myJq.css(this.$refs['scrollbarContentX'], 'background', none);
                	myJq.css(scrollbar, 'height', config.scrollbar.width + 'px');
                	myJq.css(scrollbar, 'top', scrollbarMargin + 'px');
                	myJq.css(scrollbar, 'border-radius', config.scrollbar.width / 2 + 'px');
                }]);

                var scrollbarMousedown = false,
                    axisX,
                    mouseInElement = false;
                if (!config.show) {
                	myJq.on(containerElement, 'mouseenter', function(){
                		mouseInElement = true;   
                        reset();                    
                        showScrollbar();
                	});
                	myJq.on(containerElement, 'mouseleave', function(){
                		mouseInElement = false;
                        if (scrollbarMousedown) {
                            return;
                        }
                        hideScrollbar();
                	})
                }
                myJq.on(scrollbar, 'mousedown', (event)=>{
                	this.preventDefault(event);
                	scrollbarMousedown = true;
                    axisX = event.screenX;
                    myJq.on(document, 'mouseup', ()=>{
                    	scrollbarMousedown = false;
                        if (!config.show && !mouseInElement) {
                            hideScrollbar();
                        }
                        //myJq.off(document, 'mouseup', arguments.callee)
                    })
                });
                myJq.on(document, 'mousemove', (event)=>{
                	if(scrollbarMousedown) {
                        this.preventDefault(event);
                        scroll(-(event.screenX - axisX) * config.dragSpeed * getContentWidth() / getContainerWidth());
                        axisX = event.screenX;
                    }
                });
                setTimeout(()=>{
                	reset();
                    if (!!document.createStyleSheet) { //if the browser is ie browser
                    	myJq.on(contentElement, 'DOMNodeInserted', rest);
                    	myJq.on(contentElement, 'DOMNodeRemoved', rest);
                    }else {
                        var observer = new MutationObserver((mutations)=>{                           
                            if (mutations.length) {
                                reset();
                            }
                        });
                        observer.observe(contentElement, {
                            childList:true, 
                            subtree: true,
                            attributesFilter: ['class']
                        });
                    }
                }, 5);
                if (config.autoResize) {
                  // Closure to guard against leaking variables.
                  (function () {
                    var redrawTimer;
                    myJq.on(window, 'resize', function(e){
                    	if (redrawTimer) {
                        clearTimeout(redrawTimer);
                      }
                      redrawTimer = setTimeout(function () {
                        redrawTimer = null;
                        reset();
                      }, 50);
                    })
                  })();
                }
			},
			yScrollbar(){
				var config = this.getConfig(),
                    minBarHeight = 10,
                    docEl = document,
                    containerElement = this.getContainerElement(),
                    contentElement = this.getContentElement(),
                    scrollbar = this.$refs['scrollbarY'],
                    scrollbarMargin = this.getScrollbarMargin(),
                    scrollbarHoverMargin = this.getScrollbarHoverMargin();

                this.styleY.scrollbarContainer.width = config.scrollbarContainer.width + 'px';
                this.styleY.scrollbar.width = config.scrollbar.width + 'px';
                this.styleY.scrollbar.right = scrollbarMargin + 'px';
                this.styleY.scrollbar.background = config.scrollbar.color;
                this.styleY.scrollbarContainer['border-radius'] = config.scrollbarContainer.width / 2 + 'px';
                this.styleY.scrollbar['border-radius'] = config.scrollbar.width / 2 + 'px';

                var getContentHeight = function() {
                    return contentElement.offsetHeight;
                };

                var getContainerHeight = function() {
                    return containerElement.offsetHeight;
                };

                var getScrollbarHeight = function() {
                    var height = Math.pow(getContainerHeight(), 2) / getContentHeight() - scrollbarMargin*2;
                    return Math.max(height, minBarHeight);
                };

                var isOverflow = function() {
                    return getContentHeight() > getContainerHeight();
                };

                var hideScrollbar = function() {
                    myJq.css(scrollbar, 'opacity', 0)
                };

                var showScrollbar = function() {
                    myJq.css(scrollbar, 'opacity', 1)
                };

                var reset = () =>{             	
                    var oldMarginTop = parseInt(myJq.css(contentElement, 'margin-top'), 10);
                    myJq.css(contentElement, 'margin-top', '0px'); // this is for the element which has the attribute of max-height
                    if (isOverflow()) {                    	
                        myJq.css(this.$refs['scrollbarContentY'], 'display', 'block');
                        myJq.css(scrollbar, 'height', getScrollbarHeight() + 'px');
                        scrollTo(oldMarginTop);
                        if (config.show) {
                            showScrollbar();
                        }
                    } else {
                        myJq.css(this.$refs['scrollbarContentY'], 'display', 'none');
                    }
                };

                var scrollTo = (top) =>{
                    var top = Math.min(0, Math.max(top, getContainerHeight() - getContentHeight()));
                    var scrollbarTop = -top/getContentHeight()*getContainerHeight() + scrollbarMargin;
                    myJq.css(contentElement, 'margin-top', top + 'px');
                    myJq.css(scrollbar, 'top', scrollbarTop + 'px');
                    return scrollbarTop;
                };

                var scroll = (distance) =>{
                    var newTop = parseInt(myJq.css(contentElement, 'margin-top'), 10) + distance;
                    var top = scrollTo(newTop);
                    this.$emit('vertical', newTop);
                    if((Math.abs(newTop) + getContainerHeight()) >= getContentHeight()){
                        myJq.css(scrollbar, 'top', (top - minBarHeight) + 'px');
                        if(typeof this.toBottom !== 'undefined'){                            
                            this.toBottom();
                        }
                    }
                };

                myJq.on(containerElement, 'mousewheel', (event)=>{
                	if (!isOverflow()) {
                        return;
                    }
                    this.preventDefault(event);
                    if (event.originalEvent !== undefined) {
                        event = event.originalEvent;
                    }
                    scroll(event.wheelDeltaY || event.wheelDelta);
                });

                if(window.navigator.userAgent.toLowerCase().indexOf('firefox') >= 0) {
                	myJq.on(containerElement, 'wheel', (event)=>{
                		if (!isOverflow()) {
                            return;
                        }
                        this.preventDefault(event);
                        if (event.originalEvent !== undefined) {
                            event = event.originalEvent;
                        }
                        scroll(-event.deltaY * 40);// the ff delta value is 3 or -3 when scroll and the chrome or ie is -120 or 120, so it must multiply by 40
                	})
                }

                myJq.on(this.$refs['scrollbarContentY'], 'mouseenter', ()=>{
                	myJq.css(this.$refs['scrollbarContentY'], 'background', config.scrollbarContainer.color);
                	myJq.css(scrollbar, 'width', config.scrollbar.hoverWidth + 'px');
                	myJq.css(scrollbar, 'right', scrollbarHoverMargin + 'px');
                	myJq.css(scrollbar, 'border-radius', config.scrollbar.hoverWidth / 2 + 'px');
                });
                myJq.on(this.$refs['scrollbarContentY'], 'mouseleave', ()=>{
                	myJq.css(this.$refs['scrollbarContentY'], 'background', 'none');
                	myJq.css(scrollbar, 'width', config.scrollbar.width + 'px');
                	myJq.css(scrollbar, 'right', scrollbarMargin + 'px');
                	myJq.css(scrollbar, 'border-radius', config.scrollbar.width / 2 + 'px');
                });

                var scrollbarMousedown = false,
                    axisY,
                    mouseInElement = false;

                if (!config.show) {
                	myJq.on(containerElement, 'mouseenter', ()=>{
                		mouseInElement = true;
                        reset();
                        showScrollbar();
                	})
                	myJq.on(containerElement, 'mouseleave', ()=>{
                		mouseInElement = false;
                        if (scrollbarMousedown) {
                            return;
                        }
                        hideScrollbar();
                	})
                }
                myJq.on(scrollbar, 'mousedown', (event)=>{
                	this.preventDefault(event);
                    axisY = event.screenY;
                    scrollbarMousedown = true;
                    myJq.on(document, 'mouseup', ()=>{
                    	scrollbarMousedown = false;
                        if (!config.show && !mouseInElement) {
                            hideScrollbar();
                        }
                        //myJq.on(document, 'mouseup', arguments.callee);
                    })
                });
                myJq.on(document, 'mousemove', ()=>{
                	if(scrollbarMousedown) {
                       this.preventDefault(event);
                        scroll(-(event.screenY - axisY) * config.dragSpeed * getContentHeight() / getContainerHeight());
                        axisY = event.screenY;
                    }
                });
                setTimeout(()=>{
                	reset();
                    if (!!document.createStyleSheet) { //if the browser is ie browser
                        myJq.on(contentElement, 'DOMNodeInserted', function(){
                            reset();
                        });                       
                    	myJq.on(contentElement, 'DOMNodeRemoved', function(){
                            reset();
                        });
                    }else {
                        var observer = new MutationObserver((mutations)=>{
                            if (mutations.length) {
                                reset();
                            }
                        });
                        observer.observe(contentElement, {childList:true, subtree: true});
                    }
                }, 50);
                if (config.autoResize) {
                  // Closure to guard against leaking variables.
                  (function () {
                    var redrawTimer;
                    myJq.on(window, 'resize', (e)=>{
                    	if (redrawTimer) {
                        clearTimeout(redrawTimer);
                      }
                      redrawTimer = setTimeout( _ =>{
                        redrawTimer = null;
                        reset();
                      }, 5);
                    })
                  })();
                }
			},
            preventDefault(event){
                document.all ? window.event.returnValue = false : event.preventDefault()
            }
		},
        watch:{
            top(newVal){
                newVal > 0 && this.scrollTo(-newVal);
            }
        },
		mounted(){
			this.init(this.$refs['scrollbar']);
            this.xScrollbar();   
            this.yScrollbar();          
		}
	}
</script>

<style lang="scss" scoped>
	.cv-scrollbar{
		position:relative;
		overflow: hidden;
		.cv-scrollbar-content{	
			display:inline-block;
			margin-top:0;
			margin-left:0;
		}
	}
</style>