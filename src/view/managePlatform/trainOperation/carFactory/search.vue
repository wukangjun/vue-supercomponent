<template>
	<div>
		<el-form :model="options.search" label-position="top" ref="searchForm">
			<el-form-item :label="$t('msg.company1')" prop="enterpriseId">
				<cv-dropdown-tree 
				:interface="interface" 
				v-model="enterpriseName"
				@label="enterpriseId"></cv-dropdown-tree>
			</el-form-item>
			<el-form-item :label="$t('carFactory.carname1')" prop="name">
				<el-input v-model="options.search.name"></el-input>
			</el-form-item>
		</el-form>
		<div class="dialog-footer">
			<el-button type="primary" @click="confirm">{{$t('msg.confirm')}}</el-button>
			<el-button @click="options.flag=false">{{$t('msg.cancel')}}</el-button>
		</div>
	</div>
</template>

<script>
	import {COMMON} from '@/utils'
	export default{
		props: {
			options: {}
		},
		data(){
			return{
				enterpriseName: "",
				interface: COMMON.baseUrl + '/enterprise/getEnterpriseTreeList'
			}
		},
		methods: {
			confirm(){
				this.$emit('confirm');	
				this.options.flag = false;			
			},
			enterpriseId({id}){
				this.options.search.enterpriseId = id;
			}
		},
		watch: {
			'options.flag'(newVal){
				if(!newVal){
					this.options.name = "";
					this.options.flag = false;
					this.$refs['searchForm'].resetFields()
				}
			}
		}
	}
</script>
