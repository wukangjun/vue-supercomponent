<template>
	<div class="cv-monitor-tree" v-clickoutside="outHide">
		<el-input :class="['input', isBorder?'commonBorder':'']" v-model="plateCode" placeholder="请输入车牌号" @keydown.enter.native="enterEvent" :size="size" ref="input">
			<template slot="append" v-if="!defaultShow">
				<el-button 
				type="primary" 
				:icon="icon" 
				@click="toggle"></el-button>
			</template>			
		</el-input>
		<transition name="el-zoom-in-top">
			<div :class="['trees', isBorder?'commonBorder':'']" v-show="isToggle">
				<!-- 监控树（多选树） -->
				<el-tabs v-model="carActive">
					<el-tab-pane label="车辆选择" name="first">
						<cv-scrollbar class="carTree" v-loading="isLoading" element-loading-text="拼命加载">
							<div class="companyName"><span>{{carTree.companyMess.text}}</span></div>
							<multi-tree 
							v-loading="carTree.loading"
							:data="treeData" 
							:props="defaultProps"
							node-key="id"
							lazy
							:highlight-current="highlightCurrent"
							:show-checkbox="showCheckbox"
							:expand-on-click-node="false"
							:default-expanded-keys="expanded"
							:default-checked-keys="carTree.carGroup"					
							:load="loadTree"
							@check-click="checkEvent"
							@node-click="handlerNodes"
							:render-content="renderContent"
							ref="tree"></multi-tree>
						</cv-scrollbar>
					</el-tab-pane>
					<el-tab-pane label="车辆列表" name="second" class="carList">
						<div class="searchArea">
							<div class="checkbox">
								<el-checkbox-group v-model="carList.lineList" style="display:inline-block">
									<el-checkbox label="1">在线</el-checkbox>
	  								<el-checkbox label="0">离线</el-checkbox>
								</el-checkbox-group>							
	  							<i class="el-icon-search searchBtn" @click="carSearch"></i>
							</div>						
						</div>
						<cv-scrollbar class="carList-container" v-loading="carList.loading">
							<el-checkbox-group v-model="carList.checks">
								<el-checkbox 
								v-if="isDouble"
								v-for="list in carList.lists"
								@change="checkChange($event, list)"
								:key="list.id"
								:label="list.id">
									<cv-icon 
									name="cheliang1" 
									size="18"
									:color="list.onlineStatus=='1'?'#1bca22':''" 
									style="vertical-align:sub"></cv-icon>
									{{list.plateCode}}
									<icon 
									v-if="showTrack"
									name="level-up" 
									class="trackIcon" 
									@click.native.prevent="trackBtn(list)"></icon>
								</el-checkbox>
							</el-checkbox-group>
							<li 
							ref="single"
							v-if="!isDouble"
							v-for="(list, index) in carList.lists" 
							:key="list.id" :label="list.id" class="carList-item" 
							@click="singleEvent(list, index)">
								<span class="list-check">{{list.plateCode}}</span>
							</li>
						</cv-scrollbar>
						<el-pagination 
						small
						class="el-pagination"
						layout="prev, pager, next" 
						:page-size="carList.search.size"
						:page-sizes="[10,20,30,40,50]"
						:total="carList.search.total"
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"></el-pagination>
					</el-tab-pane>
				</el-tabs>
			</div>
		</transition>
	</div>
</template>

<script>
	import multiTree from '@/components/tree/src/tree.vue'
	export default{
		components: {multiTree},
		props: {
			showCheckbox: {
				default: false
			},
			// 显示跳转历史轨迹按钮
			showTrack: {
				default: false
			},
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
			//显示加载:
			isLoading: {
				default: false
			},
			// 大小
			size: {
				default: 'small'
			}
		},
		data(){
			return{
				test: 0,
				carActive: 'first',
				isToggle: false,
				// 可以点击外部隐藏的标识--true:点击外部隐藏 false:不隐藏
				showFlag: true,
				icon: 'arrow-down',
				treeData: [],
				defaultProps: {
					children: 'children',
          			label: 'text'
				},
				plateCode: "",
				carTree: {
					loading: false,
					checked: [],    // 以选择的车辆数组
					companyMess: {},
					carGroup: [],   
					chooseList: [],   // 已选择的车辆列表
					removeNode: null // 删除的单个节点
				},				
				carList: {
					lineList: [],
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
			// 清除所有车辆
			clearAllVehicle(){
				let array = [];
				this.carTree.chooseList.forEach(val => {
					array.push(val.id)
				});
				this.$refs['tree'].removeNode(array);	
				this.carTree.chooseList	= [];	
			},
			//车辆列表搜索
			carSearch(){
				this.carList.loading = true;
				this.clearAllVehicle();		
				let lineSize = this.carList.lineList.length, params = {};
				(lineSize == 2 || lineSize == 0) ? this.carList.search.onlineStatus = 2 : 
				this.carList.search.onlineStatus = (parseInt(this.carList.lineList[0]));
				/* 参数处理 */ 
				params.onlineStatus = this.carList.search.onlineStatus;
				params.current = this.carList.search.current;
				params.size = this.carList.search.size;
				params.plateCode = this.plateCode;	
				this.carList.loading = true;			
				this.$store.dispatch('getVehicleListByPlate', params).then((data) => {					
					if(data.flag){
						let result = data.data;
						this.carList.lists = result.records;
						this.carList.search.total = result.total;					
					}
					this.carList.loading = false;
				}).catch(_ => {
					this.carList.loading = false;
				})				
			},
			// 按enter直接查询
			enterEvent(){
				this.carActive = 'second';
				this.carSearch();
			},
			// 车辆列表搜索列表显示存在车辆
			carSearchIsExist(data){
				this.carList.checks = [];
				if(this.carTree.chooseList.length > 0){
					this.carTree.chooseList.forEach((list) => {
						this.carList.checks.push(list.id);
						this.carList.checks = Array.from(new Set(this.carList.checks));
					})	
				}					
			},
			//车辆列表checked点击切换
			checkChange(event, list){
				let target = event.target || event.srcElement,
					detail = {id: list.id, plateCode: list.plateCode};
				if(target.checked){		
					this.addVehicle(detail);
				}else{
					let index = this.carTree.chooseList.findIndex(val => {
						return val.id == detail.id
					})
					this.carTree.removeNode = this.carTree.chooseList.splice(index, 1);
				}
			},
			// 车辆列表单选事件
			singleEvent(list, index){
				let params = {id: list.id, plateCode: list.plateCode};
				this.$refs['single'].forEach(item => {
					this.$myJq.removeClass(item, 'singleBg')
				})
				this.$myJq.addClass(this.$refs['single'][index], 'singleBg');
				this.$emit('single', params);
			},
			handleSizeChange(val){
				this.carList.search.size = val;
				this.carSearch();
			},
			handleCurrentChange(val){
				this.carList.search.current = val;
				this.carSearch();
			},
			filterNode(value, data){
				if (!value) return true;
        		return data.text.indexOf(value) !== -1;
			},
			//节点点击事件
			handlerNodes(data, node, store){
				if(data.type === 3){
					let params = {id: data.id, plateCode: data.text};
					// 触发单击事件
					this.$emit('single', params);
				}				
			},
			checkEvent(){			
				this.carTree.checked = this.$refs['tree'].getCheckedNodes();				
			},
			initTree(params){
				return new Promise((resolve, reject) => {
					this.carTree.loading = true;
					this.$store.dispatch('getEnterpriseVehicleTreeList', params).then(data => {
						this.carTree.loading = false;
						if(data.flag && data.data.length > 0){		
							let result = data.data, index = result.findIndex((val) => {	
								return val.id == this.$store.getters.user.enterpriseId
							});
							this.carTree.companyMess = result.splice(index, 1)[0];
							this.treeData = result;
						}else{
							this.carTree.companyMess = {};
							this.treeData = [];
						}	
						resolve(data);				
					}).catch((val) => {
						this.carTree.loading = false;
					})
				})				
			},
			loadTree(node, resolve){
				if(node.level !== 0){						
					let data = node.data, params = {id: data.id, type: data.type};						
					if(this.$service.isObject(data)){
						node.expanded = true;
						setTimeout(_ => {
							if(node.eventname !== 'expand'){
								data.type !== 3 ? this.expandLoadTree(node, params, resolve) : resolve([]);
							}else{
								this.checkLoadTree(params, resolve);
							}
						})		
					}
				}
			},
			// 点击expand加载子节点
			async expandLoadTree(node, params, resolve){
				let {data, flag} = await this.$store.dispatch('getEnterpriseVehicleTreeList', params);
				flag ? (resolve(data), this.broadcastNodes(node.childNodes)) : resolve([]);	
				setTimeout(_ => {
					this.carTree.checked = this.$refs['tree'].getCheckedNodes();
				})		
			},
			// 点击checkbox加载子节点
			async checkLoadTree(params, resolve){
				let {data, flag} = await this.$store.dispatch('getEnterpriseVehicleTreeList', params);
				flag ? resolve(data) : resolve([])
			},
			broadcastNodes(childs){
				if(this.$service.isArray(childs) && childs.length > 0){
					childs.forEach(child => {	
						child.checked = true;
						child.data.type !== 3 ? child.loadData(): null;						
					});	
					this.$store.dispatch('clearCheckId');	
				}
			},
			focusEvent(){
				// 可以点击外部隐藏的标识--true:点击外部隐藏
				this.showFlag = true;
				this.isToggle = true;
			},
			toggle(){
				// 可以点击外部隐藏的标识--false: 点击外部不隐藏
				this.showFlag = false;
				this.isToggle = !this.isToggle;				
			},
			outHide(){
				this.showFlag ? this.isToggle = false : null;		
			},
			// 根据类型分不同图标 1--公司 2--车组 3--车辆
			switchIcon(data){
				switch(data.type){
					case 3: 
						return <cv-icon name="cheliang1" size="18" color={data.online?'#1bca22':''} 
						style="vertical-align:sub"></cv-icon>
					case 2: 
						return <cv-icon name="vehicle-group" size="14"></cv-icon>
					case 1: 
						return <cv-icon name="jigou4" size="16"></cv-icon>
					default: return ''
				}
			},
			renderContent(h, { node, data, store }){
				return (
		          <span>
		            <span>
		            	{this.switchIcon(data)}
		              	<span>{node.label}</span>
		            </span>
		          </span>);
			},
			// 多选框选择车辆小于旧值--减法
			removeVehicles(newVal, oldVal){
				if(newVal.length < oldVal.length){
					let vehicles = [];
					this.$service.isUnique(oldVal, newVal, 'id').forEach(val => {
						vehicles.push(val.id)
					});
					this.$refs['tree'].removeNode(vehicles);			
				}
			},
			// 添加车辆进行去重操作
			addVehicle(result){
				this.carTree.chooseList.push(result);
				this.carTree.chooseList = this.$service.unique(this.carTree.chooseList, 'id');
			}
		},
		watch: {
			//监听选择的监视车辆的变化
			'carTree.chooseList':{
				handler(newVal, oldVal){
					this.carSearchIsExist();
					let newArr = [];
					newVal.forEach((val) => {
						newArr.push(val.id)
					})
					this.$refs['tree'].setCheckedKeys(newArr);	
					this.$emit('vehicle', newVal, oldVal, true);	
				},
				deep: true
			},
			// 监听删除的节点
			'carTree.removeNode'(newVal){
				if(this.$service.isArray(newVal)&& newVal.length>0){
					this.$refs['tree'].removeNode([newVal[0].id]);					
				}
			},
			'carTree.checked':{
				handler(newVal, oldVal){
					this.carTree.chooseList = [];
					if(newVal.length > 0){
						newVal.forEach((val) => {
							let detail = val;
							if(parseInt(detail.type) === 3){
								let result = {id: detail.id, plateCode: detail.text};
								this.addVehicle(result);
							}						
						})
					}		
				},
				deep: true
			},
			isToggle(newVal){
				newVal ? this.icon = 'arrow-up' : this.icon = 'arrow-down';
			}
		},
		computed: {
			expanded(){
				return []
			}
		},
		mounted(){	
		    // 下拉树是否默认显示
			this.isToggle = this.defaultShow;	
			(async() => {
				this.$myJq.on(this.$refs['input'].$refs['input'], 'click', () => {
					this.focusEvent();
				})	
				let initTree = await this.initTree();	
			})()
		}
	}
</script>

<style lang="scss">
	$multiTreeW: 345px;
	$multiH: 500px;
	.cv-monitor-tree{
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
			height: $multiH;
			position: absolute;
			top: 38px;
			bottom: 20px;
			background: #fff;
			margin-top: 2px;
			box-shadow: 1px 2px 1px rgba(0,0,0,.15);
			overflow: hidden;	
			z-index: 2001;		
			.el-tabs__content{
				position: inherit;
			}
			.el-tree{
				border: 0;
			}
			.carTree{
			    width: 100%;
			    bottom: 0;
			    height: $multiH - 50px;
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
			.carList{
				.searchArea{
					padding-bottom: 10px;
					border-bottom: 1px solid #d1dbe5;
					.checkbox{
						margin-left: 10px
					}
					.searchBtn{
						font-size: 18px;
						vertical-align: text-bottom;
						float: right;
						padding-right: 10px;
						cursor: pointer;
					}
				}
				.carList-container{
					width: 100%;
				    bottom: 40px;
				    margin-top: 40px;
				    height: $multiH - 130px;
				    .el-checkbox{
				    	height: 40px;
				    	line-height: 40px;
				    	width: 100%;
				    	border-bottom: 1px solid #d1dbe5;
				    	&:hover{
				    		background: #ebebeb
				    	}
				    	.el-checkbox__input{
				    		padding-left: 10px
				    	}
				    	.trackIcon{
							position: absolute;
							right: 0;
				    		padding: 12px;
				    		&:hover{
				    			background: #d4d2d2
				    		}
				    	}
				    }
				    .el-checkbox+.el-checkbox{
			    		margin: 0 !important;
			    	}
			    	.singleBg{
			    		background: #ebebeb
			    	}
				    .carList-item{
				    	height: 40px;
				    	line-height: 40px;
				    	border-bottom: 1px solid #d1dbe5;
				    	&:hover{
				    		background: #ebebeb
				    	}
				    	.list-check{
				    		margin-left: 10px;
				    	}
				    }
				}
				.el-pagination{
					position: absolute;
					bottom: 10px
				}
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