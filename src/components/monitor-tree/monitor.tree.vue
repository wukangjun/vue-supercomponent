<template>
	<div class="cv-monitor-tree">
		<transition name="fadeLeft">
			<div class="trees" v-show="isToggle">
				<!-- 监控树（多选树） -->
				<el-tabs v-model="carActive">
					<el-tab-pane label="车辆选择" name="first">	
						<el-input size="small" class="vehicle-choose-search" 
						icon="search"
						v-model="carTree.vehicleChoose"
						placeholder=""
						:on-icon-click="markVehicleRed"
						@keyup.native.enter="markVehicleRed"></el-input>	
						<cv-scrollbar class="carTree" v-loading="isLoading" element-loading-text="拼命加载">
							<z-tree 
							id="monitor"
							ref="tree"
							@async="returnData" 
							@label="returnCar"
							@shoucang="shoucangCar"
							@node-click="nodeClick"
							@ready="treeInit"
							@disabled="disabled"
							:enterprise-id="$store.getters.user.enterpriseId"
							:data="carTree.checkedCar"
							:is-check="isCheck"
							:is-show-track="isShowTrack"></z-tree>
						</cv-scrollbar>
					</el-tab-pane>
					<el-tab-pane label="车辆列表" name="second" class="carList">
						<div class="searchArea">
							<div class="checkbox">
								<el-input 
								:placeholder="followSearchList" 
								v-model="plateCode" 
								size="small" 	
								class="comditSearch"
								@keyup.native.enter="carSearchBtn('carList','getVehicleListByPlate')">
								    <el-select style="width:100px" v-model="carList.select" slot="prepend" placeholder="车牌" @change="selectSearchName">
									    <el-option label="车牌号" value="0"></el-option>
										<el-option label="公司名称" value="1"></el-option>
										<el-option label="车组名称" value="2"></el-option>
										<el-option label="终端ID" value="3"></el-option>
										<el-option label="VIN号" value="4"></el-option>
										<el-option label="SIM卡号" value="5"></el-option>
								    </el-select>
								</el-input>
								<el-checkbox-group v-model="carList.lineList" 
								style="display:inline-block;margin-top:4px;">
									<el-checkbox label="1" >在线</el-checkbox>
	  								<el-checkbox label="0" >离线</el-checkbox>
								</el-checkbox-group>	
								<el-button class="searchBtn" size="small" type="success" @click="carSearchBtn('carList','getVehicleListByPlate')">搜索</el-button>
							</div>						
						</div>
						<component :is="name" :double="isDouble" 
						:data="carList"
						@currentChange="handleCurrentChange" 
						@change="checkChange" 
						@click="singleEvent"
						@already="already"
						@delFollowList='refFollowList'></component>
					</el-tab-pane>
					<el-tab-pane label="车辆关注" name="third" class="treeFollow">
						<div class="searchArea">
							<div class="checkbox">
								<el-input 
								:placeholder="followSearchList" 
								v-model="plateCode" 
								size="small" 
								class="comditSearch"
								@keyup.native.enter="carSearchBtn('followList','findVehicleAttentionInfoList')">
								    <el-select style="width:100px" v-model="carList.select" slot="prepend" placeholder="车牌" @change="selectSearchName">
									    <el-option label="车牌号" value="0"></el-option>
										<el-option label="公司名称" value="1"></el-option>
										<el-option label="车组名称" value="2"></el-option>
										<el-option label="终端ID" value="3"></el-option>
										<el-option label="VIN号" value="4"></el-option>
										<el-option label="SIM卡号" value="5"></el-option>
								    </el-select>
								</el-input>
								<el-checkbox-group v-model="followList.lineList" 
								style="display:inline-block;margin-top:4px;">
									<el-checkbox label="1" >在线</el-checkbox>
	  								<el-checkbox label="0" >离线</el-checkbox>
								</el-checkbox-group>	
								<el-button class="searchBtn" size="small" type="success" @click="carSearchBtn('followList','findVehicleAttentionInfoList')">搜索</el-button>
							</div>						
						</div>
						<follow  :double="isDouble" 
						:data="followList"
						@currentChange="handleCurrentChange" 
						@change="checkChange" 
						@click="singleEvent"
						@already="already"
						@delFollowList='refFollowList'></follow>
					</el-tab-pane>
				</el-tabs>
				<!-- <div :class="['trackArea', $store.getters.isMonitorOrTrack?'showTrack':'']">
					<history-track :data="track.data" @back="back" ref="historyTrack"></history-track>
				</div> -->
			</div>
		</transition>
	</div>
</template>

<script>
	import historyTrack from '@/components/history-track/history.track.vue'
	import zTree from '@/components/ztree/ztree.car.vue'
	import common from '@/utils/mixins/common'
	import renderContent from '@/components/monitor-tree/content.vue'
	import follow from '@/components/monitor-tree/followVehicle.vue'
	export default{
		components: {historyTrack, zTree, renderContent,follow},
		mixins: [common],
		props: {
			highlightCurrent: {
				default: true
			},
			//默认显示下拉框
			defaultShow: {
				default: false
			},
			//是否多选或单选
			isDouble: {
				default: false
			},
			isBorder: {
				default: true
			},
			isCheck: {
				default: true
			},
			//显示加载:
			isLoading: {
				default: false
			},
			// 大小
			size: {
				default: 'small'
			},
			// 是否显示历史轨迹
			isShowTrack: {}
		},
		data(){
			return{
				name:'',
				test: 0,
				carActive: 'first',
				carActiveCache: {},
				isToggle: false,
				// 可以点击外部隐藏的标识--true:点击外部隐藏 false:不隐藏
				showFlag: true,
				icon: 'arrow-down',
				treeData: [],
				defaultProps: {
					children: 'children',
          			label: 'text'
				},
				searchName:["请输入车牌号","请输入公司名称","请输入车组名称","请输入终端ID","请输入VIN号","请输入SIM卡号"],
				followSearchList:"请输入车牌号",
				plateCode: "",
				carTree: {
					// 车辆选择搜索
					vehicleChoose: "",
					loading: false,
					checked: [],    // 以选择的车辆数组
					companyMess: {},
					carGroup: [],   
					// 地图上勾选的车辆在车辆树中显示
					checkedCar: [] 
				},
				carList: {
					lineList: ["1","0"],
					select: "0",
					lists: [],
					loading: false,
					checks: [],
					search:{
						onlineStatus: 2,
						current: 1,
						size: 10,
						total: 0
					}
				},
				followList:{
					lineList: ["1","0"],
					select: "0",
					lists: [],
					loading: false,
					checks: [],
					search:{
						onlineStatus: 2,
						current: 1,
						size: 10,
						total: 0
					}
				},
				track:{
					name: '',
					data: ""
				}
			}
		},
		methods: {
			treeInit(val){
				if(val){
					let newArr = [];
					this.$refs['tree'].renderTree(this.$store.getters.getAsyncNodes, this.isCheck);	
					// 获取当前选中车辆的ids
					this.$store.state.multiCar.carList.forEach(val => {
						newArr.push(val.id)
					});
					this.carTree.checkedCar = newArr;
				}
			},
			disabled(){
				this.$message.error('该公司或车组下超过200辆车,不能一次性添加');
			},
			selectSearchName(val){
				this.followSearchList=this.searchName[val];
			},
			returnData(newVal, oldVal){
				let array = [], index = false;
				newVal.forEach(val => {
					if(Number(val.type) === 3){
						let result = {id: val.id, plateCode: val.text};	
						// 安检已存在的id	
						this.$store.state.multiCar.carList.forEach(item => {
							if(item.id == val.id){
								return index = true;
							}
						})						
						!index && array.push(result);							
						this.$store.dispatch('addVehicleList',  {data: result});
					}						
				})
				this.$emit('vehicle', { name: 'add', data: array });	
			},
			returnCar(data, type){
				let cars = this.filterVehicleCar(data);
				switch(type){
					case 'add': 
						this.$emit('vehicle', {name: 'add', data: cars});
						cars.forEach(val => {
							this.$store.dispatch('addVehicleList', {data: val})
						});
						break;
					case 'remove': 
						this.$emit('vehicle', {name: 'remove', data: cars});
						cars.forEach(val => {
							this.$store.dispatch('removeVehicleList', {data: val})
						});
					break;	
				}
			},
			setSearchName(_params){
				let val =this.carList.select;
				switch(val){
					case "0":
					_params.plateCode=this.plateCode;
					break;
					case "1":
					_params.enterpriseName=this.plateCode;
					break;
					case "2":
					_params.fleetName=this.plateCode;
					break;
					case "3":
					_params.manufacturerModel=this.plateCode;
					break;
					case "4":
					_params.carVin=this.plateCode;
					break;
					case "5":
					_params.mobileCode=this.plateCode;
					break;
				}
				return _params;
			},
			shoucangCar(list){
				if(list.isAttention == "0"){
					this.$prompt('关注备注信息', '关注确认', {
						inputValue:list.alias,
						inputPattern:/^.{0,20}$/,
						inputErrorMessage:"备注长度不能超过20",
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then(({ value }) => {
						let params={};
						params.vehicleId=list.id;
						params.alias=value;
						this.$store.dispatch('insertVehicleAttentionInfo', params).then((data) => {
							if(data.flag){
								this.carSearch('carList','getVehicleListByPlate');	
								this.$message.success("关注成功");
							}else{
								this.$message.error(this.$t('error.'+data.errorCode));
							}
						}).catch(() =>{
							this.$message.error("网络错误");
						})
					}).catch(() => {      
					});
				}else{
					let params={};
					params.vehicleId=list.id;
					this.$store.dispatch('deleteVehicleAttentionInfo', params).then((data) => {
						if(data.flag){
							this.$emit('delFollowList');
							this.$message.success("取消关注成功");
						}else{
							this.$message.error(this.$t('error.'+data.errorCode));
						}
					}).catch(() =>{
						this.$message.error("网络错误");
					})
                
            }
			},
			// 进入历史轨迹
			joinHistory(content){
				//this.multiMapClearAll();
				this.track.data = content;
				this.track.name = 'historyTrack';
				this.$store.dispatch('isMonitorOrTrack', true);
			},
			nodeClick(data){
				if(data.type === 3 && data.checked && this.isCheck){
					// 点击跳转地图点
					this.singleLocation(data);
				}
				if(!this.isCheck && data.type === 3){
					let params = {id: data.id, plateCode: data.text};
					// this.joinHistory(params);
					this.$emit('single', params)
				}
			},
			// 定位跳到单个车辆的地图位置
			singleLocation(data){
				// 点击跳转地图点
				if(this.$map['monitorMap'] && this.$store.getters.carPoints[data.id]){
					this.$store.dispatch('isGetBaseView', true);
					this.$store.dispatch('carCurrent', {id:data.id,plateCode:data.text});
					this.$map['monitorMap'].moveToCenter(this.$store.getters.carPoints[data.id].point, 17);
				}else{
					let plateCode = data.text || data.plateCode;
					this.$message.error('车辆('+ plateCode +')暂无位置信息!');
				}
			},
			// 过滤得到是车辆的数据
			filterVehicleCar(vehicles){
				let array = [];
				vehicles && vehicles.forEach(val => {
					(+val.type === 3) && array.push({id: val.id, plateCode: val.text});				
				})
				return (array.length > 0) ? this.$service.unique(array, 'id') : [];
			},
			// 搜索按钮点击
			carSearchBtn(_type,url){
				this.name = '';
				this[_type].loading = true;
				this[_type].name = '';
				let lineSize = this[_type].lineList.length, params = {};
				(lineSize == 2 || lineSize == 0) ? this[_type].search.onlineStatus = 2 : 
				this[_type].search.onlineStatus = (parseInt(this[_type].lineList[0]));
				/* 参数处理 */ 
				params.onlineStatus = this[_type].search.onlineStatus;
				params.current = 1;
				params.size = this[_type].search.size;
				params=this.setSearchName(params);	
				this[_type].loading = true;			
				this.$store.dispatch(url, params).then((data) => {		
					// this.carList.name = 'pagination';
					if(data.flag && data.data.length !=0 ){
						let result = data.data;
						this[_type].lists = result.records;
						this[_type].search.total = result.total;					
					}else{
						this[_type].lists = [];
						this[_type].search.total = 0;		
					}
					this[_type].loading = false;
				}).catch(_ => {
					this[_type].loading = false;
				})	
				setTimeout(_=>{
					this.name = 'render-content';
				},0)	
			},
			refFollowList(){
				this.carSearch('followList','findVehicleAttentionInfoList');
				this.carSearch('carList','getVehicleListByPlate')
			},
			//车辆列表搜索
			carSearch(_type,url){
				this[_type].loading = true;
				let lineSize = this[_type].lineList.length, params = {};
				(lineSize == 2 || lineSize == 0) ? this[_type].search.onlineStatus = 2 : 
				this[_type].search.onlineStatus = (parseInt(this[_type].lineList[0]));
				/* 参数处理 */ 
				params.onlineStatus = this[_type].search.onlineStatus;
				params.current = this[_type].search.current;
				params.size = this[_type].search.size;
				params=this.setSearchName(params);	
				this[_type].loading = true;			
				this.$store.dispatch(url, params).then((data) => {		
					if(data.flag && data.length !=0 ){
						let result = data.data;
						this[_type].lists = result.records;
						this[_type].search.total = result.total;					
					}else{
						this[_type].lists = [];
						this[_type].search.total = 0;		
					}
					this[_type].loading = false;
				}).catch(_ => {
					this[_type].loading = false;
				})				
			},
			// 车辆列表搜索列表显示存在车辆
			carSearchIsExist(data){
				this.carList.checks = [];
				this.followList.checks = [];
				if(this.$store.state['multiCar'].carList.length > 0){
					this.$store.state['multiCar'].carList.forEach((list) => {
						this.carList.checks.push(list.id);
						this.carList.checks = Array.from(new Set(this.carList.checks));
						this.followList.checks.push(list.id);
						this.followList.checks = Array.from(new Set(this.followList.checks));
					})	
				}					
			},
			//车辆列表checked点击切换
			checkChange({event, list}){
				let target = event.target || event.srcElement,
					detail = {id: list.id, plateCode: list.plateCode};
				if(target.checked){		
					this.$store.dispatch('isGetBaseView', true);			
					this.$store.dispatch('addVehicleList', {data: detail, type: 'addOne'});
				}else{
					this.$store.dispatch('removeVehicleList', {data: detail, type: 'removeOne'})
				}
			},
			// 已选车辆进行定位
			already(check, list){
				check.isChecked
				? this.singleLocation(list)
				: this.$store.dispatch('addVehicleList', {data: list, type: 'addOne'});			
			},
			// 车辆列表单选事件
			singleEvent({list, index, single}){
				let params = {id: list.id, plateCode: list.plateCode};
				single.forEach(item => {
					this.$myJq.removeClass(item, 'singleBg');
				});
				this.joinHistory(params);
				this.$myJq.addClass(single[index], 'singleBg');
				this.$emit('single', params);
			},
			handleCurrentChange(val){
				this.carActive=='second' && (this.carList.search.current = val);
				this.carActive=='third' && (this.followList.search.current = val);
				this.carActive=='second' &&  this.carSearch('carList','getVehicleListByPlate');		
				this.carActive=='third' &&  this.carSearch('followList','findVehicleAttentionInfoList');		
			},
			// 车辆选择搜索标记红色
			markVehicleRed(){
				this.$refs['tree'].highlight(this.carTree.vehicleChoose);
			},
			//节点点击事件
			handlerNodes(data, node, store){
				if(data.type === 3){
					let params = {id: data.id, plateCode: data.text};
					// 触发单击事件
					this.$emit('single', params);
					// 点击跳转地图点
					this.$map['monitorMap']&&this.$store.getters.carPoints[data.id]&&					
					(this.$store.dispatch('carCurrent', data.id),
					this.$store.dispatch('isGetBaseView', true),
					this.$map['monitorMap'].moveToCenter(this.$store.getters.carPoints[data.id].point, 17))
				}				
			},
			checkEvent(){	
				this.$store.dispatch('clearCheckId');				
				this.carTree.checked = this.$refs['tree'].getCheckedNodes();				
			},
			back(){
				this.$map['map'].clearOverlays();
				this.$store.dispatch('isMonitorOrTrack', false);
				this.$store.dispatch('addTrackAbillity',false);
				this.$store.dispatch('addTrackLists',false);
				this.track.name = "";
			},
			// 多车监控地图点全部清除
			multiMapClearAll(){
				const keys = [];
				this.$refs['tree'].cancelAllNodes();		
				this.$store.dispatch('clearAllVehicleList');				
				this.$store.dispatch('clearAllPoints');
				this.$map['map'].clearOverlays();
			},
			// 获取加载的节点
			getAsyncNodes(){
				return this.$refs['tree'].getNodes();
			}
		},
		watch: {
			//监听选择的监视车辆的变化
			'$store.state.multiCar.carList':{
				handler(newVal, oldVal){
					this.$refs['tree'].cancelAllNodes();
					this.carSearchIsExist();
					let newArr = [];
					newVal.forEach((val) => {
						newArr.push(val.id);
					});
					// 存储已存在的节点到树上
					this.carTree.checkedCar = newArr;
					this.$refs['tree'].checkedNode(newArr);
				},
				deep: true
			},
			// 监听添加单个的节点id
			'$store.getters.addId'(newVal){
				if(newVal&&newVal.length > 0){
					this.$refs['tree'].checkedNode([newVal[0].id]);
					this.$emit('vehicle', {name: 'add', data: newVal});
				}
			},
			// 监听删除的节点
			'$store.getters.removeId'(newVal){
				if(newVal&&newVal.length > 0){
					this.$refs['tree'].cancelNode([newVal[0].id]);
					this.$emit('vehicle', {name: 'remove', data: newVal});
				}
			},
			'carTree.checked':{
				handler(newVal, oldVal){
					newVal.forEach(val => {
						if(Number(val.type) === 3){
							let result = {id: val.id, plateCode: val.text};
							this.$store.dispatch('addVehicleList',  {data: result});
						}						
					})	
				},
				deep: true
			},
			plateCode(newVal, oldVal){	
				this.carList.search.current = 1;
			},
			carActive(newVal){
				if(this.carActiveCache[newVal]) return;
				switch(newVal){
					case 'second':
						this.carActiveCache['second'] = true;
						this.carSearchBtn('carList','getVehicleListByPlate');
					break;
					case 'third':
						this.carActiveCache['third'] = true;
						this.carSearchBtn('followList','findVehicleAttentionInfoList');
					break;
				}
			}
		},
		mounted(){	
			let newArr = [];
		    // 下拉树是否默认显示
			this.isToggle = true;	
			this.carSearchIsExist();
			this.$store.dispatch('isMonitorOrTrack', false);
		}
	}
</script>

<style lang="scss">
	$multiTreeW: 310px;
	$multiH: 500px; 
	.cv-monitor-tree{
		.fadeLeft-enter-active{
			opacity: 1; 
			left: 0;
			transition: all .4s ease-in-out;	
		}
		.fadeLeft-enter,.fadeLeft-leave{
			left: -$multiH;
			opacity: 0; 
		}
		display: inline-block;
		.commonBorder{
			border: 1px solid #ccc;
			box-shadow: none !important;		
		}
		.input{
			width: $multiTreeW;
			box-shadow: 1px 2px 1px rgba(0,0,0,.15);
			.el-input-group__append{
				background: #20a0ff;
				color: #fff;
				border: 0;
				border-radius: 0;
				&:hover{
					background: #1493f1
				}
			}
			.el-input__inner{
				border: 0
			}
		}
		.trees{
			width: $multiTreeW;
			// height: $multiH;
			position: absolute;
			top: 0px;
			bottom: 0px;
			background: #fff;
			margin-top: 2px;
			box-shadow: 1px 2px 1px rgba(0,0,0,.15);
			overflow: hidden;	
			z-index: 2001;	
			.el-tabs__header{
				margin-bottom: 0;
			}	
			.el-tabs__content{
				position: inherit;
			}
			.vehicle-choose-search{
				width: 94%;
				margin: 10px 3% 2px 3%;
			}
			.carTree{
			    width: 100%;
				top:85px;
			    bottom: 0;
			    // height: $multiH - 85px;
				// margin-top:10px;
			    .companyName{
			    	span{
			    		padding-left: 10px;
			    		font-size: 14px;
			    	}			    	
			    }
			    .trackBtn{
			    	position:absolute;
			    	right:0;
			    	top:0;
			    	padding: 0 10px;
			    	&:hover{
			    		background: #ccc;
			    	}
			    }
			    .hide{
			    	display: none;
			    }
			    .el-tree-node__content{
					position: relative;
				}
			}
			.carList , .treeFollow{ 
				.searchArea{
					margin-top: 10px;
					padding-bottom: 10px;
					border-bottom: 1px solid #d1dbe5;
					.checkbox{
						margin: 0 10px;
					}
					.searchBtn{
						font-size:10px;
						float: right;	
					}
				}
			}
			.cv-treelist{
				width:100%;
				position: absolute;
				top:130px;
				bottom: 0px;
			}
			.comditSearch{
				margin-bottom: 10px;
			}
		}
		.trackArea{
			width: $multiTreeW;
			height: $multiH;
			position: absolute;
			background: #fff;
			top: 0;
			z-index: 1;
			left: 100%;
			transition: all .2s ease-in-out;
		}
		.showTrack{
			left: 0;
			transition: all .2s ease-in-out;
		}
	}
</style>
