<template>
	<ul class="cv-ztree-car ztree" :id="id"></ul>
</template>

<script>
	import ZtreeCar from './model/vue.monitorcar'
	export default{
		props: {
			data: {
				type: Array
			},
			// 是否有checkbox
			isCheck: {
				type: Boolean,
				default: true
			},
			// 树的标识默认id:ztree
			id: {
				type: String,
				default: 'ztree'
			},
			// 是否有历史轨迹按钮
			isShowTrack: {
				type: Boolean,
				default: true
			},
			enterpriseId: {},
			// 限制车辆选择的数量
			limit: {
				type: Number,
				default: 200
			}
		},
		data(){
			return {
				tree: null,
				allNodes: []
			}
		},
		methods: {
			// 取消所有勾选的节点
			cancelAllNodes(){
				return this.tree.cancelAllNodes();
			},
			// 取消勾选的节点(单个)
			cancelNode(array = []){
				return this.tree.cancelNode(array);
			},
			// 勾选节点
			checkedNode(array = []){
				return this.tree.checkedNode(array);
			},
			// 获取当前所有加载的节点
			getNodes(){
				return this.tree.getAllNodes();
			},
			// 渲染树
			renderTree(nodes, flag = true){
				this.tree.renderTree(nodes, flag);
			},
			// 标记红色节点
			highlight(value){
				this.tree.highlight(value);
			},
			// 节点树的增--删---改
			addRemoveUpdate(newVal){
				switch(newVal.operation){
					case 'ADD':
						// 1. 不存在车辆就更新车辆父级数字+1
						this.tree && this.tree.addRemoveVehicleNum(newVal, '+1');
						// 2. 存在车辆的直系父节点就加节点
						this.tree && this.tree.addRemoveVehicle(newVal, '+1');
					break;
					case 'DELETE':
						// 1. 不存在车辆就更新车辆父级数字-1
						this.tree && this.tree.addRemoveVehicleNum(newVal, '-1');
						// 2. 存在该车辆就删除
						this.tree && this.tree.addRemoveVehicle(newVal, '-1');
					break;
					case 'UPDATE':
						// 对存在的车辆进行修改
						this.tree && this.tree.addRemoveVehicle(newVal, '0');
					break;
				}
			},
			// 公司车组增--删---改
			addManageVehicleGroup(newVal, type){
				switch(newVal.operation){
					case 'ADD':
						this.tree.addManageVehicleGroup(newVal, type);
					break;
					case "DELETE":
						this.tree.removeManageVehicleGroup(newVal);
					break;
					case 'UPDATE':
						this.tree.updateManageVehicleGroup(newVal);
					break;
				}
			}
		},
		mounted(){
			let vm = this;
			this.tree = new ZtreeCar(this.id, {
				url: this.$COMMON.baseUrl + '/monitor/findVehicleTreeInfoList',
				enterpriseId: this.enterpriseId,
				isCheck: this.isCheck,
				isShowTrack: this.isShowTrack,
				limit: this.limit,
				methods: {
					// 异步
					async(data){
						vm.allNodes = data;
					},
					// 同步
					label(data, type){
						vm.$emit('label', data, type);
					},
					// 历史轨迹按钮
					shoucang(data){
						vm.$emit('shoucang', data);
					},
					nodeClick(data){
						vm.$emit('node-click', data);
					},
					// 禁止勾选的回调
					disabled(){
						vm.$emit('disabled');
					}
				}
			});	
			this.tree.renderTree(this.$store.getters.getAsyncNodes, this.isCheck);		
		},
		watch: {
			allNodes(newVal=[], oldVal=[]){
				this.$emit('async', newVal, oldVal);
			},
			data(newVal){
				this.tree.data = newVal;
			},
			// 监听树是否初始化完毕
			'tree.ready'(newVal){	
				this.$emit('ready', newVal);
			},
			// 监听车辆上下线
			'$store.getters.onlineList'(newVal){
				this.tree && this.tree.updateCheckedNodes(newVal);
			},
			'$store.getters.isAttention'(newVal){
				this.tree && this.tree.updateCheckedNodesIcon(newVal);
			},
			// 监听公司车组添加或者删除
			'$store.getters.socketEnterprise'(newVal){
				switch(newVal.entOrFleet){
					case 'ENTERPRISE':
						this.addManageVehicleGroup(newVal, 1);
					break;
					case 'FLEET':
						this.addManageVehicleGroup(newVal, 2);
					break;
				}
			},
			// 监听车辆添加或者删除或者修改--UPDATE
			'$store.getters.socketVehicle'(newVal){
				this.addRemoveUpdate(newVal);
			}
		}
	}
</script>

<style lang="scss">
	
</style>