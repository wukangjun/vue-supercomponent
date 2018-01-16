<template>
	<ul class="cv-ztree-car ztree" id="public"></ul>
</template>

<script>
	import PublicCar from '@/components/ztree/model/vue.public'
	export default{
		props: {
			data: {
				type: Array
			},
			// 是否有checkbox
			isCheck: {
				type: Boolean,
				default: true
			}
		},
		data(){
			return {
				publicTree: null,
				allNodes: []
			}
		},
		methods: {
			// 取消所有勾选的节点
			cancelAllNodes(){
				return this.publicTree.cancelAllNodes();
			},
			// 取消勾选的节点
			cancelNode(array = []){
				return this.publicTree.cancelNode(array);
			},
			cancelSelectedNode(node){
				return this.publicTree.zTree.cancelSelectedNode(node);
			},
			// 勾选节点
			checkedNode(array = []){
				return this.publicTree.checkedNode(array);
			}
		},
		mounted(){
			let vm = this;
			this.publicTree = new PublicCar('public', {
				url: this.$COMMON.baseUrl + '/monitor/findVehicleTreeInfoList',
				isCheck: this.isCheck,
				methods: {
					// 异步
					async(data){
						vm.allNodes = data;
					},
					// 同步
					label(data, type){
						vm.$emit('label', data, type);
					},
					nodeClick(data){
						vm.$emit('node-click', data);
					},
					disabled(){
						vm.$emit('disabled');
					}
				}
			});	
			this.publicTree.init().then(data => {
				// 公共树加载的初始化数据存储
				this.$store.dispatch('getAsyncNodes', data);
			})		
		},
		watch: {
			allNodes(newVal=[], oldVal=[]){
				this.$emit('async', newVal, oldVal);
			},
			data(newVal){
				this.publicTree.data = newVal;
			},
			isCheck(newVal){
				this.publicTree && this.publicTree.switchCheck(newVal);
			},
			// 监听车辆上下线
			'$store.getters.onlineList'(newVal){
				this.publicTree && this.publicTree.updateCheckedNodes(newVal);
			},
		}
	}
</script>

<style lang="scss">
	
</style>