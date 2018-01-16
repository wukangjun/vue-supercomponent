<template>
	<div class="history-track">
		<div class="title">
			<i class="el-icon-arrow-left backBtn" @click="back"></i>
			{{data.plateCode&&(plateCode=data.plateCode)}}
		</div>
		<div class="search">
			<el-tooltip 
			placement="top"
			:enterable="false">
				<div slot="content">
					{{/NAN/ig.test(this.$filter.format(this.time[0]))?this.time[0]:$filter.format(this.time[0], 'yyyy-MM-dd HH:mm:ss')}}
					-
					{{/NAN/ig.test(this.$filter.format(this.time[1]))?this.time[1]:$filter.format(this.time[1], 'yyyy-MM-dd HH:mm:ss')}}
				</div>
				<el-date-picker
				  class="picker"
			      v-model="time"
			      :clearable="false"
				  :editable="false"
			      type="datetimerange"
			      placeholder="选择时间范围">
			    </el-date-picker>
			</el-tooltip>
		    <div class="picker">
		    	<el-select v-model="isAllLocations">
		    		<el-option label="关键点轨迹" value="false"></el-option>
		    		<el-option label="完整轨迹" value="true"></el-option>
		    	</el-select>
		    	<el-button type="primary" size="small" @click.stop="search(null)" :loading="searchFlag">搜索</el-button>
		    </div>
		    <el-tabs class="tabs" v-model="tabActive">
		    	<div style="padding-left: 15px;line-height:26px;">总里程: {{mileageTotal | isValue('km')}}</div>
				<el-tab-pane name="first" label="按行程">
					<cv-scrollbar class="messArea" style="height:225px" v-loading="searchFlag">
						<h2 v-show="listST.length==0" class="emptyData">数据为空</h2>
						<ul class="trackUl">
							<li class="trackItem" @click="lookTrack(index, 'track', st)" v-for="(st,index) in listST" ref="track" v-show="listST.length!==0">
								<div class="track-title">
									<i class="el-icon-time time-icon"></i>
									<span class="timeword">
										{{st.startTime | format}} ~
										{{st.endTime | format}}
									</span>
								</div>
								<div class="track-num">
									<i class="el-icon-tsp-map-marker map-icon"></i>
									<span>行程{{index+1}}</span>
									<span class="rightword">{{st.trakDurationTime}}</span>
								</div>
								<div class="track-num">
									<i class="el-icon-tsp-circle circle-icon green"></i>
									<span>平均 {{st.avgOilConsumption}}L/100km</span>
									<span class="rightword"> 油耗 {{st.oilConsumption}}L</span>
								</div>
								<div class="track-num">
									<i class="el-icon-tsp-circle circle-icon red"></i>
									<span>海拔 {{st.minHigh}}-{{st.maxHigh}} m</span>
									<span class="rightword"> 里程 {{st.mileage}}km</span>
								</div>
							</li>
						</ul>
					</cv-scrollbar>				
				</el-tab-pane>
				<el-tab-pane name="second" label="按县城">
					<cv-scrollbar class="messArea" style="height:225px" v-loading="searchFlag">
						<h2 v-show="listCounty.length==0" class="emptyData">数据为空</h2>
						<ul class="trackUl">
							<li class="trackItem" @click="lookTrack(index, 'country', st)" v-for="(st,index) in listCounty" ref="country" v-show="listCounty.length!==0">
								<div class="track-title">
									<i class="el-icon-time time-icon"></i>
									<span class="timeword">
										{{st.startTime | format}} ~
										{{st.endTime | format}}
									</span>
								</div>
								<div class="track-num">
									<i class="el-icon-tsp-map-marker map-icon"></i>
									<span>行程{{index+1}}</span>
									<span class="rightword">{{st.trakDurationTime}}</span>
								</div>
								<div class="track-num">
									<i class="el-icon-tsp-circle circle-icon green"></i>
									<span>平均 {{st.avgOilConsumption}}L/100km</span>
									<span class="rightword"> 油耗 {{st.oilConsumption}}L</span>
								</div>
								<div class="track-num">
									<i class="el-icon-tsp-circle circle-icon red"></i>
									<span>海拔 {{st.minHigh}}-{{st.maxHigh}} m</span>
									<span class="rightword"> 里程 {{st.mileage}}km</span>
								</div>
							</li>
						</ul>
					</cv-scrollbar>				
				</el-tab-pane>
			</el-tabs>
			<cv-scrollbar class="alarmPoints" style="height:80px">
				<li class="alarm-item" v-for="(alarm, index) in alarmMap" @click="showAlarmPoint(index, alarm)" ref="alarm">
					<div class="alarm-name">{{alarm.alarmName}}({{alarm.alarmCount}})</div>
				</li>
			</cv-scrollbar>
		</div>
	</div>
</template>

<script>
	import startIcon from '@/assets/img/map/zero.png'
	import endIcon from '@/assets/img/map/end.png'
	import port from './index.js'
	import zip from '@/utils/mixins/zip'
	import unknow from '@/assets/img/map/red1.png'
	import cars from '@/assets/img/e_1.png'
	export default{
		props: {
			data: {}
		},
		mixins: [port, zip],
		data(){
			return{
				time: [
					// this.$filter.timeStamp(this.$filter.format(new Date()-1000*60*60*24*3, 'yyyy-MM-dd HH:mm:ss')),
					this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd start')),
		        	this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd HH:mm:ss'))	
				],
				isAllLocations:'false',
				tabActive: 'first',
				searchFlag: false,
				mileageTotal: "",
				listST: [],
				listCounty: [],
				alarmMap: [],
				allLineOne: null,
				allLineTwo: null,
				startPoint: null,
				endPoint: null,
				markerCurrent: null,
				allData:null,
				num:0,
				curIndex:0,//轨迹下标
				trackSpeed:null,
				addPoint:null,
				playSpeed:500,
				plateCode:"",
				playFalg:false,
				infoMarker:null,
				changSpeedFlag:false,
				trackChage:false,
				infoWindowStatus:true,
				allLinePoint:[],//所有的线路点
				alarmInfoPoint:null,//报警弹框主体
				alarmMarkerGroup: [] , // 报警点的marker集合
				alarmPoints:[]// 报警点的point集合
			}
		},
		watch:{
			data(newVal){
				this.listST = [];
				this.listCounty = [];
				this.alarmMap = [];
			},
			'$store.getters.getPlayStartFalg'(newVal){
				if(this.allLinePoint){
					this.playFalg=newVal;
					[{obj: 'track', data: this.listST,current: 'trackCurrent',clb:this.lookTrack},
					{obj: 'country', data:this.listCounty , current: 'trackCurrent',clb:this.lookTrack},
					{obj: 'alarm', data: this.alarmMap,current: 'alarmCurrent',clb:this.showAlarmPoint}
					].forEach(val => {
						this.clearOrAddToAllMarker(val.obj,val.data,val.current,val.clb)
					});
					this.runTrack();
				}
				if(newVal &&this.addPoint){
					this.$map['map'].getBestView([this.addPoint.point]);
				}
				
			},
			'$store.getters.getSiderIndex'(newVal){
				if(newVal !=0){
					this.curIndex=newVal;
					this.moveTrack();
				}
			},
			'$store.getters.getTrackSpeed'(newVal){
				this.playSpeed = parseInt(newVal);
				this.changSpeedFlag = true;
				this.runTrack(this.changSpeedFlag);
			}
		},
		methods:{
			back(){
				this.clearHistoryTrack();
				clearInterval(this.trackSpeed);
				this.curIndex = 0;
				this.allData = null;
				this.mileageTotal = "";
				this.allLinePoint = [];
				this.$store.dispatch('setTrackIndex', 0);
				this.$emit('back');				
			},
			// 查询轨迹信息
			search(id){	
				this.curIndex=0;
				this.$store.dispatch('setTrackIndex',0);
				let params = {
					vehicleId: id || this.data.id, 
					startTime:/NAN/ig.test(this.$filter.format(this.time[0]))?this.time[0]:this.$filter.format(this.time[0], 'yyyy-MM-dd HH:mm:ss'),
					endTime:/NAN/ig.test(this.$filter.format(this.time[1]))?this.time[1]:this.$filter.format(this.time[1], 'yyyy-MM-dd HH:mm:ss'),
					isCompress: true,
					isAllLocations:this.isAllLocations,
					mapType:this.$store.getters.mapType,
					trackType:this.$store.getters.user.trackType
					// trackType:1
				}
				if(this.$filter.timeRange(params.startTime,params.endTime) > 7){
					this.$message.warning('查询时间不能超过7天!');
				}else{
					let isIe = false;
					[
						{type: 'track', current: 'trackCurrent'},
						{type: 'country', current: 'trackCurrent'},
						{type: 'alarm', current: 'alarmCurrent'}
					].forEach(val => {
						this.clearAllCurrent(val.type, val.current);
					});
					this.searchFlag = true;
					(!!window.ActiveXObject || 'ActiveXObject' in window) ? isIe = true : isIe = false;
					this.$map['map'].clearOverlays();
					if(isIe){
						params.isCompress = false;
						this.getVehicleTrackByBigData(params, 'json').then(data => {
							this.searchResultDetail(data.data);
						}).catch(error => {
							this.searchFlag = false;
						})
					}else{
						this.getVehicleTrackByBigData(params).then(data => {
							let result = JSON.parse(this.unzip(data.data));
							this.searchResultDetail(result);
						}).catch(error => {
							this.searchFlag = false;
						})
					}
				}
			},
			// 清除所有当前高亮--轨迹，县城， 报警
			clearAllCurrent(type, current){
				if(this.$refs[type]){
					this.$refs[type].forEach(val => {
						this.$myJq.removeClass(val, current)
					})
				}
			},
			//清除轨迹播放时地图上显示的轨迹，县城，报警()
			clearOrAddToAllMarker(obj,data,current,clb){
				let _self=this;
				if(_self.$refs[obj]){
					_self.$refs[obj].forEach((val,index) => {
						if(_self.$myJq.hasClass(val,current)){
							if(_self.playFalg){
								if(obj=="alarm" ){
									_self.alarmMarkerGroup.length > 0 &&(_self.alarmMarkerGroup.forEach(val=>{ _self.$map['map'].removeOverlay(val)}));
								}else{
									_self.markerCurrent!=null && _self.$map['map'].removeOverlay(_self.markerCurrent);
								}
							}else{
								if(obj=="alarm" ){
									_self.showAlarmPoint(index, data[index],true);
								}else{
									_self.lookTrack(index,obj,data[index]);
								}
							}
						}
					})
				}
			},
			// 查询结果数据处理
			searchResultDetail(result){ 
				console.log(result)
				this.searchFlag = false;
				if(!this.$service.isEmptyObject(result)){	
					// json字符串---> json格式
					result.listST = JSON.parse(result.listST);
					result.listCounty = JSON.parse(result.listCounty);
					result.alarmMap = JSON.parse(result.alarmMap);
					result.listAll = JSON.parse(result.listAll);
					result.mileageTotal = JSON.parse(result.mileageTotal);
					/* 总里程 */
					this.mileageTotal = result.mileageTotal;
					/*. 行程列表 */				
					this.listST = this.$service.isArray(result.listST)?result.listST:[];
					/*. 县城列表 */		
					this.listCounty = this.$service.isArray(result.listCounty)?result.listCounty:[];
					/* 报警列表 */
					this.alarmMap = this.$service.isArray(result.alarmMap)?result.alarmMap:[];
					/*. 所有轨迹 */		
					this.showLines(result.listAll);
					this.$store.dispatch('addTrackLists', result.listAll);
					/*. 能力id*/
					this.$store.dispatch('addTrackAbillity',result.abillityIds);
				}
			},
			// 清除地图的轨迹 （目前地图上只能有一个轨迹）
			clearHistoryTrack(){
				if(this.allLineOne && this.allLineTwo){
					this.$map['map'].removeOverlay(this.allLineOne);
					this.$map['map'].removeOverlay(this.allLineTwo);
				}
				if(this.startPoint && this.endPoint){
					this.$map['map'].removeOverlay(this.startPoint);
					this.$map['map'].removeOverlay(this.endPoint);
				}
				if(this.markerCurrent){
					this.$map['map'].removeOverlay(this.markerCurrent);
				}
			},
			// 显示所有轨迹
			showLines(data){
				let points = [];
				if(this.$service.isArray(data) && data.length > 0){
					data.forEach((val) => {
						points.push({lng: val.mapLongitude, lat: val.mapLatitude})
					})
					this.allLineOne = this.$map['map'].mapAddline(points, {
						strokeWeight: 8,
						strokeColor: '#8b8b8a'
					})
					this.allLineTwo = this.$map['map'].mapAddline(points, {
						strokeWeight: 6
					})
					this.$store.dispatch('historyTrackAllPoint',points);
					this.showStartEnd(data, points)
				}
			},
			//轨迹运行
			runTrack(flag){
				if(this.playFalg){
					if(flag){
						clearInterval(this.trackSpeed);
						this.changSpeedFlag=false;
					}
					this.trackChage=false;
					this.$store.dispatch('setTrakchanges',this.trackChage);
					this.trackSpeed = setInterval(()=>{
					this.curIndex = ++this.curIndex;
					this.moveTrack();
					}, parseInt(this.playSpeed)); 
				}else{
					clearInterval(this.trackSpeed);
				}

			},
			moveTrack() {
				let trackNum = this.allLinePoint.length;
				if (trackNum > this.curIndex) {
					//old 轨迹回放
					this.generatesPoint();
					//新轨迹回放
					this.$store.dispatch('setTrackIndex',this.curIndex);
					this.$map['map'].setPosition(this.addPoint,{lng:Number(this.allLinePoint[this.curIndex].lng),lat:Number(this.allLinePoint[this.curIndex].lat)});
				} else {
					this.curIndex=0;
					this.$store.dispatch('setTrackIndex',this.curIndex);
					clearInterval(this.trackSpeed);
				}
			},
			generatesPoint() {
				this.addPoint != null & this.$map['map'].removeOverlay(this.addPoint);
				let _self=this;
				let _item={
					plateCode:this.plateCode,
					alarmCount:this.allData[this.curIndex].alarmCount,
					vehicleStatus:1,
					locationDesc:this.allData[this.curIndex].locationDesc,
					gpsSpeed:this.allData[this.curIndex].gpsSpeed,
					direction:this.$filter.direction(this.allData[this.curIndex].direction)
				};
				this.addPoint = this.$map['map'].mapAddpoint({
					longitude: Number(this.allData[this.curIndex].mapLongitude), 
					latitude: Number(this.allData[this.curIndex].mapLatitude)
				}, this.$filter.isOnline(_item), {width: 36,height: 36});	
				this.addPoint.setRotation(this.allData[this.curIndex].direction);
				this.$map['map'].addOverlay(this.addPoint);	
				this.addPoint.addEventListener('click',()=>{
					_self.infoWindowStatus=true;
					_self.openInfo(this.curIndex);
				});
				this.openInfo(this.curIndex);
			},
			openInfo(n){
				let _item=this.allData[n];
				let viewBox;
				if(this.infoWindowStatus){
					let context=`
						<style>.BMap_pop{margin-left:5px;margin-top: 1px;visibility: visible !important;}.BMap_shadow{display:none}}</style>
						<div class='trackInfoDialog'>
							<div class="maptitle"><span class='titleName'>车牌号码:</span>${this.plateCode}</div>
							<div>
								<span class="td1"><span class='titleName'>GPS时间:</span>${this.$filter.format(_item.gpsTime,'yyyy-MM-dd HH:mm:ss')} </span>
								<span class="td2"><span class='titleName'>方向:</span>${this.$filter.direction(_item.direction)} </span>
							</div>
							<div>
								<span class="td1"><span class='titleName'>海拔:</span>${_item.high} (m)</span>
								<span class="td2"><span class='titleName'>里程:</span>${_item.mileage} (km)</span>
							</div>
							<div>
								<span class="td1"><span class='titleName'>行驶速度:</span>${_item.dspeed} (km/h)</span>
								<span class="td2"><span class='titleName'>GPS速度:</span>${_item.gpsSpeed}(km/h) </span>
							</div>
							<div>
								<span class="td1"><span class='titleName'>经度:</span>${this.$filter.toFixed(_item.mapLongitude,6)} </span>
								<span class="td2"><span class='titleName'>纬度:</span>${this.$filter.toFixed(_item.mapLatitude,6)} </span>
							</div>
							<div class="td"><span class="titleName">位置信息:</span>${_item.locationDesc} </div>
						</div>`;
					this.infoMarker=this.$map['map'].infoWindow(context,this.addPoint);
					this.infoMarker.addEventListener('clickclose', () => {
						this.infoWindowStatus=false;
					});
					this.$map['map'].cvOpenInfoWindow(this.infoMarker,this.addPoint.point);
					
					// this.infoMarker.setContent(context);
					// this.closeInfo(this.infoMarker);
				}
				
			},
			// 显示起始点和信息
			showStartEnd(data, points){
				this.allData=data;
				this.allLinePoint=points;
				let startContext, endContext, 
					maxPoint = points.length - 1, maxData = data.length - 1,
					start = points[0], end = points[maxPoint],
					startMess = data[0], endMess = data[maxData];
					
				/* 开始点 */
				startContext =	`
				<div class="mapcontent">开始位置: ${startMess.locationDesc=="" ?"未获取到位置信息" : startMess.locationDesc}</div>`;
				this.startPoint = this.$map['map'].mapAddpoint({
					longitude: Number(start.lng), 
					latitude: Number(start.lat)
				}, startIcon, {width: 36,height: 36});
				this.$map['map'].overlayClickOpenInfoWindow(this.startPoint, this.startPoint.point, startContext);
				this.$map['map'].addOverlay(this.startPoint);	

				/* 结束点 */
				endContext =`
							<div class="mapcontent">结束位置: ${endMess.locationDesc=="" ?"未获取到位置信息" : endMess.locationDesc}</div>`;
				this.endPoint = this.$map['map'].mapAddpoint({
					longitude: Number(end.lng), 
					latitude: Number(end.lat)
				}, endIcon, {width: 36,height: 36});				
				this.$map['map'].overlayClickOpenInfoWindow(this.endPoint, this.endPoint.point, endContext);
				this.$map['map'].addOverlay(this.endPoint);	
				
			},
			// 查看单条信息的轨迹
			lookTrack(index, name, line){
				let points = [], track = JSON.parse(line.locationTrackJson), self = this.$refs[name][index];
				this.$refs['track'].forEach(val => {
					this.$myJq.removeClass(val, 'trackCurrent');
				})
				this.$refs['country'].forEach(val => {
					this.$myJq.removeClass(val, 'trackCurrent');
				})
				this.$myJq.addClass(self, 'trackCurrent');
				if(this.markerCurrent){
					this.$map['map'].removeOverlay(this.markerCurrent)
				}
				if(this.$service.isArray(track) && track.length > 0){
					track.forEach((val) => {
						points.push({lng: val.mapLongitude, lat: val.mapLatitude})
					})
					if(this.playFalg){
						this.trackChage=true;
						this.$store.dispatch('setTrakchanges',this.trackChage);
					}
					this.markerCurrent = this.$map['map'].mapAddline(points, {
						strokeWeight: 6,
						strokeColor: '#35ca89'
					})
				}
			},
			// 查看单条报警信息点
			showAlarmPoint(index, alarm,flag){	
				let self = this.$refs['alarm'][index];
				this.alarmPoints=[];
				// 高亮当前报警
				this.alarmInfoPoint !=null && (this.$map['map'].closeInfoWindow(this.alarmInfoPoint));
				if(this.alarmMarkerGroup.length > 0){
					this.alarmMarkerGroup.forEach(marker => {
						this.$map['map'].removeOverlay(marker);
					})
					this.alarmMarkerGroup=[];
				}
				if(!this.$myJq.hasClass(self,'alarmCurrent')||flag){
					this.$refs['alarm'].forEach(val => {
						this.$myJq.removeClass(val, 'alarmCurrent')
					})
					this.$myJq.addClass(self, 'alarmCurrent');
					if(this.$service.isArray(alarm.locationList) && alarm.locationList.length > 0){
						alarm.locationList.forEach(val => {
							this.makePoint({
								lng: val.longitude,
								lat: val.latitude,
								location:val.locationName,
								name:alarm.alarmName
							})
						})
						if(this.playFalg){
							this.trackChage=true;
							this.$store.dispatch('setTrakchanges',this.trackChage);
						}
						this.alarmPoints.length > 0 && this.$map['map'].getBestView(this.alarmPoints);
					}
				}else{
					this.$myJq.removeClass(self, 'alarmCurrent');
				}				
			},
			getPointInfo(cbk){
				this.alarmInfoPoint=cbk;
			},
			makePoint({lng, lat,location,name}){
				let marker = this.$map['map'].mapAddpoint({
					longitude: Number(lng), 
					latitude: Number(lat)
				}, unknow, {width: 36,height: 36}),
					context =`<div class="maptitle">报警信息</div>
							<div class="mapcontent">报警名称:${name} </div>
							<div class="mapcontent">位置:${location ==''?'未获取到报警位置信息':location} </div>`;
				this.alarmMarkerGroup.push(marker);
				this.alarmPoints.push(marker.point);
				this.$map['map'].overlayClickOpenInfoWindow(marker, marker.point, context,this.getPointInfo);	
				this.$map['map'].addOverlay(marker);				
			}
		},
		destroyed(){
			// 监控关闭
			clearInterval(this.trackSpeed);
			this.curIndex=0;
			this.allData=null;
			this.allLinePoint=[];
			this.$store.dispatch('setTrackIndex',0);
			
		}
	}
</script>

<style lang="scss">
	$gray: #d1dbe5;
	$selectH: 28px;
	$messH: 32px;
	.mapcontent{
		margin-top: 6px;
	}
	.history-track{
		.title{
			height: 40px;
			line-height: 40px;
			border-bottom: 1px solid $gray;
			text-align: center;
			position: relative;
			font-size: 14px;
			.backBtn{
				padding: 13px;
				cursor: pointer;
				position: absolute;
				left: 0;
				top: 0;
				&:hover{
					background: $gray
				}
			}
		}
		.search{
			.picker{
				width: 94%;
				margin: 10px 3% 0 3%;
				.el-select{
					width: 70%;
					height: $selectH;
					float: left;
					input{
						height: $selectH;
					}
				}
				.el-button{
					width: 26%;
					float: right;
				}
			}
			.tabs{
				width: 100%;
				position: absolute;
				top: 125px;
				.el-tabs__item{
					font-size: 12px
				}
				.el-tabs__header{
					margin: 0;
				}
				.el-tabs__content{
					width: 100%
				}
				.emptyData{
					text-align: center;
					color: #ccc;
					margin-top: 100px;
				}
				.trackUl{
					.trackCurrent{
						background:#b3dbf9;
					}
					.trackItem{
						cursor: pointer;
						&:hover{
							background: #b3dbf9;
						}
						.track-title{
							height: $messH;
							line-height: $messH;
							background: $gray;
							.time-icon{
								font-size: 16px;
								line-height: 32px;
								padding: 0 3px 0 6px;
								color: #35be36;
							}
							.timeword{
								vertical-align: top;
							}
						}
						.track-num{
							position: relative;
							height: $messH;
							line-height: $messH;
							.map-icon{
								font-size: 24px;
								color: #20a0ff;
								vertical-align: middle;
							}
							.circle-icon{
								font-size: 16px;
								color: #20a0ff;
								vertical-align: text-bottom;
								padding-left: 15px;
							}
							.green{
								color: #35be36;
							}
							.red{
								color: red
							}
							.rightword{
								position: absolute;
								right: 0;
								padding-right: 10px;
							}
						}
					}
				}
			}
			.alarmPoints{
				width: 100%;
				position: absolute;
				top: 417px;
				.alarmCurrent{
					background: #b3dbf9;
				}
				.alarm-item{
					cursor: pointer;
					height: 32px;
					line-height: 32px;
					border-top: 1px solid $gray;
					.alarm-name{
						display: inline-block;
						padding-left: 20px;
					}
				}
			}
		}
	}
	.trackInfoDialog{
		margin-top: 0;
		margin-bottom: 0;
		width:360px;
		height:180px;
		overflow:hidden;
		font-family: 'simsun';
		font-size: 14px;
		font-weight: bold;
		color: #333;
		.BMap_pop{ 
			margin-left:5px;
			margin-top: 1px;
			visibility: visible !important;
		}
		.BMap_shadow{
			display:none
		}
		.td1{
			display:inline-block;
			margin: 5px 10px 5px 0px;
			width: 190px;
			font-size: 12px;
			font-weight: normal;
			color: #666;
		}
		.td2{
			display:inline-block;
			margin: 5px 0px;
			width: 150px;
			font-size: 12px;
			font-weight: normal;
			color: #666;
		}
		.td{
			margin-top: 6px;
			font-size: 12px;
			font-weight: normal;
			color: #666;
		}
		.titleName{
			color: #333;
			font-weight: bold;
		}
	}
	
</style>