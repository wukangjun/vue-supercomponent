<template>
	<div>
		<el-form :model="options.search" label-position="top" label-width="80px" ref="searchForm" :rules="rules">
		        <el-form-item :label="$t('predefinedInfo.type')" prop="type">
						<el-select v-model="options.search.type" style="width:360px;" size="small" clearable>
							<el-option :label="$t('predefinedInfo.selectOpt1')" value="0"></el-option>
							<el-option :label="$t('predefinedInfo.selectOpt2')" value="2"></el-option>
							<el-option :label="$t('predefinedInfo.selectOpt3')" value="3"></el-option>
							<el-option :label="$t('predefinedInfo.selectOpt4')" value="4"></el-option>
						</el-select>
			</el-form-item>
			<el-form-item :label="$t('predefinedInfo.msginfo')" prop="msginfo">
				<el-input v-model="options.search.msginfo" size="small" :maxlength='100'></el-input>
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
				 rules: {
					  msginfo: [
						{ min:0, max: 500, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:500}) }
					  ]
                                 },
			}

		},
		methods: {
			confirm(){
				this.$emit('confirm');
				this.options.flag = false;
			}
		},
	}
</script>