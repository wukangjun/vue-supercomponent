<template>
	<div>
		<el-form label-position="top" :model="form" :rules="rules" ref="addForm">
			<el-form-item :label="$t('msg.company1')" prop="label">
				<cv-dropdown-tree 
				:interface="interface" 
				v-model="form.label"
				@label="enterpriseId"></cv-dropdown-tree>
			</el-form-item>
			<el-form-item :label="$t('carFactory.carname1')" prop="name">
				<el-input v-model="form.name"></el-input>
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
				interface: COMMON.baseUrl + '/enterprise/getEnterpriseTreeList',
				form: {
					name: "",
					label: "",
					id: ""
				},
				rules: {
					label: [
						{required: true, message: this.$t('msg.notEmpty'), trigger: 'blur,change'}
					],
					name: [
						{required: true, message: this.$t('msg.notEmpty'), trigger: 'blur,change'}
					]
				}
			}
		},
		methods: {
			confirm(){
				this.$refs['addForm'].validate(valid => {
					if(valid){
						let params = {
							enterpriseId: this.form.id,
							name: this.form.name
						}
						this.options.flag = false;
						this.$store.dispatch('insertSysManufacturer', params).then(data => {
							if(data.flag){
								this.$notify.success(this.$t('msg.addSuccess'));
								this.$emit('confirm')
							}else{
								this.$notify.error(this.$t('msg.addFail'));
							}
						})
						
					}else{
						return false
					}
				})
			},
			enterpriseId({id}){
				this.form.id = id
			}
		},
		watch: {
			'options.flag'(newVal){
				if(!newVal){
					this.$refs['addForm'].resetFields()
				}
			}
		}
	}
</script>

<style lang="scss">
	
</style>