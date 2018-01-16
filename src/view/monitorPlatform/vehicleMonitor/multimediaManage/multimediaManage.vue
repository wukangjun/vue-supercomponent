<template>
	<div class="cv-multimedia-manage">
		<cv-header :inline="true" class="cv-header">
			<el-form-item label="类型:">
				<el-select v-model="operation.multimedia1" style="width:80px" size="small">
					<el-option label="全部" value=""></el-option>
					<el-option label="图像" value="0"></el-option>
					<el-option label="音频" value="1"></el-option>
					<el-option label="视频" value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="格式:">
				<el-select v-model="operation.multimedia2" style="width:80px" size="small">
					<el-option label="全部" value=""></el-option>
					<el-option label="JPEG" value="0"></el-option>
					<el-option label="TIF" value="1"></el-option>
					<el-option label="MP3" value="2"></el-option>
					<el-option label="WAV" value="3"></el-option>
					<el-option label="WMV" value="4"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="起止日期:">
				<div class="block">
					<el-date-picker v-model="operation.times" placeholder="选择时间范围" type="datetimerange" size="small" :editable="false" style="width:300px">
					</el-date-picker>
				</div>
			</el-form-item>
			<el-form-item style="float:right">
				<!-- <div class="buton">
		        		<el-button type="primary" size="small" @click="single($store.getters.ptSingleCar)" icon="search">搜索</el-button>
		        	</div> -->
				<cv-tool style="margin:0;" :name="$route.name" :data="$store.getters.monitorMenu" class="cv-tool" :is-export="false" :is-remove="false" :is-add="false" :is-modify="false" @search="single($store.getters.ptSingleCar)"></cv-tool>
			</el-form-item>
		</cv-header>
		<cv-content>
			<el-tabs v-model="activeName2" @tab-click="handleClick">
				<el-tab-pane label="列表信息" name="first">
					<!-- 表格 -->
					<!-- <cv-scrollbar class="cvs"> -->
					<cv-grid class="multimediaGrid" :options="multimediaListGrid.options" @load="listMessage(false)">
						<el-table border stripe :data="multimediaListGrid.table" max-height="500" v-loading="multimediaListGrid.loading" :max-height="this.$service.getAutoHeight(1,1)">
							<el-table-column label="车牌号码" prop="plateCode" min-width="100px"></el-table-column>
							<el-table-column label="车牌颜色" prop="plateColor" :formatter="plateColor" min-width="100px"></el-table-column>
							<el-table-column label="类型" prop="mediaType" :formatter="mediaType"></el-table-column>
							<el-table-column label="格式" prop="format" :formatter="format"></el-table-column>
							<el-table-column label="触发事件类型" prop="eventType" :formatter="eventType" min-width="130px"></el-table-column>
							<el-table-column label="上传时间" prop="upTime" :formatter="upTime" width="200"></el-table-column>
							<el-table-column label="操作" prop="operation" width="100">
								<template scope="scope">
									<cv-span type="info" @click.native="check(scope)">{{examine}}</cv-span>
								</template>
									</el-table-column>
								</el-table>
							</cv-grid>
				    </el-tab-pane>
				    <el-tab-pane label="图片预览" name="second" class="box">
						<center>{{msg}}</center>
				    	<cv-scrollbar class="cvs">
				    		<ul class="loadding" style="margin-top:20px">
								<li class="card" v-for="item in imgpic" :key="item.id">
									<el-card body-style="padding:0px;border:0;">
									<el-tooltip placement="right" >
										<div slot="content" style="max-width:200px">
												<h2>详细信息</h2>
												<p>速度:<span style="padding-left:3px;">{{item.dspeed}}</span>km/h</p>
												<p>GPS速度:<span style="padding-left:3px;">{{item.gpsSpeed}}</span>km/h</p>
												<p>里程:<span style="padding-left:3px;">{{item.mileage}}</span>km</p>
												<p>方向:<span style="padding-left:3px;">{{item.direction}}</span></p>
												<p>ACC状态:<span style="padding-left:3px;">{{item.accStatus}}</span></p>
												<p>定位状态:<span style="padding-left:3px;">{{item.locationStatus}}</span></p>
												<p>驾驶员:<span style="padding-left:3px;">{{item.driver}}</span></p>
												<p>报警信息:<span style="padding-left:3px;">{{item.alarmText}}</span></p>
										</div>
										<img :src="item.url" class="image">
									</el-tooltip>
									<div style="padding: 14px;">
										<span>车牌号码:</span><span>{{item.carCode}}</span>
										<span style="padding-left:20px;">触发方式:</span><span>{{item.eventTypes}}</span>
										<div class="clearfix">
										<time class="time">上传时间:<span>{{item.uploadingTime}}</span></time>
										</div>
									</div>
									</el-card>
								</li>
							</ul>
							<pagination :options='multimediaImgList.options' @load="photoViewer(false)" style='position: absolute;bottom:10px;right:20px;background-color:white;'></pagination>
						</cv-scrollbar>
				    </el-tab-pane>
					 <el-tab-pane label="音频预览" name="third" class="box">
						<center>{{msg}}</center>
				    	<cv-scrollbar class="cvs">
				    		<ul class="audioLoad" style="margin-top:20px">
								<li class="card" v-for="item in audios" :key="item.id" style='height:150px'>
									<el-card body-style="padding:0px;border:0;">
										<audio :src="item.src" ></audio> 
										<center><a :href="item.src" target="_blank" >下载</a></center>
									<div style="padding: 14px;">
										<span>车牌号码:</span><span>{{item.carCode}}</span>
										<span style="padding-left:20px;">触发方式:</span><span>{{item.eventTypes}}</span>
										<div class="clearfix">
										<time class="time">上传时间:<span>{{item.uploadingTime}}</span></time>
										</div>
									</div>
									</el-card>
								</li>
							</ul>
						<pagination :options='multimediaAudioList.options' @load="audioViewer(false)" style='position: absolute;bottom:10px;right:20px;background-color:white;'></pagination>
						</cv-scrollbar>
				    </el-tab-pane>
					<el-tab-pane label="视频预览" name="four" class="box">
						<center>{{msg}}</center>
				    	<cv-scrollbar class="cvs">
				    		<ul class="videoLoad" style="margin-top:20px">
								<li class="card" v-for="item in videos" :key="item.id">
									<el-card body-style="padding:0px;border:0;">
										<video :src="item.src" controls="controls"></video> 
										<center><a :href="item.src" target="_blank" >下载</a></center>
									<div style="padding: 14px;">
										<span>车牌号码:</span><span>{{item.carCode}}</span>
										<span style="padding-left:20px;">触发方式:</span><span>{{item.eventTypes}}</span>
										<div class="clearfix">
										<time class="time">上传时间:<span>{{item.uploadingTime}}</span></time>
										</div>
									</div>
									</el-card>
								</li>
							</ul>
							<pagination :options='multimediaVideoList.options' @load="videoViewer(false)" style='position: absolute;bottom:10px;right:20px;background-color:white;'></pagination>
						</cv-scrollbar>
				    </el-tab-pane>
			</el-tabs>
		</cv-content>
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
				<component :is="dialog.name" :options="dialog"></component>
		</el-dialog>
	</div>
</template>

<script type="text/javascript">
	import prot from './index.js'
	import imgg from './imgpic.vue'
	import pagination from '@/components/grid/pagination.vue'
	export default {
		components: {
			imgg,
			pagination
		},
		mixins: [prot],
		data() {
			return {
				// 操作栏
				operation: {
					time: [
						this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd start')),
						this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd end'))
					],
					times: [],
					multimedia1: '',
					multimedia2: '',
					multimedia3: '',
					multimedia4:'',
					vehicleId: [],
					mediaType: '',
					starttime: null,
					endtime: null,
					alarmTypes: []
				},
				imgpic: [],
				audios: [],
				videos:[],
				examine: '',
				handleClickName: 'first',
				dialog: {
					flag: false,
					title: '',
					size: 'small',
					name: '',
				},
				//多媒体管理列表
				multimediaListGrid: {
					options: {
						current: 1,
						size: 10,
						total: 0,
						flag: false
					},
					loading:false,
					table: [],
					vehicleId: '' //车辆Id
				},
				//多媒体管理图片列表
				multimediaImgList: {
					options: {
						current: 1,
						size: 10,
						total: 0,
						flag: false
					},
					table: [],
					vehicleId: '' //车辆Id
				},
				//多媒体管理音频列表
				multimediaAudioList: {
					options: {
						current: 1,
						size: 10,
						total: 0,
						flag: false
					},
					table: [],
					vehicleId: '' //车辆Id
				},
				//多媒体管理音频列表
				multimediaVideoList: {
					options: {
						current: 1,
						size: 10,
						total: 0,
						flag: false
					},
					table: [],
					vehicleId: '' //车辆Id
				},
				activeName2: 'first',
				msg: ''
			}
		},
		methods: {
			single(val) {
				if (!val.id) {
					this.$message.warning('请先选择车辆')
					return false
				}
				this.operation.vehicleId = val;
				if (this.handleClickName == "first") {
					this.listMessage(true)
				}
				if (this.handleClickName == "second") {
					this.photoViewer()
				}
				if (this.handleClickName == "third") {
					this.audioViewer()
				}
				if (this.handleClickName == "four") {
					this.videoViewer()
				}
			},
			handleClick(tab, event) {
				// console.log(tab, event)
				// console.log(tab.name)
				this.handleClickName = tab.name
				if (this.operation.vehicleId.length != 0 && tab.name == 'third') {
					this.audioViewer()
				}
				if (this.operation.vehicleId.length != 0 && tab.name == 'second') {
					this.photoViewer()
				}
				if (this.operation.vehicleId.length != 0 && tab.name == 'four') {
					this.videoViewer()
				}
				if (tab.name == 'first' && this.operation.vehicleId.length != 0) {
					this.listMessage()
				}
			},
			//列表信息
			listMessage(flag) {
				if (flag) {
					this.multimediaListGrid.options.flag = true;
					this.multimediaListGrid.options.current = 1;
				} else {
					this.multimediaListGrid.options.flag = false;
				}
				this.multimediaListGrid.loading = true;
				let params = {
					vehicleIds: this.operation.vehicleId.id,
					startTime: this.$filter.format(this.operation.times[0], 'yyyy-MM-dd HH:mm:ss'),
					endTime: this.$filter.format(this.operation.times[1], 'yyyy-MM-dd HH:mm:ss'),
					format: this.operation.multimedia2,
					mediaType: this.operation.multimedia1,
					current: this.multimediaListGrid.options.current,
					size: this.multimediaListGrid.options.size ? this.multimediaListGrid.options.size :10
				};
				this.getMultimediaSearch(params).then((data) => {
					// console.log(data.data.records)
					this.multimediaListGrid.loading = false;
					this.multimediaListGrid.table = data.data.records;
					this.multimediaListGrid.options.current = data.data.current;
					this.multimediaListGrid.options.size = data.data.size;
					this.multimediaListGrid.options.total = data.data.total;
					var vall = data.data.records
					if (vall != undefined) {
						for (var i = 0; i < vall.length; i++) {
							if (vall[i].mediaType == 0) {
								this.examine = '查看'
							}
							if (!vall[i].mediaType == 0) {
								this.examine = '播放'
							}
						}
					} else {
						this.msg = "没有查询到车辆媒体数据";
					}
				}).catch(() => {
					this.multimediaListGrid.loading = false;
				});
			},
			//图片查看
			photoViewer(flag) {
				this.msg = "";
				if (flag) {
					this.multimediaImgList.options.flag = true;
					this.multimediaImgList.options.current = 1;
				} else {
					this.multimediaImgList.options.flag = false;
				}
				let loadingInstance = this.$loading({
					target: document.querySelector('.loadding')
				});
				this.imgpic = []
				let params = {
					vehicleIds: this.operation.vehicleId.id,
					mediaType: 0,
					startTime: this.$filter.format(this.operation.times[0], 'yyyy-MM-dd HH:mm:ss'),
					endTime: this.$filter.format(this.operation.times[1], 'yyyy-MM-dd HH:mm:ss'),
					format: this.operation.multimedia2,
					current: this.multimediaImgList.options.current,
					size: this.multimediaImgList.options.size,
				};
				// console.log(params)
				this.getMultimediaSearch(params).then((data) => {
					// console.log(data.data.records)
					this.msg = "没有查询到车辆图片数据";
					loadingInstance.close();
					if (data.flag && data.errorCode != 208) {
						var vall = data.data.records;
						this.multimediaImgList.options.size = data.data.size;
						this.multimediaImgList.options.current = data.data.current;
						this.multimediaImgList.options.total = data.data.total;
						if (vall && vall.length > 0) {
							this.msg = "";
							for (var i = 0; i < vall.length; i++) {
								this.imgpic.push({
									'url': vall[i].mediaPath,
									'carCode': vall[i].plateCode,
									'uploadingTime': this.$filter.format(vall[i].upTime, "yyyy-MM-dd HH:mm:ss"),
									'eventTypes': this.$filter.eventType(vall[i].eventType),
									'dspeed': vall[i].dspeed,
									'gpsSpeed': vall[i].gpsSpeed,
									'mileage': vall[i].mileage,
									'direction': this.$filter.direction(vall[i].direction),
									'accStatus': this.$filter.accStatus(vall[i].accStatus),
									'locationStatus': this.$filter.locationStatus(vall[i].locationStatus),
									'driver': vall[i].driver,
									'alarmText': vall[i].alarmText
								})
							}
						}
					} else {
						this.multimediaImgList.options.size = 10;
						this.multimediaImgList.options.current = 1;
						this.multimediaImgList.options.total = 0;
					}
				}).catch(() => {
					loadingInstance.close();
				});
			},
			// 音频播放
			audioViewer(flag) {
				if (flag) {
					this.multimediaAudioList.options.flag = true;
					this.multimediaAudioList.options.current = 1;
				} else {
					this.multimediaAudioList.options.flag = false;
				}
				let loadingInstance = this.$loading({
					target: document.querySelector('.audioLoad')
				});
				this.audios = [];
				let params = {
					vehicleIds: this.operation.vehicleId.id,
					mediaType: 1,
					startTime: this.$filter.format(this.operation.times[0], 'yyyy-MM-dd HH:mm:ss'),
					endTime: this.$filter.format(this.operation.times[1], 'yyyy-MM-dd HH:mm:ss'),
					format: this.operation.multimedia2,
					current: this.multimediaAudioList.options.current,
					size: this.multimediaAudioList.options.size,
				};
				// console.log(params)
				this.getMultimediaSearch(params).then((data) => {
					// console.log(data.data.records)
					this.msg = "没有查询到车辆音频数据";
					loadingInstance.close();
					if (data.flag && data.errorCode != 208) {
						var vall = data.data.records;
						this.multimediaAudioList.options.size = data.data.size;
						this.multimediaAudioList.options.current = data.data.current;
						this.multimediaAudioList.options.total = data.data.total;
						if (vall && vall.length > 0) {
							this.msg = "";
							for (var i = 0; i < vall.length; i++) {
								this.audios.push({
									'src': vall[i].mediaPath,
									'carCode': vall[i].plateCode,
									'uploadingTime': this.$filter.format(vall[i].upTime, "yyyy-MM-dd HH:mm:ss"),
									'eventTypes': this.$filter.eventType(vall[i].eventType),
									'dspeed': vall[i].dspeed,
									'gpsSpeed': vall[i].gpsSpeed,
									'mileage': vall[i].mileage,
									'direction': this.$filter.direction(vall[i].direction),
									'accStatus': this.$filter.accStatus(vall[i].accStatus),
									'locationStatus': this.$filter.locationStatus(vall[i].locationStatus),
									'driver': vall[i].driver,
									'alarmText': vall[i].alarmText
								})
							}
						}
					} else {
						this.multimediaAudioList.options.size = 10;
						this.multimediaAudioList.options.current = 1;
						this.multimediaAudioList.options.total = 0;
					}
				}).catch(() => {
					loadingInstance.close();
				});
			},
			videoViewer(flag) {
				this.msg = "";
				if (flag) {
					this.multimediaVideoList.options.flag = true;
					this.multimediaVideoList.options.current = 1;
				} else {
					this.multimediaVideoList.options.flag = false;
				}
				let loadingInstance = this.$loading({
					target: document.querySelector('.videoLoad')
				});
				this.videos = []
				let params = {
					vehicleIds: this.operation.vehicleId.id,
					mediaType: 2,
					startTime: this.$filter.format(this.operation.times[0], 'yyyy-MM-dd HH:mm:ss'),
					endTime: this.$filter.format(this.operation.times[1], 'yyyy-MM-dd HH:mm:ss'),
					format: this.operation.multimedia2,
					current: this.multimediaVideoList.options.current,
					size: this.multimediaVideoList.options.size,
				};
				// console.log(params)
				this.getMultimediaSearch(params).then((data) => {
					// console.log(data.data.records)
					this.msg = "没有查询到车辆视频数据";
					loadingInstance.close();
					if (data.flag && data.errorCode != 208) {
						var vall = data.data.records;
						this.multimediaVideoList.options.size = data.data.size;
						this.multimediaVideoList.options.current = data.data.current;
						this.multimediaVideoList.options.total = data.data.total;
						if (vall && vall.length > 0) {
							this.msg = "";
							for (var i = 0; i < vall.length; i++) {
								this.videos.push({
									'src': vall[i].mediaPath,
									'carCode': vall[i].plateCode,
									'uploadingTime': this.$filter.format(vall[i].upTime, "yyyy-MM-dd HH:mm:ss"),
									'eventTypes': this.$filter.eventType(vall[i].eventType),
									'dspeed': vall[i].dspeed,
									'gpsSpeed': vall[i].gpsSpeed,
									'mileage': vall[i].mileage,
									'direction': this.$filter.direction(vall[i].direction),
									'accStatus': this.$filter.accStatus(vall[i].accStatus),
									'locationStatus': this.$filter.locationStatus(vall[i].locationStatus),
									'driver': vall[i].driver,
									'alarmText': vall[i].alarmText
								})
							}
						}
					} else {
						this.multimediaVideoList.options.size = 10;
						this.multimediaVideoList.options.current = 1;
						this.multimediaVideoList.options.total = 0;
					}
				}).catch(() => {
					loadingInstance.close();
				});
			},
			check(scope) {
				if(scope.row.mediaType==0){
					this.dialog.flag = true;
					this.dialog.name = 'imgg';
					this.dialog.title = '图片查看';
					this.dialog.size = 'dialog-tiny'
					this.dialog.imgurl = scope.row.mediaPath
				}else{
					this.$service.blank(scope.row.mediaPath);
				}
				
			},
			//车牌过滤
			plateColor(vall) {
				return this.$filter.plateCodeColor(vall.plateColor)
			},
			//类型过滤
			mediaType(vall) {
				return this.$filter.mediaType(vall.mediaType)
			},
			//格式过滤
			format(vall) {
				return this.$filter.formatter(vall.format)
			},
			//触发事件过滤
			eventType(vall) {
				return this.$filter.eventType(vall.eventType)
			},
			//上传时间过滤
			upTime(vall) {
				return this.$filter.format(vall.upTime, 'yyyy-MM-dd HH:mm:ss')
			}
		},
		watch: {
			// '$store.getters.ptSingleCar'(newVal){
			// 	this.single(newVal);
			// 	console.log(newVal)
			// }
		}
	}
</script>

<style lang="scss">
	.cv-multimedia-manage {
		.el-tabs {
			.el-tabs__content {
				position: absolute;
				top: 55px;
				left: 10px;
				right: 10px;
				bottom: 0px;
				.cvs {
					position: absolute;
					top: 0px;
					left: 0px;
					right: 0px;
					bottom: 50px;
					padding: 0 10px 0 0;
				}
				// .el-pagination{
				// 	position: absolute;
				// 	bottom: 0px;
				// 	right: 0px;
				// }
			}
		}
		.card {
			width: 320px;
			height: 304px;
			float: left;
			margin-right: 10px;
			margin-bottom: 10px;
			.time {
				font-size: 13px;
				color: #999;
			}
			.bottom {
				margin-top: 13px;
				line-height: 12px;
			}
			.button {
				padding: 0;
				float: right;
			}
			.image {
				width: 320px;
				height: 240px;
				display: block;
			}
			.clearfix:before,
			.clearfix:after {
				display: table;
				content: "";
			}
			.clearfix:after {
				clear: both
			}
		}
	}
</style>