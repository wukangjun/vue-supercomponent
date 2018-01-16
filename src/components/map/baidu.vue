<template>
	<div>
		<div class="mapbase" :id="id" style="z-index:0;"></div>
		<change-map v-show="isMap"></change-map>
	</div>
</template>

<script>
	import changeMap from "./changeMap.vue"
	import {service, myJq} from '../../utils'
	import MapApi from './src/baidu.map'
	export default{
		 components:{
        changeMap
    },
		name: 'baiduMap',
		props: {
			isMap:{
				default:false
			},
			id: {
				default: 'map'
			},
			zoom: {
				type: [Number],
				default: 9
			},
			center: {},
			control: {},
			// 传入的地图点信息
			point: {
				type: Object
			}
		},
		data(){
			return {
				mapApi: null,
				// 地图是否加载好了
				mapReady: false
			}
		},
		computed: {
			mapName(){
				return this.id
			}
		},
		methods: {
			mapInit(){
				this.map = new BMap.Map(this.id, {enableMapClick:false});
				var city = new BMap.LocalCity();
				this.loadMapPlugins();
				city.get((result) => {
					let center;
					if(service.isUndefined(this.center)){
						center = result.name
					}else{	
						if(service.isObject(this.center)){	
							center = new BMap.Point(this.center.longitude, this.center.latitude)
						}else{
							center = this.center
						}
					}
					// 服务的写法
					this.$map[this.id] = new MapApi(this.map);
					// 组件写法
					this.mapApi = new MapApi(this.map);
					this.map.centerAndZoom(center, this.zoom);		
					setTimeout(()=>{											
						this.$emit('ready');
						this.mapReady = true;
						setTimeout( _ => { this.loadControl() }, 500);
					}, 200);						
				});
				this.map.enableScrollWheelZoom(); 			
			},
			getMapScript(){
				if (!global.BMap) {
					let ak = this.$map.ak;
			        global.BMap = {};
			        global.BMap._preloader = new Promise((resolve, reject) => {
				        global._initBaiduMap = function () {
				            resolve(global.BMap)
				            global.document.body.removeChild($script)
				            global.BMap._preloader = null
				            global._initBaiduMap = null
				        }
			          	const $script = document.createElement('script');
			          	global.document.body.appendChild($script);
			          	$script.src = `//api.map.baidu.com/api?v=2.0&ak=${ak}&callback=_initBaiduMap`;
					})
					
			        return global.BMap._preloader
			    } else if (!global.BMap._preloader) {
			        return Promise.resolve(global.BMap)
			    } else {
			        return global.BMap._preloader
		      	}
			},
			loadMapPlugins(){
				if(!global.mapPlugins){
					let plugins = this.$map.plugins;
					if(service.isArray(plugins) && plugins.length > 0){
						global.mapPlugins = plugins;
					}else{
						global.mapPlugins = [
							{	css: 'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css',
								js: 'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js'
							},
							{
								css: 'http://api.map.baidu.com/library/SearchInfoWindow/1.4/src/SearchInfoWindow_min.css',
								js: 'http://api.map.baidu.com/library/SearchInfoWindow/1.4/src/SearchInfoWindow_min.js'
							},
							{
								js: 'http://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js'
							},
							{
								js: 'http://api.map.baidu.com/library/RectangleZoom/1.2/src/RectangleZoom_min.js'
							},
							{
								js: 'http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js'
							},
							{
								//js: 'http://api.map.baidu.com/library/LuShu/1.2/src/LuShu_min.js'
								// js:'../../../static/LuShu.js'
							}
						]
					}
					global.mapPlugins.forEach((val, index) => {
						this.createStyle(val.css);
						this.createScript(val.js);
					})
				}		
			},
			loadControl(){
				let control = this.$map.control,
					controlMethods = this.controlMethods();
				control.forEach((val) => {
					if(!service.isUndefined(val)){
						controlMethods[val]();
					}					
				})
			},
			controlMethods(){
				let {map} = this;
				return {
					// 比例尺
					ScaleControl(){
						let top_right_control = new BMap.ScaleControl({
							anchor: BMAP_ANCHOR_BOTTOM_LEFT,
							offset: new BMap.Size(20, 70)
						});
						map.addControl(top_right_control);
					},
					// 平移控件
					NavigationControl(){
						let top_left_navigation = new BMap.NavigationControl({
							anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
							offset: new BMap.Size(20, 150),
							type: BMAP_NAVIGATION_CONTROL_SMALL
						});
						map.addControl(top_left_navigation);
					},
					CityListControl(){
						let city_control = new BMap.CityListControl({
							anchor: BMAP_ANCHOR_TOP_RIGHT,
							offset: new BMap.Size(20, 60)
						});
						//map.addControl(city_control);
					},
					// 添加地图缩略图
					OverviewMapControl(){
						let overViewOpen = new BMap.OverviewMapControl({isOpen:true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
						map.addControl(overViewOpen);
					}
				}
			},
			createScript(url){
				if(!service.isUndefined(url)){
					var script = document.createElement('script');
					script.src = url;
					global.document.body.appendChild(script);			
				}					
			},
			createStyle(css){
				if(!service.isUndefined(css)){
					var head = document.getElementsByTagName('head')[0];
					var link = document.createElement('link');
					link.href = css;
					link.rel = 'stylesheet';
	    			link.type = 'text/css';
	    			head.appendChild(link);
				}				
			},
			/**
			 * 对单点操作
			 * @params
			 * 
			*/
			_point(mess){
				if(this.mapReady && this.mapApi){
					let marker = this.mapApi.mapAddpoint({
						longitude: Number(mess.mapLongitude), 
						latitude: Number(mess.mapLatitude)
					}, this.$filter.isOnline(mess), {width: 32,height: 32});
					marker.label = this.mapApi.addLabel(marker, mess.plateCode);
					this.mapApi.addOverlay(marker);
					this.mapApi.moveToCenter(marker.point);
				}
			}
		},
		watch: {
			point(newVal){
				// 先清除
				this.mapApi.clearOverlays();
				if(!this.$service.isEmptyObject(newVal)){
					this._point(newVal);
				}
				
			}
		},
		mounted(){
			const {getMapScript, mapInit} = this
			getMapScript().then(mapInit)
		},
		beforeDestroy(){
			global.BMap = global.mapPlugins = null;
			let script = myJq.find('body', 'script'),
				css = myJq.find('head', 'link'),
				style = myJq.find('head', 'style');
			this.$map[this.id] = null;
			style.forEach(val => {
				if(val.innerHTML.indexOf('.BMap_mask') === 0){
					return document.head.removeChild(val);
				}
			})
			// document.head.removeChild(style.pop());
			css.forEach(val => {
				if(/baidu/ig.test(val.href)){
					document.head.removeChild(val)
				}
			})
			script.forEach((val)=>{
				if(/baidu/ig.test(val.src)){
					document.body.removeChild(val)
				}
			})
		}
	}
</script>

<style>
	.mapbase{
		width:100%;
		height: 100%;
		min-height:100px;
	}
</style>