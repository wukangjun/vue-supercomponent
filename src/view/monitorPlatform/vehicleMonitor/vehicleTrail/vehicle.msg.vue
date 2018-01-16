<template>
	<div class="cv-vehicle-msg" v-clickoutside="outHide">
		<el-badge :value="$store.state['multiCar'].carList.length" class="iconBtn" @click.native="toggle">
			<cv-icon :name="$store.getters.isMonitorOrTrack?'chart':'cheliangguanli'" scale="1.5" class="iconn"></cv-icon>
		</el-badge>
		<div class="vehicleMess" v-show="$store.getters.isPopover">
			<div v-show="$store.getters.isMonitorOrTrack">
				<div class="proptitle">
					<span class="item font">图表</span>
				</div>
				<div v-if="this.name == ''?true:false" class="noDataTip">
					<h1>数据为空</h1>
				</div>
				<component :is="name" name='line' class="propChart" :data="echartData"></component>
				<!-- <echart class="propChart" name="line" :data="echartData"></echart> -->
			</div>
			<div v-show="!$store.getters.isMonitorOrTrack">
				<div class="proptitle">
					<span class="item font">
						{{$store.getters.carCurrent.plateCode | isValue}} ({{$store.getters.carCurrent | isOnline(true)| isValue }})
					</span>
				</div>
				<el-tabs class="proptab" v-model="tabActive">
					<el-tab-pane :label="tab.title" :name="tab.id" v-for="tab in tabs" :key="tab.id">
						<cv-scrollbar class="messArea" style="height:160px">
							<component :is="tab.name"></component>
						</cv-scrollbar>
					</el-tab-pane>
				</el-tabs>
				<div class="prop-btn-group">
					<el-tooltip v-for="btn in btnList" :key="btn.text" :content="btn.text" @click.native="switchFn(btn.key)" placement="top" effect="light">
						<el-button size="small" style="margin-left:10px;width:40px" :disabled="btn.disabled">
							<cv-icon :name="btn.name"></cv-icon>
						</el-button>
					</el-tooltip>
				</div>
				<cv-scrollbar class="prop-vehicle-list" :top="scrollbarTop">
					<transition-group name="remove">
						<li class="li" :class="{'current': $store.getters.carCurrent.vehicleId==list.id?true:false}" v-for="(list, index) in $store.state['multiCar'].carList" :key="list.plateCode" @click="toggleMsg(list)">
							<span class="item font">{{list.plateCode}}</span>
							<cv-icon name="remove1" size="27" class="after icon" @click.native.stop="close(list,index)"></cv-icon>
						</li>
					</transition-group>
				</cv-scrollbar>
			</div>
		</div>
		<!-- 指令弹框 -->
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog"></component>
		</el-dialog>
	</div>
</template>

<script>
// import echarts from '@/assets/plugins/echarts'
import basic from './modules/base.vue'
import car from './modules/car.vue'
import electric from './modules/electric.vue'
import sensor from './modules/sensor.vue'
import singleCamera from './dialogCommand/singleCamera.vue'
import localCar from './dialogCommand/localCar.vue'
import localCarPassword from './dialogCommand/localCarPassword.vue'
import echart from '@/components/echart/echart.vue'
import filter from '@/utils/filter'
export default {
	components: { basic, car, electric, sensor, singleCamera, localCar, localCarPassword, echart },
	props: {
		isPopover: {
			default: false
		}
	},
	data() {
		return {
			isShow: false,
			tabActive: 'first',
			tabs: [
				{ title: '基本信息', name: 'basic', id: 'first' },
				{ title: '车辆信息', name: 'car', id: 'second' },
				{ title: '传感器', name: 'sensor', id: 'third' },
				{ title: '电气信号', name: 'electric', id: 'fourth' }
			],
			btnList: [
				{ name: 'vehicle', text: '单车', key: 'single', disabled: true },
				{ name: 'aguiji', text: '轨迹回放', key: 'track', disabled: false },
				{ name: 'monitor1', text: '拍照', key: 'single-camera', disabled: false },
				{ name: 'bofang', text: '视频', key: 'vedio', disabled: false },
				{ name: 'baojing', text: '锁车', key: 'localCar', disabled: true }
			],
			dialog: {
				title: '--',
				flag: false,
				name: '',
				size: 'dialog-tiny'
			},
			scrollbarTop: 0,
			// 默认情况下的图表数据
			defaultChart: {
				title: '--',
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: [1, 2, 3, 4, 5]
				},
				legend: {
					show: true,
					itemWidth: 15,
					top: '10px',
					left: '60px',
					data: []
				},
				yAxis: {
					type: 'value',
					axisLabel: {
						show: false
					}
				}, series: [
					{
						name: '暂无数据', type: 'line', data: [0, 0, 0, 0, 0], itemStyle: {
							normal: {
								color: '#01c302'
							}
						}
					}
				]
			},
			echartData: [],
			name: '',
			formatters: {
				tooltip: {
					formatter(val) {
						let html = "时间：" + val[0].axisValue + '<br/>';
						val.forEach(item => {
							html += item.seriesName + ':' + filter.switchState(item.data) + '<br/>';
						})
						return html;
					}
				},
				xAxis: {
					axisLabel: {
						margin: 10,
						formatter: function(value) {
							if (value) {
								return value.split(" ").join("\n");
							} else {
								return '';
							}
						},
						align: "left"
					}
				}
			}
		}
	},
	methods: {
		// 删除当前车辆
		close(list, index) {
			let detail = { id: list.id, plateCode: list.plateCode };
			this.$store.dispatch('removeVehicleList', { data: detail, type: 'removeOne' });
			if (this.$store.getters.carCurrent.vehicleId == list.id) {
				this.$store.dispatch('removeCarCurrent');
			}
		},
		outHide() {
			this.isShow = false;
			this.$store.dispatch('showPopover', false);
		},
		toggle() {
			this.isShow = !this.isShow;
			this.$store.dispatch('showPopover', this.isShow);
		},
		toggleMsg(list) {
			this.$store.dispatch('carCurrent', { id: list.id, plateCode: list.plateCode });
			if (this.$store.getters.carPoints[list.id]) {
				this.$store.dispatch('isGetBaseView', true);
				this.$map['monitorMap'].moveToCenter(this.$store.getters.carPoints[list.id].point, 17);
				this.$store.getters.carPoints[list.id].setTop(true);
			} else {
				this.$message.error('车辆(' + list.plateCode + ')暂无位置信息!');
			}
		},
		defaultEchart() {
			let model = {
				title: {
					text: '--',
					top: '8px',
					left: '10px',
					textStyle: { fontWeight: "normal", fontFamily: "微软雅黑", fontSize: "14", color: "#666" }
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'line' // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: [1, 2, 3, 4, 5]
				},
				legend: {
					show: true,
					itemWidth: 15,
					top: '10px',
					left: '60px',
					data: []
				},
				yAxis: {
					type: 'value',
					axisLabel: {
						show: false
					}
				},
				series: [
					{
						name: '暂无数据', type: 'line', data: [0, 0, 0, 0, 0], itemStyle: {
							normal: {
								color: '#01c302'
							}
						}
					}
				]
			};

			return model
		},
		// 历史轨迹的状态图表
		async trackStateChart() {
			// debugger
			let time = [], liftingState = [], loadCondition = [], openCapState = [], series = [],
				abillity = this.$store.getters.abillity ? this.$store.getters.abillity.split(',') : [];
			let params = {
				title: '状态',
				xAxis: time,
				series: series,
				legend: []
			};
			abillity.length == 0 && (this.name = '')
			if (this.$store.getters.trackLists.length > 0) {
				this.$store.getters.trackLists.forEach(val => {
					time.push(this.$filter.format(val.gpsTime, 'yyyy-MM-dd HH:mm:ss'));
					liftingState.push(this.$filter.liftingState(val.liftingState));
					loadCondition.push(this.$filter.loadCondition(val.loadCondition));
					openCapState.push(this.$filter.openCapState(val.openCapState));
				});
				abillity.forEach((ele,index) => {
					switch (ele) {
						case '5':
							series.push({
								name: '车斗举升', type: 'line', data: liftingState,
								itemStyle: { normal: { color: '#01c302' } }
							});
							params.legend.push({ name: '车斗举升' })
							break;
						case '4':
							series.push({
								name: '顶盖开启', type: 'line', data: openCapState,
								itemStyle: { normal: { color: '#f9a000' } }
							});
							params.legend.push({ name: '顶盖开启' })
							break;
						case '2':
							series.push({
								name: '承重状态', type: 'line', data: loadCondition,
								itemStyle: { normal: { color: '#008ce5' } }
							});
							params.legend.push({ name: '承重状态' })
							break;
						case '3':
							series.push({
								name:'速度',type:'line',data:[],
								itemStyle:{normal:{color:'red'}}
							})
						break;
					}
				})
				this.name = 'echart';
				this.echartData = await this.$store.dispatch('editEchart', params)
			} else {
				this.name = '';
				this.echartData = this.defaultEchart()
			}
		},
		switchFn(name) {
			switch (name) {
				case 'single-camera': return this.singleCamera();
				case 'localCar': return this.localCar();
				case 'vedio': return this.jumpVedio();
				case 'track': return this.jumpTrack();
			}
		},
		// 单车拍照指令
		singleCamera() {
			// 弹框显示设置
			if (this.$store.getters.carCurrent.vehicleId) {
				this.dialog.flag = true;
				this.dialog.size = 'dialog-tiny';
				this.dialog.name = 'singleCamera';
				this.dialog.title = `单车拍照(${this.$store.getters.carCurrent.plateCode})`;
			} else {		
				this.$message.error('请选择有位置信息的车辆');
			}
		},
		// 锁车指令
		localCar() {
			this.dialog.flag = true;
			this.dialog.size = 'dialog-tiny';
			this.dialog.name = 'localCar';
			this.dialog.title = `锁车(${this.$store.getters.carCurrent.plateCode})`;
		},
		// 跳转视频页面
		jumpVedio(){
			if(this.$store.getters.carCurrent.vehicleId){
				this.$store.dispatch('getVideoLogin', this.$store.getters.carCurrent.vehicleId);
			}else{
				this.$message.error('请选择车辆');         
			}
		},
		// 跳转历史轨迹
		jumpTrack(){
			let vehicleId = this.$store.getters.carCurrent.vehicleId,
				plateCode = this.$store.getters.carCurrent.plateCode;
			if(vehicleId){
				let winParams = this.$service.winParams('/monitor/historyTrack', {
					id: vehicleId,
					plateCode: plateCode
				});
				this.$service.winOpen(winParams);
			}else{
				this.$message.error('请选择车辆');
			}
		}
	},
	watch: {
		'$store.getters.isPopover'(newVal) {
			// console.log(newVal,this.$store.getters.isMonitorOrTrack)
			if (newVal && this.$store.getters.isMonitorOrTrack) {
				setTimeout(_ => {
					this.trackStateChart();
				}, 0)
			}
		},
		'$store.getters.isMonitorOrTrack'(newVal) {
			// console.log(newVal)
			!newVal && (this.name = '');
			newVal && (this.name = 'echart')
		},
		'$store.getters.carCurrent.vehicleId'(newVal){
			let index = this.$store.state['multiCar'].carList.findIndex(val => {
				return val.id == newVal;
			})
			this.scrollbarTop = index * 41;
		}
	}
}
</script>

<style lang="scss">
$propW: 350px;
$size: 40px;
$height: 250px;
$color: #fff;
$blue: #20a0ff;
$titleH: 40px;
$shadow: 1px 2px 1px rgba(0, 0, 0, .15);
.cv-vehicle-msg {
	.vehicleMess {
		width: $propW;
		min-height: 310px;
		position: absolute;
		right: 10px;
		top: 65px;
		background: #fff;
		box-shadow: $shadow;
		&:before {
			content: "";
			width: 0;
			height: 0;
			border-left: 8px solid transparent;
			border-right: 8px solid transparent;
			border-bottom: 14px solid $blue;
			position: absolute;
			right: 10px;
			top: -10px;
		}
		.noDataTip{
			color:#ccc;
			position: absolute;
			top:50%;
			left:50%;
			transform: translate(-50%)
		}
	}
	.iconBtn {
		position: absolute;
		right: 0px;
		width: $size;
		height: $size;
		border-radius: $size/2;
		background: #fff;
		line-height: $size;
		text-align: center;
		margin: 10px;
		cursor: pointer;
		box-shadow: $shadow;
		.el-badge__content.is-fixed {
			top: 2px;
			right: 15px;
		}
		.iconn {
			color: $blue;
			padding: 7px 9px;
		}
	}
}

.proptitle {
	height: $titleH;
	line-height: 35px;
	background: $blue;
	.before,
	.item {
		float: left;
		color: $color;
		padding: 2px;
	}
	.font {
		font-size: 14px;
		padding-left: 5px;
	}
	.after {
		float: right;
		color: $color;
	}
}

.propChart {
	width: $propW - 20px;
	height: 250px;
	margin: 10px 10px;
}

.proptab {
	background: #fff;
	height: $height - $titleH;
	position: absolute;
	width: 100%;
	.messArea {
		height: 160px;
		padding: 0 10px;
		.item {
			height: 24px;
			.el-col:first-child {
				text-align: right;
			}
			.el-col:last-child {
				text-align: left;
			}
		}
	}
	.el-tabs__item {
		font-size: 12px;
	}
}

.prop-btn-group {
	position: absolute;
	top: $height+10px;
	background: #fff;
	padding-bottom: 10px;
	width: 100%;
	text-align: center;
	.el-button+.el-button {
		margin: 5px 0 0 0;
	}
}

.prop-vehicle-list {
	position: absolute;
	top: $height+20px;
	width: 100%;
	height: 180px;
	.remove-leave-active{
		transition: all .3s ease;
		margin-left: -80px;
	}
	.li {
		height: $titleH;
		line-height: $titleH;
		background: #fff;
		border-bottom: 1px solid #d1dbe5;
		clear: both;
		&:hover {
			background: #ebebeb;
			cursor: pointer;
		}
		.before,
		.item {
			float: left;
			color: #48576a
		}
		.font {
			font-size: 12px;
			padding-left: 5px;
		}
		.after {
			float: right;
			color: #c3ccd5;
		}
		.icon {
			padding: 7px
		}
	}
	.current {
		background: #ebebeb
	}
}
</style>