<template>
	<div>
		<el-form :model="options.search" label-position="top" label-width="80px" ref="searchForm">
			<el-form-item :label="$t('vt.carFactory1')" prop="carBrand">
				<el-input v-model="options.search.carBrand"></el-input>
			</el-form-item>
			<el-form-item :label="$t('vt.vehicleType1')" prop="carMode">
				<el-input v-model="options.search.carMode"></el-input>
			</el-form-item>
		</el-form>
		<div class="dialog-footer">
			<el-button type="primary" @click="confirm">{{$t('msg.confirm')}}</el-button>
			<el-button @click="options.flag=false">{{$t('msg.cancel')}}</el-button>
		</div>
	</div>
</template>

<script>
	export default{
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
			"options.flag"(newVal){
				if(!newVal){
					this.$refs['searchForm'].resetFields();
				}
			}
		}
	}
</script>