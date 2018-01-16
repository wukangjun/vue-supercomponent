<template>
	<div class="cv-track-list" ref="bottomDetail" v-show="show">
		<!-- 图例信息 -->
		<el-popover
			ref="carInfo"
			placement="top"
			width="180"
			trigger="hover">
			<map-legend></map-legend>
		</el-popover>	
		<ul class="tab-header bg">
			<li class="tab-head-item" @click="toggleTree" v-if="isTree">
				<cv-icon name="zuzhi1" color="#969696"></cv-icon>
			</li>
			<li class="tab-head-item" v-for="(title, index) in titles" :key="title.key" @click="tabChange(title.key, index)" :class="[cur == index ? 'tab-item-on':'']">
				<span class="tab-item-text"><cv-icon :name="title.icon"></cv-icon>{{title.name}}</span>
				<span class="tab-item-num" :style="{color: title.color}">{{title.count}}</span>
			</li>
			<li class="tab-head-item" v-popover:carInfo>
				<cv-icon name="tixing" color="#969696"></cv-icon>
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
		<div class="tab-content-detail" v-show="isToggle" style="overflow:auto">
			<el-row>
				<el-col :span="2" class="tab-item">车牌号</el-col>
				<el-col :span="2" class="tab-item">在线状态</el-col>
				<el-col :span="2" class="tab-item">定位状态</el-col>
				<el-col :span="1" class="tab-item">方向</el-col>
				<el-col :span="3" class="tab-item">GPS速度(km/h)</el-col>
				<el-col :span="3" class="tab-item">行驶速度(km/h)</el-col>
				<el-col :span="2" class="tab-item">GPS时间</el-col>
				<el-col :span="3" class="tab-item">位置</el-col>
				<el-col :span="2" class="tab-item">海拔(m)</el-col>
				<el-col :span="2" class="tab-item">报警信息</el-col>
				<el-col :span="2" class="tab-item">所属企业</el-col>
			</el-row>
			<cv-scrollbar class="tab-content" ref="pagination" :toBottom="toBottomCallback" @click.native="scrollbarEvent($event)">
				<li 
					:num="index"
					ref="list" 
					class="tab-content-item" 
					:class="{'on': (currentId==data.vehicleId)&&data.vehicleId?true:false}"
					v-for="(data, index) in currentDatas" :key="data.id">
					<el-col :span="2" class="tab-item">{{data.plateCode}}</el-col>
					<el-col :span="2" class="tab-item">{{data | isOnline(true)| isValue}}</el-col>
					<el-col :span="2" class="tab-item">{{data.locateStatus | isLocatiion| isValue}}</el-col>
					<el-col :span="1" class="tab-item">{{data.directionText|direction|isValue}}</el-col>
					<el-col :span="3" class="tab-item">{{data.gpsSpeed | isValue}}</el-col>
					<el-col :span="3" class="tab-item">{{data.dspeed | isValue}}</el-col>
					<el-col :span="2" class="tab-item"
					@mouseenter.native="handleCellMouseEnter($event, data)"
					@mouseleave.native="mouseoverHideTip('tooltip')">
						{{data.gpsTime | format('yyyy-MM-dd HH:mm:ss')|isValue}}
					</el-col>
					<el-col :span="3" class="tab-item"
					@mouseenter.native="handleCellMouseEnter($event, data)"
					@mouseleave.native="mouseoverHideTip('tooltip')">
						{{data.locationDesc|isValue}}
					</el-col>
					<el-col :span="2" class="tab-item">{{data.height|isValue}}</el-col>
					<el-col :span="2" class="tab-item"
					@mouseenter.native="handleCellMouseEnter($event, data)"
					@mouseleave.native="mouseoverHideTip('tooltip')">
						{{data.alarmShortInfo|isValue}}
					</el-col>
					<el-col :span="2" class="tab-item"
					@mouseenter.native="handleCellMouseEnter($event, data)"
					@mouseleave.native="mouseoverHideTip('tooltip')">
						{{data.enterpriseName|isValue}}
					</el-col>
				</li>
				<el-tooltip 
				:content="tooltipContent" 
				placement="top" 
				ref="tooltip" 
				effect="light"></el-tooltip>
			</cv-scrollbar>
		</div>
	</div>
</template>

<script>
	import common from '@/utils/mixins/common'
	import { saveAs } from 'file-saver'
	import FreeDrag from './src/FreeDrag'
	import XLSX from 'xlsx'
	import mapLegend from './src/mapLegend.vue'
	export default{
		components: {mapLegend},
		mixins: [common],
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
			titles: {
				default(){
					return [
						{name: '监控车辆', count: '--', key: 'monitor', color: '#f39d38', icon: 'cheliangjiankong'},
						{name: '行驶', count: '--', key: 'driver', color: '#3992e4',icon: 'vehicle-group'},
						{name: '静止', count: '--', key: 'silent', color: '#66ab5b', icon: 'tingzhi'},
						{name: '离线', count: '--', key: 'unline', color: '#5f519e', icon: 'huodongguiji'},
						{name: '异常', count: '--', key: 'extreme', color: '#c7512d',icon: 'shijian'},
						{name: '其他', count: '--', key: 'other', color: '#49cfec', icon: 'qita'}
					]
				}
			}
		},
		data(){
			return{
				show: false,
				// 当前显示的内容索引
				cur: 0,
				// 当前显示内容的键值对
				key: 'monitor',
				pagination: 0,
				isToggleTree: false,
				isToggle: false,
				timer: null,
				// 拖拽实例对象
				freeDrag: null,
				// 分类集合
				classifyArray: {
					monitor: [],
					driver: [],
					silent: [],
					unline: [],
					extreme: [],
					other: []
				},
				// 显示当前数据集合
				currentDatas: [],
				// 显示当前的列表中的内容信息
				tooltipContent: ""
			}
		},
		methods:{
			// 重置集合
			resetGroup(){
				this.currentDatas = [];
				this.classifyArray.monitor = [];
				this.classifyArray.driver = [];
				this.classifyArray.silent = [];
				this.classifyArray.unline = [];
				this.classifyArray.extreme = [];
				this.classifyArray.other = [];
			},
			// 分类 allCar---所有车辆 [{},{}] monitor--有数据的车辆 {id: 车辆信息, id: 车辆信息}
			classify(allCar, monitor){
				// 重置
				this.resetGroup();
				if(monitor){
					// 不存在监控车辆中----other
					allCar.forEach(val => {	
						if(!(val.id in monitor)){
							this.classifyArray.other.push(val);
						}
					});
					// 已有监控车辆分类
					for(let key in monitor){
						this.classifyPublicFn(monitor[key]);
					};
				}else{
					for(let i = 0,len=allCar.length; i<len; i++){
						this.classifyPublicFn(allCar[i]);
					}
				}				
				this.titleCount();
				this.switchIsLoop(this.classifyArray[this.key]);
			},
			classifyPublicFn(val){
				this.classifyArray.monitor.push(val);
				// 车辆异常 -- extreme
				if(Number(val.locateStatus) === 0 || !val.locationDesc){
					this.classifyArray.extreme.push(val);
					return;
				}
				// 车辆离线 -- unline
				if(Number(val.vehicleStatus) === 0){
					this.classifyArray.unline.push(val);
					return;
				}
				// 车辆停驶 -- silent
				if(Number(val.gpsSpeed) == 0){
					this.classifyArray.silent.push(val);
					return;
				}
				// 车辆行驶 -- driver
				if(Number(val.vehicleStatus) === 1){
					this.classifyArray.driver.push(val);
					return;
				}
			},
			switchIsLoop(array){
				if(this.$service.isObject(this.current)){
					this.currentDatas = array;
				}else{
					this.setPagination(array);
				}
			},
			titleCount(){
				this.titles.forEach(title => {
					title.count = this.classifyArray[title.key].length;
				})
			},
			// 手动
			tabChange(key, index){
				this.pagination  = 0;
				this.currentDatas = [];
				this.key = key;
				this.cur = index;
				this.switchIsLoop(this.classifyArray[key]);
				// 是否显示车辆树
				this.isToggle = true;
				this.$store.dispatch('isToggleMonitorTree', false);
				this.isToggleTree = true;
			},
			toggleMsg(list){
				this.$emit('position', list);
			},
			// 双向开启树
			toggleTree(){	
				const flag = this.$store.getters.isToggleMonitorTree;
				this.$store.dispatch('isToggleMonitorTree', !flag);	
				this.isToggleTree = !this.isToggleTree;
				!this.isToggleTree && (this.isToggle = false);
			},
			// 双向开启面板
			toggle(){
				this.isToggle = !this.isToggle;
				if(this.isToggle){
					this.$store.dispatch('isToggleMonitorTree', false);
					this.isToggleTree = true;
				}
			},
			changeData(){
				if(this.all.length === 0){
					this.resetGroup();
					this.titles.forEach(title => {
						title.count = 0;
					});
				}else{
					this.classify(this.all, this.data);
				}
			},
			setPagination(sumCount){
				let size = Math.ceil((window.innerHeight-160) / 32);
				this.currentDatas = this.currentDatas.concat(sumCount.slice(this.pagination * size, (this.pagination+1)*size));
			},
			toBottomCallback(){
				if(this.timer){
					return;
				}
				this.timer = setTimeout(_ => {
					let size = Math.ceil((window.innerHeight-160) / 32);
					let pages = Math.ceil(this.classifyArray[this.key].length / size);
					clearTimeout(this.timer);
					this.timer = null;
					this.pagination = this.pagination + 1;
					if(this.pagination <= pages){
						this.switchIsLoop(this.classifyArray[this.key]);
					}			
				}, 500);
			},
			// 移入是否显示el-tooltip
			handleCellMouseEnter(event, list){
				this.tooltipContent = this.mouseenterShowTip(event, 'tooltip');
			},
			// 导出表格
			exportExcel(){
				const data = this.classifyArray[this.key];
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
						'车牌号': val.plateCode,
						'在线状态': this.$filter.isOnline(val,true),
						'定位状态': this.$filter.isLocatiion(val.locateStatus),
						'方向':this.$filter.direction(val.directionText),
						'GPS速度(km/h)': val.gpsSpeed,
						'行驶速度(km/h)': val.dspeed,
						'GPS时间': this.$filter.format(val.gpsTime,'yyyy-MM-dd HH:mm:ss'),
						'海拔(m)': val.height,
						'报警信息': val.alarmShortInfo,
						'所属企业': val.enterpriseName,
						'位置': val.locationDesc
					})
				});
				const fileName = '车辆详情';
				const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
				const fileExtension = '.xlsx';
				exportfile(array, mimeType, fileName, fileExtension);		
			},
			scrollbarEvent(event){
				let li = this.$myJq.delegation(event);
				let list = this.classifyArray[this.key][Number(li.getAttribute('num'))];
				this.$emit('position', list);
			}
		},
		watch: {
			// 实时更新数据
			current(newVal){
				this.changeData();
			},
			// 监听车辆个数变化
			all(newVal){
				this.changeData();
			},
			isToggle(newVal){
				if(this.freeDrag && this.freeDrag.dragTop){
					newVal 
					? this.freeDrag.dragTop.style.display = 'block'
					: this.freeDrag.dragTop.style.display = 'none';				
				}
			}
		},
		mounted(){
			setTimeout(_ => {this.show = true;}, 100);
			this.freeDrag = new FreeDrag({
				poster: this.$refs['bottomDetail'],
				minHeight: 140,
				maxHeight: window.innerHeight - 160
			});
		}
	}
</script>

<style lang="scss">
	$thirty: 30px;
	.cv-track-list{
		overflow-y:hidden;
		z-index: 160;
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
		.tab-content-detail{
			.el-row{
				height: $thirty;
				line-height: $thirty;
				background: #26210e;
				opacity: 0.8;
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