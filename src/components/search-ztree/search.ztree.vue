<template>
	<el-scrollbar 
	tag="ul"
  	:wrap-class="heightStyle"
  	view-class="el-select-dropdown__list">
		<ul class="cv-search-tree ztree" ref="ztree"></ul>
	</el-scrollbar>
</template>
<script>
	import SearchTree from './model'
	export default {
		props: {
			data: {},
			isCheck: {
				default: false
			},
			isDisabled: {
				default: false
			},
			nodeClick: {
				default: Function
			},
			// 高度的class类名
			heightStyle: {
				default: 'el-select-dropdown__search'
			},
			// 默认关联checkbox
			correlation: {
				default: true
			}
		},
		data(){
			return {
				tree: null
			}
		},
		methods: {
			// 搜索过滤节点
			filter(value){
				return this.tree.filter(value);
			},
			checkNodeById(ids){
				this.tree.checkNodeByIds(ids);
			},
			// 勾选所有节点
			checkAllNodes(){
				return this.tree.checkAllNodes();
			},
			// 取消所有节点
			cancelAllNodes(){
				return this.tree.cancelAllNodes();
			},
			// 取消选中状态
			cancelSelectedNode(node){
				return this.tree.cancelSelectedNode(node);
			},
			// 禁止所有节点
			disabledAllNodes(flag){
				var nodes = this.tree.getAllNodes();
				if(nodes){
					for (var i=0, l=nodes.length; i < l; i++) {
						this.tree.setChkDisabled(nodes[i], flag, true, true);
					}
				}else{
					return false;
				}
			}
		},
		mounted(){
			let vm = this, nowTime = new Date() * 1;
			let treeId = 'search' + nowTime;		
			this.$refs['ztree'].id = 'search' + nowTime;
			this.tree = new SearchTree(treeId);			
		},
		watch: {
			data(newVal){
				if(this.isDisabled){
					newVal.forEach(val => {
						val.chkDisabled = true;
					})
				}
				let vm = this;
				this.tree.searchTreeInit({
					data: newVal,
					correlation: vm.correlation,
					isCheck: vm.isCheck,
					nodeClick(treeNode){
						vm.$emit('node-click', treeNode);		
					},
					nodeCheck(treeNode, beforeChecked){
						vm.$emit('node-change', vm.tree.getCheckedNodes());		
					},
						init(){
						vm.$emit('treeInit')
					}

				})	
			}
		}
	}
</script>
<style lang="scss">
	.el-select-dropdown__search{
		max-height: 250px;
	}
</style>