<template>
	<div>
		<el-form :model="options.search" label-position="top" label-width="80px" ref="searchForm" :rules="rules">
			<el-form-item :label="$t('informationType.infoname')" prop="infoname">
				<el-input v-model="options.search.infoname" size="small" :maxlength='500'></el-input>
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
					  infoname: [
						{ min:0, max: 10, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:500}) }
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