<template>
	<el-row :gutter="20" class="api-dropdown-tree">
		<el-col :span="8">
			<dropdown-tree :interface="$COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'" :is-default="true" v-model="companyText"></dropdown-tree>
		</el-col>
		<el-col :span="12">
			<pre>
				1. 下拉树--单选(局部引入组件)
				< dropdown-tree 
				:interface="$COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'" :is-default="true" 
				v-model="companyText">
				< /dropdown-tree>
				参数说明：
				:interface--- 下拉树里面的数据信息，直接在这里写接口即可
				:is-default--- 下拉树是否默认显示第一个公司，默认为fasle不显示，true为显示

			</pre>
		</el-col>
		<el-col :span="8">
			<dropdown-tree 
				:interface="$COMMON.baseUrl+'/alarmInfo/frinAlarmTypeInfoList.do'"
				:show-checkbox="true"
				></dropdown-tree>
		</el-col>
		<el-col :span="12">
			<pre>
				2. 下拉树--多选(局部引入组件)
				< dropdown-tree 
				:interface="$COMMON.baseUrl+'/alarmInfo/frinAlarmTypeInfoList.do'"
				:show-checkbox="true">
				< /dropdown-tree>
				参数说明：
				:interface--- 下拉树里面的数据信息，直接在这里写接口即可
				:show-checkbox--- 是否为多选true为多选，false不是多选

			</pre>
		</el-col>
	</el-row>
</template>

<script>
	import dropdownTree from '../../../dropdown-tree/dropdown.tree.vue'
	export default{
		components: {dropdownTree},
		data(){
			return{
				// companyID:'',
				companyText:''
			}
		}
		// methods:{
		// 	selectValue(data) {
		// 		if (data.id) {
		// 			this.companyID = data.id;
		// 		}
		// 	}
		// }
	}
</script>