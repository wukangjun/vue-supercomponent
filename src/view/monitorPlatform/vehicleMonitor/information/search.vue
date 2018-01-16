<template>
	<div>
		<el-form :model="options.search" label-position="top" label-width="80px" ref="searchForm" :rules="rules">
			<el-form-item :label="$t('information.infoTypeContent')" prop="infoTypeContent">
				<el-input v-model="options.search.infoTypeContent" size="small" :maxlength='500'></el-input>
			</el-form-item>
			<el-form-item :label="$t('information.information')" prop="information">
				<el-input v-model="options.search.information" size="small" :maxlength='500'></el-input>
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