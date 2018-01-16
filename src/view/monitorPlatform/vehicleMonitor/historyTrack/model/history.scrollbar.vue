<template>
	<div class="cv-track-list" :style="{bottom:isToggle?0:'-200px'}">
		<ul class="tab-header bg">
			<li class="tab-head-item" @click="toggleTree" v-if="isTree">
				<cv-icon name="zuzhi1" color="#969696"></cv-icon>
			</li>
			<li class="tab-head-item" v-for="(title, index) in titles" :key="title.key" @click="tabChange(title.key, index)" :class="[cur == index ? 'tab-item-on':'']">
				<span class="tab-item-text"><cv-icon :name="title.icon"></cv-icon>{{title.name}}</span>
				<span class="tab-item-num" :style="{color: title.color}">
					{{index == 0 ? $store.getters['trackLists'].length : ""}}
				</span>
			</li>
			<li class="tab-head-item">
				<cv-play :data='allDataInfo' :points='allPoint' :selectedVehicle='plateCode' :mapName="mapName"></cv-play>
			</li>
			<li class="tab-head-item toggle-style" @click="toggle">
				<cv-icon
				style="vertical-align:middle" 
				color="#969696"
				size="24"
				:name="isToggle ? 'xialajiantou': 'shanglajiantou-copy'"></cv-icon>
			</li>
			<li class="tab-head-item toggle-style">
				<el-button size="small" type="success" @click="exportExcel" icon="upload">导出</el-button>
			</li>
		</ul>
		<div class="tab-content-detail history-content-detail">
			<vehicle-list class="every-detail"
			:style="{'top': key=='list'?0: '9999px'}"></vehicle-list>
			<echart name="line" class="every-detail"
			:data="$store.getters.canData"
			:style="{'top': key=='can'?0: '9999px'}"
			ref="canEchart"></echart>
			<echart name="line" class="every-detail"
			:data="$store.getters.abillity"
			:style="{'top': key=='ability'?0: '9999px'}"
			ref="abilityEchart"></echart>
		</div>
	</div>
</template>

<script>
	import vehicleList from './vehicle.list.vue'
	import echart from '@/components/echart/echart.vue'
	import { saveAs } from 'file-saver'
	import cvPlay from '@/components/play/play.vue'
	import XLSX from 'xlsx'
	export default{
		components: {
			vehicleList,
			echart,
			cvPlay
		},
		props: {
			data: {},
			// 接受是否更新的信号---- 如果值为'one'则不轮询
			current: {},
			all: {},
			// 当前车辆id
			currentId: {},
			isTree: {
				default: false
			},
			plateCode: {
				default() {
					return {
						plateCode: "",
						vehicleId: ""
					};
				}
			},
			titles: {
				default(){
					return [
						{name: 'GPS点信息', key: 'list', color: '#f39d38', icon: 'cheliangjiankong'},
						{name: 'CAN信息曲线图', key: 'can', color: '#3992e4',icon: 'vehicle-group'},
						{name: '能力项曲线图', key: 'ability', color: '#66ab5b', icon: 'tingzhi'}
					]
				}
			}
		},
		data(){
			return{
				name: 'vehicleList',
				show: false,
				mapName:"map",
				// 当前显示的内容索引
				cur: 0,
				// 当前显示内容的键值对
				key: 'list',
				pagination: 0,
				isToggleTree: false,
				isToggle: false,
				timer: null,
				chartColorOptions: {

				},
				allDataInfo:[],
				allPoint:[],
				// ability 能力项 options
				ability: {},
				// can options
				can: {}
			}
		},
		methods:{
			// 手动
			tabChange(key, index){
				this.$store.dispatch("isTogglePanelList", false);
				this.key = key;
				this.isToggle = true;
				this.cur = index;
				switch(key){
					case 'list':
						this.name = 'vehicleList';
					break;
					case 'ability':
						this.name = 'echart';
					break;
					case 'can':
						this.ability = {
							
						};
					break;

				};
			},
			// 双向开启树
			toggleTree(){	
				this.$emit('history-panel');
			},
			// 双向开启面板
			toggle(){
				this.isToggle = this.$store.getters.isTogglePanelList;
				this.$store.dispatch('isTogglePanelList',!this.isToggle)
			},
			// 导出表格
			exportExcel(){
				switch(this.key){
					case 'list': return this.listExport();
					case 'can': return this.chartExport(this.$refs['canEchart'].getEchart());
					case 'ability': return this.chartExport(this.$refs['abilityEchart'].getEchart());
				}
			},
			// 列表导出
			listExport(){
				const data = this.$store.getters.trackLists;
				const stringArrayBuffer = s => {
					const buf = new ArrayBuffer(s.length);
			        const view = new Uint8Array(buf);
			        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
			        return buf;
				};
				const exportfile = (data, mimeType, fileName, fileExtension) => {
					const wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} };
					wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data);
					saveAs(new Blob([
						stringArrayBuffer(XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary'}))],
						{type: mimeType + ";" + "charset=utf-8"}), 
						fileName + fileExtension);
				};
				const array = [];
				data.forEach(val => {
					array.push({
						'GPS速度(km/h)': val.gpsSpeed,
						'行驶速度(km/h)': val.dspeed,
						'GPS时间': this.$filter.format(val.gpsTime,'yyyy-MM-dd HH:mm:ss'),
						'方向': val.directionText,
						'海拔(m)': val.height,
						'油耗': val.oilMass,
						'报警总数': val.alarmCount,
						'位置': val.locationDesc
					})
				});
				const fileName = '轨迹详情';
				const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
				const fileExtension = '.xlsx';
				exportfile(array, mimeType, fileName, fileExtension);		
			},
			// 图表导出功能
			chartExport(chart){
				let url = chart.getDataURL({type:'png'});
				if(this.$service.isIe()){
					let bstr = atob(url.split(',')[1]);
					let len = bstr.length;
					let u8arr = new Uint8Array(len);
					while(len--){
						u8arr[len] = bstr.charCodeAt(len);
					}
					let blob = new Blob([u8arr]);
					window.navigator.msSaveOrOpenBlob(blob, 'hello.png');
				}else{
					const save_link = document.createElement('a');
					save_link.href = url;
					save_link.download = name || 'jiankong';
					save_link.target = '_blank';
					//let event = document.createEvent('MouseEvents');
					var event = new MouseEvent('click', {
						view: window,
						bubbles: true,
						cancelable: false
					});
					save_link.dispatchEvent(event);
				}
			}
		},
		watch: {
			"$store.getters.isToggleHistoryTree"(newVal){
				newVal && (this.isToggle = false)
			},
			"$store.getters.allTrackPoints"(newVal){
				this.allPoint=newVal;
			},
			"$store.getters.trackLists"(newVal){
				this.allDataInfo=newVal;
			}
		}
	}
</script>

<style lang="scss">
	$thirty: 30px;
	.cv-track-list{
		width: 100%;
		
		.tab-item{
			text-align: center;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.bg{
			background: #161616;
		}
		.tab-header,.tab-row{
			height: 39px;
			line-height: 37px;
			.tab-item-on{
				background: #213b52;
				color: #3b90e1
			}
			.tab-head-item{
				display: inline-block;
				padding: 0 10px;
				cursor: pointer;
				.tab-item-text{
					color: #9a9a9a;
				}
				.tab-item-num{
					font-size: 20px;
					color: #f29c39;
				}
			}
			.toggle-style{
				float: right;
				vertical-align: middle;
			}
			.tab-item:last-child{
				border-right: 0;
			}
		}
		.history-content-detail{
			width: 100%;
			height: 200px;		
			position: relative;
			.every-detail{
				background: black !important;
				opacity: 0.8;
				width: 100%;
				height: 200px;
				position: absolute;
				left: 0;
				right: 0;
				top: 9999px;
			}
		}
		.tab-content-detail{
			.el-row{
				height: $thirty;
				line-height: $thirty;
				background: #26210e;
				opacity: 0.9;
				.tab-item{
					color: #4186d3;
				}
			}
		}
		.tab-content{
			width: 100%;
			background: black;
			opacity: 0.7;
			.on{
				background: #272726;
			}
			.tab-content-item{
				color: #d7d6d0;
				height: 32px;
				line-height: 32px;
				border-bottom: 1px solid #373736;	
				cursor: pointer;
				.tab-item{
					display: inline-block;
					text-align: center;
				}		
			}
		}
	}
</style>