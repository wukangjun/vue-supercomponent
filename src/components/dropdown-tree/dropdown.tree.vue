<!-- 
* 目前是公司下拉树
* author: wukangjun
* time: 2017.07.20
 -->
<template>
	<div class="cv-dropdown-tree" v-clickoutside="outHide" >
		<el-input 
		readonly 
		v-model="contents" 
		@click.native="toggle" 
		:icon="readonly ? 'caret-bottom' : ((contents=='') ? 'caret-bottom'  :'circle-close')" 
		:on-icon-click="handleIconClick"
		:class="{cvRread: readonly?true:false}" 
		:placeholder="placeholder"  :size="size"
		
		></el-input>
		<transition name="el-zoom-in-top">
			<div class="tree-area" v-show="!readonly&&toggleFlag">
				<el-input placeholder="搜索" class="tree-search" v-model="search"  ></el-input>
				<search-tree
					ref="searchtree"
					:correlation="correlation"
					:data="treeData" 
					:isCheck="isCheck"
					@node-click="handlerNodes"
					@node-change="checkEvent"
					v-loading="loading"
					></search-tree>
			</div>
		</transition>		
	</div>
</template>

<script>
	import {http, service} from '@/utils'
	import multiTree from '@/components/tree/src/tree.vue'
	import searchTree from '@/components/search-ztree/search.ztree.vue'
	let vm = null;
	export default{
		name: 'cvDropdownTree',
		components: {multiTree,searchTree},
		props: {
			isFleet:{
				type:[Boolean],
				default:false
			},
			value: {},
			data: {
				default(){
					return []
				}
			},
			isCheck: {
				default: false
			},
			placeholder: {},
			interface: {},
			isDefault: {
				type: [Boolean],
				default: false
			},
			readonly: {
				type: Boolean,
				default: false
			},
			enterpriseId: {},
			size: {
				default: 'small'
			},
			showCheckbox: {
				default: false
			},
			type: {
				type: [String, Number],
				default: 3
			},
			correlation: {
				default: true
			}
		},
		data(){
			return {
				loading:false,
				treeData: [],
				content: "",
				text: "",
				search: "",
				toggleFlag: false,
				checkIds: [],     //选中的所有选项
				checkText: [],   //选中的所有文字
				defaultProps: {
					children: 'children',
          			label: 'text'
				}
			}
		},
		watch: {
			search(newVal){
				this.$refs.searchtree.filter(newVal)
			},
			data(newVal){
				this.treeData = newVal;
			},
			enterpriseId(newVal){
				if(!service.isNull(newVal)){
					this.readonly = false;
					
					this.getTreeData();
				}else{
					this.readonly = true
				}
			},
			checkIds(newVal){
				let arr = [];	
				this.checkText = [];
				if(newVal.length > 0){
					newVal.forEach(val => {
						if(parseInt(val.type) === parseInt(this.type)){							
							arr.push(val.id);
							this.checkText.push(val.text)
						}
					})
					this.$emit('checked', arr)
				}else{
					this.$emit('checked', []);
					this.checkText = [];
				}
			},
			'$store.getters.getTreeNode'(data){
				if(!service.isUndefined(data.text)){
					this.contents = data.text;
					this.$emit('label', {id:data.id, enterpriseCode:data.enterpriseCode,text:data.text});
					
				}
				if(!this.showCheckbox){
					this.toggleFlag = false;
				}		
			}
		},
		computed: {
			contents: {
				get(){
					if(this.showCheckbox){			
						return this.checkText.join(',')
					}else{
						return this.value ? this.value : ""
					}					
				},
				set(val){
					this.$emit('input', val);
				}
			}
		},
		methods: {
			toggle(){					  
				this.toggleFlag = !this.toggleFlag;
			},
			outHide(){
				this.toggleFlag = false;	
			},
			handlerNodes(data){
				if(!service.isUndefined(data.text)){
					this.contents = data.text;
					this.$emit('label', {id:data.id, enterpriseCode:data.enterpriseCode,text:data.text})
				}
				if(!this.showCheckbox){
					this.toggleFlag = false;
				}								
			},
			handleIconClick(e){
				if( !this.readonly){
					if(this.contents != "" ){
						this.$emit('label', {id: 'empty', enterpriseCode:"",text:""});				
						let ev = window.event || e;
						ev.stopPropagation();
						// 内容清空
						this.contents = "";
						// 报警类型树的清空
						this.cleanCheckEvent();		
						// 选中状态情况清空
						this.$refs['searchtree'].cancelSelectedNode();			
					}
				}
			},
			cleanCheckEvent(){					
				// 清空文字组
				this.checkText = [];
				// 清空树节点
				this.$refs['searchtree'].cancelAllNodes([]);
				this.$emit('checked', []);				
			},
			checkEvent(nodes){
				this.checkIds = [];
				this.checkIds = nodes;
			},
			filterNode(value, data){
				if (!value) return true;
        		return data.text.indexOf(value) !== -1;
			},
			//获取树的数据
			getTreeData(){
				
				if(service.isUndefined(this.interface)){
					
					this.treeData = this.data;	
					this.isDefault ? this.defaultFirst(this.treeData): null;	
				}else{
					if(this.enterpriseId == 'empty' ||this.enterpriseId==""){
						this.treeData = [];
					}else{
						this.loading=true;
						http({
							url: this.interface,
							params: {
								enterpriseId: this.enterpriseId
							}
						})
						.then(data => {
							if(data.flag){
								this.loading=false;	
								if(service.isArray(data.data)){
									if(this.isFleet){
										this.treeData = data.data;
									}else{
										this.treeData = data.data;
									}
								}else{	
									if(service.isArray(data.data.children)){
										this.treeData = data.data.children;
										this.treeData.length ==0 && (this.contents="");
									}else{
										this.treeData = [];
										this.contents="";
									}
									// 报警下拉树专用
									service.isArray(data.data.AlarmType) ?  
									this.$emit('allAlarmType', data.data.AlarmType): null;
								}							
							}else{
								this.treeData = [];
							}	
							this.isDefault ? this.defaultFirst(this.treeData): null;
											
						})
					}
				}
			},
			//默认获取第一个树的数据
			defaultFirst(data){
				if(service.isArray(data)){
					let first = data[0];
					if(!service.isUndefined(first)){
						this.contents = first.text;
						let id = first.id, enterpriseCode = first.enterpriseCode, text = first.text;
						this.$emit('label', {id: id, enterpriseCode:enterpriseCode, text:text})
					}
				}
			}
		},
		mounted(){
			this.getTreeData();
		}
	}
</script>

<style lang="scss">
	.cv-dropdown-tree{
		position: relative;
		.cvRread{
			input{
				background-color: #eef1f6;
				border-color: #d1dbe5;
				color: #bbb;
				cursor: not-allowed;
			}
		}
		.tree-area{
			position: absolute;
			top: 100%;
			z-index: 2002;
			margin-top: 5px;
			border-radius: 2px;
			width: 100%;
			max-height: 336px;
			background: #fff;
			border: 1px solid #ccc;
			box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
			.el-tree{
				border: 0;
			}
			.el-tree-node>.el-tree-node__children {
				overflow: inherit;
			}
		}
		.tree-search{
			width: 92%;
			margin: 10px 4%;
		}
	}
</style>