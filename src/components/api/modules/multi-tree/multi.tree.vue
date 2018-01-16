<template>
	<el-row :gutter="20" class="api-multi-tree">
		<el-col :span="7">
			<multi-tree
			@single="nodeClick"></multi-tree>
		</el-col>
		<el-col :span="13">
			<pre>
				1. 监控树--单车(局部引入组件)
				< multi-tree @single="nodeClick"></ multi-tree>
				参数说明：
				@single--- 触发的单车点击事件接受1个参数({id: 4908522, plateCode: "豫AZ5090"})

			</pre>
		</el-col>
		<el-col :span="7">
			<multi-tree
			@single="nodeClick"></multi-tree>
		</el-col>
		<el-col :span="13">
			<pre>
				2. 监控树--多车(局部引入组件)
				< multi-tree 
				@vehicle="nodeClick"
				:is-double="false"
				:is-border="false"
				:show-checkbox="false"
				:default-show="false"
				:show-track="true"
				:is-loading="mapFlag"></ multi-tree>
				参数说明：
				@vehicle --- 触发多车点击事件,返回树中所有选择的车辆信息({id:1,plateCode:"AAAAA"},{id:2,plateCode:"BBBBB"}……)
				:is-double --- 切换tab是否为多选，boolean,默认为false
				:is-border --- 是否有边框，boolean，默认为true
				:show-checkbox --- 是否显示复选框，boolean，默认为false
				:default-show --- 是否默认显示下拉列表，boolean，默认为false
				:show-track="true" --- 是否显示轨迹，boolean，默认为false
				:is-loading="mapFlag" --- 是否显示loading加载，boolean，默认为false
			</pre>
		</el-col>
	</el-row>
</template>

<script>
	import multiTree from '@/components/monitor-tree/monitor.tree.vue'
	export default{
		components: {multiTree},
		methods: {
			nodeClick(val){
				console.log(val)
			}
		}
	}
</script>

<style lang="scss">
	.api-multi-tree{
		.tree{
			width: 300px;
		}
	}
</style>