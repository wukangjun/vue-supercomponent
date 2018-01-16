<template>
	<div>
		<el-form :model="options.modify" :rules="rules" ref="modify">
			<el-form-item :label="$t('carFactory.carname1')" prop="name">
				<el-input v-model="options.modify.name"></el-input>
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
		data(){
			return{
				rules: {
					name: [
						{required: true, message: this.$t('msg.notEmpty'), trigger: 'blur,change'}
					]
				}
			}
		},
		methods: {
			confirm(){
				this.$refs['modify'].validate(valid => {
					if(valid){
						let params = {
							name: this.options.modify.name,
							id: this.options.modify.id
						}
						this.$store.dispatch('updateManufacturersInfo', params).then(data => {
							if(data.flag){
								this.$notify.success(this.$t('msg.modifySuccess'));
								this.options.flag = false;
							}else{
								this.$notify.error(this.$t('msg.modifyFail'));
							}
						})
					}
				})
			}
		}
	}
</script>