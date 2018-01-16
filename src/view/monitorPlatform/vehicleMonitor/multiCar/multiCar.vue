<template>
	<div class="multiCar">
		<component 
		:is="loadComponents.monitorTree"
		ref="monitor"
		class="monitor-tree" 
		:class="[!$store.getters.isToggleMonitorTree?'toggle-tree':'']"
		@vehicle="vehicle"
		:is-double="true"
		:is-loading="mapFlag"
		:is-show-track="false"
		size="big"
		:update-tree="updateTree"></component>
		<component 
		:is="$store.getters.mapName"
		:isMap="true" 
		id="monitorMap" class="multiMap" @ready="mapReady"></component>
		<component
		class="monitor-tool"
		map-name="monitorMap"
		:is="loadComponents.mapTool" 
		:is-search="false">
			 <span class="toolItem" >
				 <b @click="[isMonitor=!isMonitor]">
				<cv-icon name="shexiangtou1" size="14" v-if="!isMonitor" ></cv-icon>
				<cv-icon name="shexiangtou1" size="14" v-if="isMonitor" class="isBlue"></cv-icon>
				<span :class="[isMonitor?'isBlue':'']">{{isMonitor?'关闭监控':'开启监控'}}</span>	
				</b>		
			</span>
			<span class="toolItem">
				<b @click="mapBaseEvent">
				<cv-icon name="niaokanpressed" size="16" v-if="!isLook"></cv-icon>
				<cv-icon name="niaokanpressed" size="16" v-if="isLook" class="isBlue"></cv-icon>
				<span :class="[isLook?'isBlue':'']">{{isLook?'最佳视野':'最佳视野'}}</span>
				</b>
			</span>
		</component>
		<component
		:is="loadComponents.vehicleMessage"
		class="vehicleMessage" 
		:data="$store.getters.carCurrent"
		:is-show="popover"></component>	
		<component 
			:is="loadComponents.scrollbarPagination"
			ref="pagination"
			class="track-list" 
			:is-tree="true"
			:current-id="$store.getters.carCurrent.vehicleId"
			:current="$store.getters.carCurrent"
			:data="$store.getters.carPointsMess"
			:all="$store.state.multiCar.carList"
			@position="position"></component>
	</div>
</template>

<script>
	import monitorTree from '@/components/monitor-tree/monitor.tree.vue'
	import mapTool from './map.tool.vue'
	import vehicleMessage from '@/components/vehicle-message/vehicle.message.vue'
	import scrollbarPagination from '@/components/scrollbar-pagination/scrollbar.pagination.vue'
	export default{
		components: {monitorTree, mapTool, vehicleMessage, scrollbarPagination},
		data(){
			return{
				isMap:true,
				isLook:false,
				vehicleDetail:{},
				isFull: false,
				isMonitor: true,
				popover: {
					flag: false
				},
				setTime: null,
				mapFlag: false,
				// 加载完成的标识
				isLoadMap: false,
				// 更新树的数据存储
				updateTree: [],
				updataList:[],
				// 地图聚合对象
				MarkerClusterer: null,
				// 确定是否可以轮循
				loop: null,
				// 更新所有车辆信息的信息
				receive: false,
				loadComponents: {
					mapTool: "",
					monitorTree: "",
					vehicleMessage: "",
					scrollbarPagination: ""
				}
			}
		},
		methods: {	
			lifeProcess(){
				setTimeout(_ => { this.loadComponents.monitorTree = 'monitorTree' });
				this.loadComponents.mapTool = 'mapTool';
				this.loadComponents.vehicleMessage = 'vehicleMessage';
				this.loadComponents.scrollbarPagination = 'scrollbarPagination';
			},	
			mapReady(){
				if(this.$store.state.multiCar.carList.length > 0){
					this.vehicle({name: 'add', data: this.$store.state.multiCar.carList});
				}else{
					this.lifeProcess();
				};
			},
			// flag--是否自动
			vehicle(result, flag=false){
				if((this.$store.getters.addId || this.$store.getters.removeId) && flag){		
					this.$store.getters.addId ? 
					this.addEvent(this.$store.getters.addId) : 
					this.removeEvent(this.$store.getters.removeId);				
				}else{
					// let result = this.addRemoveUnique(newVal, oldVal, 'id');
					switch(result.name){
						case 'add': return this.addEvent(result.data);
						case 'remove': return this.removeEvent(result.data);
					}
				}								
			},
			//添加事件 -- 添加队列请求接口地图画点
			async addEvent(array){
				this.mapFlag = true; this.isLoadMap = true;
				let vehicles = [];
				array.forEach(val => {
					vehicles.push(val.id)
				});
				const ids = vehicles.join(',');
				const {data} = await this.$store.dispatch('getMultiVehicleLastLocationList', {ids:ids,mapType:this.$store.getters.mapType});
				if(this.$service.isArray(data)){
					this.$service.chunk(data, (val, len) => {
						this.pointMap({
							lng:val.mapLongitude, 
							lat:val.mapLatitude, 
							vehicleId: Number(val.vehicleId),
							data: val
						})
					}, finish => {
						/*对多个点进行居中*/
						let arr = [], marker = [], ids = null;
						this.mapFlag = false; this.isLoadMap = false;
						for(let key in this.$store.getters.carPoints){
							arr.push(this.$store.getters.carPoints[key]);
							marker.push(this.$store.getters.carPoints[key]);
							ids = key;
						}
						// 显示加载的最后一辆车的信息
						ids?(this.$store.dispatch('carCurrent', {id:ids})):null;
						// 对点居中和聚合
						if(arr.length === 1){
							this.$map['monitorMap'].markerClustererAddMarkers(marker);
							//this.MarkerClusterer.addMarkers(marker);
							this.$map['monitorMap'].moveToCenter(arr[arr.length-1].point, 17);
						}else{
							this.$map['monitorMap'].markerClustererAddMarkers(marker);
							//this.MarkerClusterer.addMarkers(marker);
							this.$map['monitorMap'].getBestView(arr);
						}		
						// 显示其他组件
						setTimeout(_ => {this.lifeProcess() }, 100);		
					}, 30)
				}else{	
					this.mapFlag = false;
				}
			},			
			// 删除事件 -- 删除队列地图上删除点
			removeEvent(array){
				array.forEach(ele => {
					let marker = this.$store.getters['carPoints'][ele.id];
					this.$map['monitorMap'].markerClustererremoveMarkers(marker);
					//this.MarkerClusterer.removeMarker(marker);
					//this.$map['monitorMap'].removeOverlay(marker);
					this.$store.dispatch('removePoints', ele.id);
				});	
				let _carList=this.$store.getters.carList;
				let len=_carList.length;
				_carList !=0 && this.$store.dispatch('carCurrent', {id:_carList[len-1].id});			
			},
			//新点地图画点
			pointMap({lng, lat, vehicleId, data}){
				if(data){
					let marker = this.$map['monitorMap'].mapAddpoint({
						longitude: Number(lng), 
						latitude: Number(lat)
					}, this.$filter.isOnline(data), {width: 32,height: 32});
					/* 给地图添加点和文字 */
					marker.label = this.$map['monitorMap'].addLabel(marker, data.plateCode);
					//this.$map['monitorMap'].addOverlay(marker);	
					this.$store.dispatch('addPoints', {id: vehicleId, marker: marker});
					this.$store.dispatch('carPointsMess', {id: vehicleId, data: data});
					/* marker注册点击事件 */
					this.$map['monitorMap'].addEventListener(marker, 'click', _ => {
						this.$store.dispatch('isGetBaseView', true);
						this.$store.dispatch('carCurrent', {id:data.vehicleId});
						this.popover.flag = true;
					});
				}
			},
			// 移动点方法: 设置图标 设置位置 设置方向
			moveMarker: function(marker, data){
				if(this.$map['monitorMap'] && marker){
					let img = this.$filter.isOnline(data),
						icon = this.$map['monitorMap'].setIcon(img, 32, 32),
						point = this.$map['monitorMap'].point({lng: data.mapLongitude, lat: data.mapLatitude});
					this.$map['monitorMap'].setPointIcon(marker, icon);
					this.$map['monitorMap'].setPosition(marker, point);
					this.$map['monitorMap'].setRotation(marker, data.direction);
					marker.point = point;
					this.$store.dispatch('addPoints', {id: data.vehicleId, marker: marker});
				}				
			},
			// 轮询存在的车辆点 5s-请求一次
			loopCar(){
				if(this.isMonitor){
					this.changePoints(this.$store.getters.carPoints, _=>{						
						this.setTime = setTimeout(_ => {
							this.loopCar()
						}, 5 * 1000)
					})			
				}else{
					this.closeTimeout();
				}				
			},
			//存在的地图点只需要移动点,改变图标,改变方向
			async changePoints(markers, callback){
				let vehicleIds = [];
				for(let marker in markers){
					vehicleIds.push(marker)
				}
				const ids = vehicleIds.join(',');
				if(!this.$service.isContext(ids)){
					
					const {data} = await this.$store.dispatch('getMultiVehicleLastLocationList', {ids:ids,mapType:this.$store.getters.mapType});
					if(this.$service.isArray(data)){
						this.$service.chunk(data, val => {
							// 实时更新车辆树图标
							this.moveMarker(markers[val.vehicleId], val);		
							this.$store.dispatch('carPointsMess', {id: val.vehicleId, data: val});
						}, (finish)=>{
							// 实时更新当前选中的车辆信息  
							let vehicleId = this.$store.getters.carCurrent.vehicleId || -1,
								plateCode = this.$store.getters.carCurrent.plateCode,
								baseMarker = this.$store.getters.carPoints[vehicleId];
							this.$store.dispatch('carCurrent', {id:vehicleId,plateCode:plateCode});
							// 实时更新当前车辆的最佳视野
							if(this.$store.getters.isGetBaseView && baseMarker){
								this.$map["monitorMap"] 
								&& this.$map["monitorMap"].mapPanTo(baseMarker.point);
							}
							// 更新完最后一个的回调		
							typeof callback === 'function'? callback() : null;
						}, 30)
					}else{
						typeof callback === 'function'? callback() : null;
					}
				}
			},
			// 单个点定位
			position(list){
				this.$store.dispatch('carCurrent', { id: list.vehicleId, plateCode: list.plateCode });
				if (this.$store.getters.carPoints[list.vehicleId]) {
					this.$store.dispatch('isGetBaseView', true);
					this.$map['monitorMap'].moveToCenter(this.$store.getters.carPoints[list.vehicleId].point, 17);
					this.popover.flag = true;
					this.$store.getters.carPoints[list.vehicleId].setTop(true);
				} else {
					this.$message.error('车辆(' + list.plateCode + ')暂无位置信息!');
				}
			},
			// 最佳视野事件
			mapBaseEvent(){	
				this.isLook=!this.isLook;
				if(this.$store.state.multiCar.carList.length){
					this.$store.dispatch('isGetBaseView', false);
				}
				// 监控和历史轨迹的最佳视野
				if(!this.$store.getters.isMonitorOrTrack){
					if(!this.$service.isEmptyObject(this.$store.getters.carPoints)){
						let arr = [];
						for(let key in this.$store.getters.carPoints){
							arr.push(this.$store.getters.carPoints[key]);
							this.$map['monitorMap'].getBestView(arr);			
						}
					}else{
						this.$map['monitorMap'].moveToCenter('上海市');
					}
				}else{
					let markArry=this.$store.getters.allHistoryPoint;
					this.$map['monitorMap'].getBestView(markArry);
				}							
			},
			// 关闭定时器
			closeTimeout(){
				clearTimeout(this.setTime);
				this.setTime = null;
			}
		},
		watch: {
			isMonitor(newVal){
				newVal ? this.loopCar() : this.closeTimeout();
			},
			isLoadMap(newVal, oldVal){
				this.closeTimeout();
				if(!newVal){
					if(this.loop){
						return false;
					}
					this.loop = setTimeout(_ => {
						clearTimeout(this.loop);
						this.loop = null;
						this.loopCar();
					}, 500)	
				}			
			},
			'$store.getters.carCurrent'(newVal, oldVal){
				let newMarker = this.$store.getters.carPoints[newVal.vehicleId],
					oldMarker = this.$store.getters.carPoints[oldVal.vehicleId];
				//清除上一个地图点文本高亮
				if(oldVal && oldMarker && (newVal.vehicleId !=oldVal.vehicleId)){
					oldMarker.label.setStyle({
						backgroundColor:'#f8f8f8',
						color:'#666'
					});
					oldMarker.setTop(false);
				}
				// 添加下一个地图文本高亮
				if(newVal && newMarker ){
					newMarker.label.setStyle({
						backgroundColor:'black',
						color:'#fff'
					});
					newMarker.setTop(true);
				}
			},
			'$store.getters.carList'(newVal){
				let len=newVal.length;
				if(len==0){
					this.$store.dispatch('carCurrent', {id:''});
				}
			}
		},
		beforeDestroy(){
			// 监控关闭
			this.isMonitor = false;
			// 是监控还是历史的切换标识
			// this.$store.dispatch('isMonitorOrTrack', false);
			this.$store.dispatch('isToggleMonitorTree', true);	
			this.$store.dispatch('getAsyncNodes', this.$refs['monitor'].getAsyncNodes());	
		}
	}
</script>

<style lang="scss">
	$width: 300px;
	.multiCar{
		overflow: hidden;
		.fullscreen{
			top: 0
		}
		.multiMap{
			height: 100%;
			width: 100%
		}
		.isBlue{
			color:#20a0ff;
		}
		.monitor-tree{
			position: absolute;
			z-index: 1;
			width: $width;
			top: 10px;
			bottom:50px;
			left: 10px;  
			transition: all .3s ease-in-out;  
		}
		.toggle-tree{
			bottom: 0;
			left: -500px;
			transition: all .3s ease-in-out;	
		}
		.monitor-tool{
			cursor: pointer;
			position: absolute;
			top: 13px;
			right: 70px;
		}	
		.vehicleMessage{
			position: absolute;
			top: 0;
			right: 11px;
			bottom: 0;			
		}
		.transfers{
			right: 0;
		}
		.track-list{
			width: 100%;
			position: absolute;
			bottom: 0;	
		}	
	}	
</style>