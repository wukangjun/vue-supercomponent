<template>
	<div>
		<el-form :inline='true'  label-position='right' :model='options.search' label-width="100px" :rules='rules' ref='searchForm'>
			<el-form-item :label="$t('terminal.company1')">
				<cv-dropdown-tree 
				style="width:240px"
				:placeholder="$t('common.enterprise.affiliated')"
				:interface="this.getEnterpriseTreeList()"
				:is-default="false"
				v-model='options.search.company'
				@label="getCompany"></cv-dropdown-tree>
			</el-form-item>
			<el-form-item :label="$t('terminal.terminalTel1')" prop='terminalTel'>
				<el-input v-model.trim="options.search.terminalTel" size='small' :maxlength='12' >
				</el-input>
			</el-form-item>
			<el-form-item :label="$t('terminal.plateCode')" prop='plateCode'>
				<el-input v-model.trim="options.search.plateCode" size='small' :maxlength='10' >
				</el-input>
			</el-form-item>
			<el-form-item label="终端编号" prop='plateCode'>
				<el-input v-model.trim="options.search.code" size='small' :maxlength='10' >
				</el-input>
			</el-form-item>
		</el-form>
		<div class='dialog-footer'>
			<el-button type="primary"  @click="confirm">{{ $t('action.confirm') }}</el-button>
			<el-button @click='options.flag=false'>{{ $t('action.cancel') }}</el-button>
		</div>
	</div>
</template>
<script>
	import port from './index.js'
	export default{
		mixins: [port],
		props: {
			options: {}
		},
		data(){
			return{
				rules:{
					terminalTel:[
						{pattern:/^[0-9]+$/,message:this.$t("filter.type2"),trigger:'blur,change'}
					],
					plateCode: [
						{pattern:/^[\u4e00-\u9fa5|WJ]|[A-Z0-9]+$/,message:this.$t("filter.type6"),trigger:'blur,change'}
					],
				}
			}
		},
		methods: {
			confirm(){
				this.$emit('confirm', true);
				this.options.flag = false;
			},
			getCompany(val){
				val.id == 'empty'?(this.options.search.enterpriseId=''):(this.options.search.enterpriseId=val.id);
			}
		},
		watch: {
			"options.flag"(newVal){
				if(!newVal){
					this.options.name = "";
				}
			}
		}
	}
</script>
<style lang='scss' scoped>
	.el-input{
		width: 240px !important;
	}
</style>