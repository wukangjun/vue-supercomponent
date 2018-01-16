<template>
	<div class="multiCar" :style="{top: isFull?'0px':'90px'}">
		<monitor-tree 
		ref="monitor"
		class="monitor-tree" 
		@vehicle="vehicle"
		:is-double="true"
		:is-border="false"
		:is-loading="mapFlag"
		:show-checkbox="true"
		:is-show-track="false"
		size="big"
		:show-track="false"
		:default-show="false"
		:update-tree="updateTree"
		:updata-list='updataList'></monitor-tree>
		<baidu-map id="monitorCheckMap" class="multiMap" @ready="mapReady"></baidu-map>
		<cv-play :data='this.$store.getters.trackLists' v-show='this.$store.getters.isMonitorOrTrack'></cv-play>
		<div class="tool">
			<span class="toolItem" v-show='! this.$store.getters.isMonitorOrTrack'>
				点名: <el-switch v-model="isMulti"></el-switch>
			</span>
			<span class="toolItem">
				<el-button size="mini" @click="mapBaseEvent">最佳视野</el-button>
			</span>
			<!-- <el-dropdown class="toolItem">
				<span class="el-dropdown-link">
					指令下发<i class="el-icon-caret-bottom el-icon--right"></i>
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item>拍照下发</el-dropdown-item>
				    <el-dropdown-item>文本下发</el-dropdown-item>
				    <el-dropdown-item>点名下发</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>		 -->
			<span class="toolItem" @click="isFull=!isFull">
				<i :class="['fullBtn', isFull?'el-icon-tsp-fullscreen-exit':'el-icon-tsp-fullscreen']"></i>
			</span>	
		</div>	
		<vehicle-message 
		class="vehicleMessage" 
		:is-popover="isPopover"></vehicle-message>	
		<!-- <scrollbar-pagination class="track-list" 
		:current="$store.getters.carCurrent"
		:data="$store.getters.carPointsArray"></scrollbar-pagination> -->
	</div>
</template>

<script>
	import monitorTree from '@/components/monitor-tree/monitor.tree.vue'
	import vehicleMessage from './vehicle.msg.vue'
	import scrollbarPagination from '@/components/scrollbar-pagination/scrollbar.pagination.vue'
	import cvPlay from '@/components/play/play.vue'
	export default{
		components: {monitorTree, vehicleMessage, scrollbarPagination,cvPlay},
		data(){
			return{
				isFull: false,
				isMulti: true,
				isPopover: false,
				setTime: null,
				mapFlag: false,
				// 加载完成的标识
				isLoadMap: false,
				// 更新树的数据存储
				updateTree: [],
				updataList:[],
				// 确定是否可以轮循
				loop: null,
				// 更新所有车辆信息的信息
				receive: false
			}
		},
		methods: {		
			mapReady(){
				if(this.$store.state.multiCar.carList.length){
					this.vehicle({name: 'add', data: this.$store.state.multiCar.carList});
				}
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
							arr.push(this.$store.getters.carPoints[key].point);
							marker.push(this.$store.getters.carPoints[key]);
							ids = key;
						}
						// 显示加载的最后一辆车的信息
						ids?(this.$store.dispatch('carCurrent', {id:ids})):null;
						arr.length === 1 ? this.$map['monitorCheckMap'].moveToCenter(arr[arr.length-1], 17) :
						this.$map['monitorCheckMap'].getBestView(arr);		
						//this.loopCar();
					}, 30)
				}else{	
					this.mapFlag = false;
				}
			},			
			// 删除事件 -- 删除队列地图上删除点
			removeEvent(array){
				array.forEach(ele => {
					let marker = this.$store.getters['carPoints'][ele.id];
					this.$map['monitorCheckMap'].removeOverlay(marker);
					delete this.$store.getters.carPoints[ele.id];
				})				
			},
			//新点地图画点
			pointMap({lng, lat, vehicleId, data}){
				if(data){
					let marker = this.$map['monitorCheckMap'].mapAddpoint({
						longitude: Number(lng), 
						latitude: Number(lat)
					}, this.$filter.isOnline(data), {width: 32,height: 32});
					/* 给地图添加点和文字 */
					marker.label=this.$map['monitorCheckMap'].addLabel(marker, data.plateCode);
					this.$map['monitorCheckMap'].addOverlay(marker);	
					this.$store.dispatch('addPoints', {id: vehicleId, marker: marker});
					this.$store.dispatch('carPointsMess', {id: vehicleId, data: data});
					/* marker注册点击事件 */
					marker.addEventListener('click', _ => {
						this.$store.dispatch('isGetBaseView', true);
						this.$store.dispatch('carCurrent', {id:data.vehicleId});
						this.$store.dispatch('showPopover', true);
					})
				}
			},
			// 移动点方法: 设置图标 设置位置 设置方向
			moveMarker: function(marker, data){
				if(marker && data){
					let img = this.$filter.isOnline(data),
						icon = this.$map['monitorCheckMap'].setIcon(img, 32, 32),
						point = this.$map['monitorCheckMap'].point({lng: data.mapLongitude, lat: data.mapLatitude});
					marker.setIcon(icon);
					marker.setPosition(point);
					marker.setRotation(data.direction);
				}				
			},
			// 轮询存在的车辆点 5s-请求一次
			loopCar(){
				if(this.isMulti){
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
							//this.updateTree = [{ id: val.vehicleId, data: val}];
							//this.updataList=[{id:val.vehicleId,data:val}];
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
								this.$map["monitorCheckMap"].mapPanTo(baseMarker.point);
							}
							// 更新完最后一个的回调		
							typeof callback === 'function'? callback() : null;
						}, 30)
					}else{
						typeof callback === 'function'? callback() : null;
					}
				}
			},
			// 最佳视野事件
			mapBaseEvent(){				
				if(this.$store.state.multiCar.carList.length){
					this.$store.dispatch('isGetBaseView', false);
				}
				// 监控和历史轨迹的最佳视野
				if(!this.$store.getters.isMonitorOrTrack){
					if(!this.$service.isEmptyObject(this.$store.getters.carPoints)){
						let arr = [];
						for(let key in this.$store.getters.carPoints){
							arr.push(this.$store.getters.carPoints[key].point);
							this.$map['monitorCheckMap'].getBestView(arr);			
						}
					}	
				}else{
					let markArry=this.$store.getters.allHistoryPoint;
					this.$map['monitorCheckMap'].getBestView(markArry);
				}							
			},
			// 关闭定时器
			closeTimeout(){
				clearTimeout(this.setTime);
				this.setTime = null;
			}
		},
		watch: {
			isMulti(newVal){
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
				// 清除上一个地图点文本高亮
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
			'$store.getters.onlineNub'(newVal){
				this.updateTree = this.$store.getters.onlineList;
			}
		},
		beforeDestroy(){
			// 监控关闭
			this.isMulti = false;
			// 是监控还是历史的切换标识
			this.$store.dispatch('isMonitorOrTrack', false);
			this.$store.dispatch('getAsyncNodes', this.$refs['monitor'].getAsyncNodes());	
		}
	}
</script>

<style lang="scss">
	$width: 300px;
	.multiCar{
		.fullscreen{
			top: 0
		}
		.multiMap{
			height: 100%;
			width: 100%
		}
		.monitor-tree{
			position: absolute;
			z-index: 1;
			width: $width;
			top: 13px;
			left: 10px;
		}
		.tool{
			width: auto;
			padding: 6px 15px;
			box-shadow: 1px 2px 1px rgba(0,0,0,.15);
			border-radius: 2px;
			background: #fff;
			position: absolute;
			top: 13px;
			right: 70px;
			.el-switch{
				vertical-align: top;
			}
			.toolItem{
				padding: 0 8px 0 6px;
				border-right: 1px solid #d1dbe5;	
				font-size: 12px;			
				vertical-align: sub;
				&:last-child{
					border: 0
				}
				.fullBtn{
					cursor: pointer;
					font-size:14px;
					color: #808386;
				}
			}
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