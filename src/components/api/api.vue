<template>
	<div class="cv-api">
		<el-row class="container" :gutter="100">
			<el-col :span="4" style="height: 600px;overflow-y:auto">
				<el-button 
				v-for="com in components" 
				:key="com.name" 
				@click="transferApi(com.componentName, com.name)"
				class="apiBtn"
				type="primary">{{com.name}}</el-button>
			</el-col>
			<el-col :span="20" style="overflow-y:auto;height: 660px">
				<component :is='componentName' :name="title"></component>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import cvBaidu from './modules/baidu/baidu.vue'
	import cvDropdownTree from './modules/dropdownTree/dropdown.tree.vue'
	import cvGoogle from './modules/google/google.vue'
	import cvGrid from './modules/grid/grid.vue'
	import cvSpan from './modules/span/span.vue'
	import cvSvg from './modules/svg/svg.vue'
	import cvTableTool from './modules/tableTool/table.tool.vue'
	import cvTool from './modules/tool/tool.vue'
	import cvPublicTree from './modules/multi-tree/multi.tree.vue'
	import icon from "./modules/icon/icon.vue"
	import allCheck from "./modules/allCheck/allCheck.vue"
	import filters from "./modules/filters/filters.vue"
	import searchTree from "./modules/searchTree/search.tree.vue"
	import multiTreeZtree from './modules/multi-tree-ztree/multi.tree.ztree.vue'
	const components = [
		{name: 'Svg图标库', componentName: 'cv-svg'},
		{name: '表格', componentName: 'cv-grid'},
		{name: '百度', componentName: 'cv-baidu'},
		{name: '谷歌', componentName: 'cv-google'},
		{name: 'span标签', componentName: 'cv-span'},
		{name: '下拉树', componentName: 'cv-dropdownTree'},
		{name: '工具条(公共)', componentName: 'cv-tool'},
		{name: '表格工具条', componentName: 'cv-tableTool'},
		{name: '公共树', componentName: 'cv-public-tree'},
		{name:"仿el图标库存",componentName:'icon'},
		{name:"checkBox多选",componentName:'allCheck'},
		{name:'filter过滤',componentName:'filters'},
		{name:"搜索树",componentName:'search-tree'},
		{name: 'ztree车辆树', componentName: 'multiTreeZtree'}
	]
	export default{
		components: {
			cvBaidu,
			cvDropdownTree,
			cvGoogle,
			cvGrid,
			cvSpan,
			cvSvg,
			cvTableTool,
			cvTool,
			cvPublicTree,
			icon,
			allCheck,
			filters,
			allCheck,
			searchTree,
			multiTreeZtree
		},
		data(){
			return{
				componentName: "cv-svg",
				title: "Svg图标库",
				components: components
			}
		},
		methods: {
			transferApi(cname, name){
				this.componentName = cname;
				this.title = name;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cv-api{
		.apiBtn{
			margin-top:20px;
		}
		// 图标样式
		.svg{

		}
	}
</style>