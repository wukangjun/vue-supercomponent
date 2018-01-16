<template>
	<div>
		<el-form :model="options.search" label-position="top" label-width="80px" ref="searchForm" :rules="rules">
			<el-form-item :label="$t('dm.company')" prop="enterpriseName">
				<cv-dropdown-tree 
						:interface="interface" 
						v-model="options.search.enterpriseName"
						@label="enterpriseId"></cv-dropdown-tree>
			</el-form-item>
			<el-form-item :label="$t('dM.name')" prop="username">
				<el-input v-model="options.search.username" size="small" :maxlength='10'></el-input>
			</el-form-item>
		</el-form>
		<div class="dialog-footer">
			<el-button type="primary" @click="confirm">{{$t('action.confirm')}}</el-button>
			<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
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
				interface: COMMON.baseUrl + '/enterprise/getEnterpriseTreeList',
				 rules: {
                  username: [
                        { min:0, max: 10, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:10}) }
                    ]
                },
			}

		},
		methods: {
			confirm(){
				this.$emit('confirm');
				this.options.flag = false;
			},
			enterpriseId(val){				
				val.id == 'empty' ?( this.options.search.id = ''):(this.options.search.id = val.id);
			}
		},
	}
</script>