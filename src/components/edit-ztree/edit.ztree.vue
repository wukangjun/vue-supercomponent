<template>
	<div class="cv-edit-tree">
		<el-input placeholder="搜索" class="tree-search" size="small" v-model="editModel"></el-input>
		<div
		style="width:100%;position:absolute;top:65px;bottom:0;overflow:auto" 
		v-loading="loading">
			<ul class="cv-search-tree ztree" ref="editZtree"></ul>
		</div>	
	</div>	
</template>

<script>
	import common from '@/utils/mixins/common'
	import EditTree from './model'
	export default {
		mixins: [common],
		props: {
			id: { default: 'edittree' },
			interface: {},
			enterpriseId: {},
			isEdit:{
				default:true
			}
		},
		data(){
			return {
				tree: null,
				editModel: "",
				operationType: null,
				// 编辑修改之前的名称
				beforeEditName: "",
				loading: false,
				tip: {
					rootNoEidt: '根节点不能进行修改操作',
					rootNoRemove: '根节点不能进行删除',
					hasChildNoRemove: '该车组下存在子车组不能全部删除',
					allMostFour: '车组最多只有4层'
				}
			}
		},
		methods: {
			// 获取树的数据
			questTreeData(enterpriseId){
				return this.$http({
					url: this.interface,
					params: {
						enterpriseId: enterpriseId || null
					}
				})
			},
			//添加车队接口
			addFleet({ pId, name, enterpriseId }) {
				return this.$http({
					url: this.$COMMON.baseUrl + '/fleet/addFleet',
					params: { pId, name, enterpriseId }
				})
			},
			//删除车队接口
			deleteFleet(id) {
				return this.$http({
					url: this.$COMMON.baseUrl + '/fleet/deleteFleet',
					params: { id }
				})
			},
			// 修改车队接口
			updateFleet({ id, name, enterpriseId }) {
				return this.$http({
					url: this.$COMMON.baseUrl + '/fleet/updateFleet',
					params: { id, name, enterpriseId }
				})
			},
			async transferTree(enterpriseId, callback){
				this.loading = true;
				const {data, flag} = await this.questTreeData(enterpriseId);
				this.loading = false;
				if(flag && data){
					this.tree && (this.tree.editTreeInit = data);
					// 展开需要时间--然后才能定位到相应节点
					setTimeout(_ => {
						typeof callback === 'function' && callback();
					}, 1000)		
				}
			},
			// 添加节点请求成功操作
			async addNodeAskFinished(treeNode){
				let parentNode = treeNode.getParentNode();
				const {data, flag} = await this.addFleet({
					pId: parentNode.type === 1 ? 0 : treeNode.pId,
					name: treeNode.text,
					enterpriseId: this.enterpriseId
				});
				if(flag){
					this.$message.success(this.$t('action.addSuccess')); 
					// 再重新刷新整个树
					this.transferTree(this.enterpriseId, _ => {
						// 定位到对应节点并触发点击事件
						let node = this.tree.getNodesByParam('text', treeNode.text);
						this.tree.selectNode(node[0], false, false);
						this.$emit('node-click', node[0]);
					});
				}else{
					this.$message.error(this.$t('action.addFail'));
					this.tree.removeNode(treeNode);
				}
			},
			// 删除节点操作
			removeNodes(treeNode){
				if(treeNode.level === 0){
					this.$message.error(this.tip.rootNoRemove);
					return false;
				}
				if(treeNode.children && treeNode.children.length){
					this.$message.error(this.tip.hasChildNoRemove);
					return false;
				}else{
					this.confirmPrompt()
					.then(_ => {
						return this.deleteFleet(treeNode.id);
					})
					.then(result => {
						this.resultCallback(
							result,
							this.$t('action.removeSuccess'),
							this.$t('action.removeFail'),
							treeNode);
					})
	                return false;					
				}
			},
			// 编辑节点请求成功操作
			async editNodeAskFinished(treeNode){
				const {data, flag} = await this.updateFleet({
					id: treeNode.id,
					name: treeNode.text,
					enterpriseId: this.enterpriseId
				});
				if(flag){
					this.$message.success(this.$t('action.modifySuccess')); 
				}else{
					this.$message.error(this.$t('action.modifyFail'));
					treeNode.text = this.beforeEditName;
					this.tree.updateNode(treeNode);
				}
			},
			// 编辑节点操作
			editNodes(treeNode){
				if(treeNode.level === 0){
					this.$message.error(this.tip.rootNoEidt);
					return false;
				}	
			},
			// 添加节点
			addNode(treeNode){
				if(treeNode.level >= 4){
					this.$message.error(this.tip.allMostFour);
				}else{
					this.operationType = 'add';
					this.tree.addNodes(treeNode, {
						pId: treeNode.id,
						text: ""
					});
					let lastEditNode = treeNode.children[treeNode.children.length-1];			
					this.tree.editName(lastEditNode);
				}				
			},
			// 编辑节点完成后的回调---注意区分add和edit
			onRename(treeNode){
				let text = treeNode.text.replace(/\s+/g, "");
				treeNode.text = text;
				this.tree.updateNode(treeNode);
				if(this.operationType === 'add'){
					text === "" ? this.tree.removeNode(treeNode) : this.addNodeAskFinished(treeNode);
				}
				if(this.operationType === 'edit'){
					if(text === "" || text == this.beforeEditName){
						treeNode.text = this.beforeEditName;
						this.tree.updateNode(treeNode);
					}else{
						this.editNodeAskFinished(treeNode);
					}
				}
			},
			// 成功或失败的回调
			resultCallback(data, success, error, treeNode ) {
				if(this.$service.isObject(data)){
					if (data.flag) {
						this.$message.success(success);
						this.tree.removeNode(treeNode);
					} else {
						this.$message.error(error);
					}
				}
			}
		},
		watch: {
			enterpriseId(newVal){
				this.transferTree(newVal);
			},
			editModel(newVal){
				this.tree && this.tree.filter(newVal);
			}
		},
		mounted(){
			let vm = this;
			let treeId = 'editTree' + new Date() * 1;
			this.$refs['editZtree'].id = 'editTree' + new Date() * 1;
			this.tree = new EditTree(treeId, {
				methods: {
					nodeClick(treeNode){
						vm.$emit('node-click', treeNode);
					},
					beforeEditName(treeNode){
						vm.operationType = 'edit';
						vm.beforeEditName = treeNode.text;
						return vm.editNodes(treeNode);				
					},
					beforeRemove(treeNode){
						return vm.removeNodes(treeNode);
					},
					onRename(treeNode){
						return vm.onRename(treeNode);
					},
					addNode(treeNode){
						return vm.addNode(treeNode);
					}
				},
				isEdit:this.isEdit
			});
		}
	}
</script>

<style lang="scss">
	.cv-edit-tree{
		clear: both;
		.tree-search{
			width: 97%;
			margin: 3px auto;
		}
		.cv-search-tree li span.button.add{
			margin-left:2px; 
			margin-right: -1px; 
			background-position:-144px 0; 
			*vertical-align:middle
		}
	}
</style>