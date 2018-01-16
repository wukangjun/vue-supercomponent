<template>
	<div>
		<el-form :model="options.search" ref="searchForm">
			<el-form-item :label="$t('vgEscrow.company')" prop="enterpriseName">
				<el-input v-model.trim="options.search.enterpriseName" :maxlength='30'></el-input>
			</el-form-item>
			<el-form-item :label="$t('vgEscrow.plateCode')" prop="plateCode">
				<el-input v-model.trim="options.search.plateCode" :maxlength='30'></el-input>
			</el-form-item>
		</el-form>
		<div class="dialog-footer">
			<el-button type="primary" @click="confirm">{{$t('action.confirm')}}</el-button>
			<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
		</div>
	</div>
</template>

<script>
	import photoGroup from '@/components/photo-group/photo.group.vue'
	export default{
		components: {photoGroup},
		props: {
			options: {}
		},
		methods: {
			confirm(){
				this.$emit('confirm');
				this.options.flag = false;
			}
		},
		watch: {
			'options.flag'(newVal){
				if(!newVal){
					this.$refs['searchForm'].resetFields()
				}
			}
		}
	}
</script>