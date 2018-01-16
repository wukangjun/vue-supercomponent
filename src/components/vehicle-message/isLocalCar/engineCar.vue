<template>
	<div class="loaclLast" style="height=360px">
		<el-form :model="form" :rules="rules" ref="form" label-width="100px">
			<el-form-item :label="$store.getters.isShowCar?'解除原因':'限制原因:'" prop="reason" style="width:512px">
				<el-input type="textarea"  placeholder="请输入内容" v-model.trim="form.reason"   class="text2">
				</el-input>
			</el-form-item>
			<el-form-item label="手机号:" prop="number" style="width:512px">
				<el-checkbox v-model="checked">短信通知</el-checkbox>
				<el-input placeholder="请输入手机号" v-model="form.number">
					<!-- 下次开发的号码添加模块 -->
					<!-- <template slot="append" style="padding:0">
						<el-button class="btn" @click="getNumber()">+</el-button>
					</template> -->
				</el-input>
			</el-form-item>
			<el-form-item label="短信内容:" prop="message" style="margin-top:20px;width:512px">
				<el-input type="textarea" placeholder="请输入内容" v-model="form.message"  class="text2">
				</el-input>
			</el-form-item>
			<el-form-item style="margin-top:30px;">
				<el-button type="primary" @click="goBack()" class="confirm">上一步</el-button>
				<el-button type="primary" @click="submitForm(form)" class="cancel" :loading="loading" aria-label="Close" v-if="!$store.getters.isShowCar">限制</el-button>
				<el-button type="primary" @click="submitForm(form)" class="cancel" :loading="loading" aria-label="Close" v-if="$store.getters.isShowCar">解除限制</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import { http, COMMON } from '@/utils'
export default {
	props: {
		data: {}
	},
	data() {
		return {
			typePam:'',
			loading: false,
			checked: false,
			form: {
				reason: '',
				number: '',
				message: ''
			},
			dialog: {
				flag: false
			},
			rules: {
				reason: [
					{ required: true, message: '限制原因不能为空', trigger: 'blur,change' },
				],
				number: [
					{ required:false, message: '手机号不能为空', trigger: 'blur,change' },
					{ pattern: /^1[34578]\d{9}$/, message: this.$t('terminalProM.typeCorrectNum') },
					
				],
				message: [
					{ required: false, message: '短信内容不能为空', trigger: 'blur,change' }
				]
			}

		}
	},
	methods: {
			lastCarStatus(){
			let params = {
				vehicleId: this.$store.getters.carCurrent.vehicleId
			}
			this.$http({ url: COMMON.baseUrl + '/lockCar/queryStatus', method: 'POST', params: params }).then((data) => {
				if (data.flag) {
					if (data.data == "0"){
						this.$store.dispatch('isShowCar',true)
					} else {	
						this.$store.dispatch('isShowCar',false)
					}
				} else {

				}
			})
		},	
		goBack() {
			this.$parent.dialog.active=2;
			this.data.moreErect = false;
		},
		submitForm(form) {
			this.$refs['form'].validate(valid => {
				if (valid) {	
					let params = {
						
						vehicleId: this.$store.getters.carCurrent.vehicleId,
						//限制类型
						type: this.$store.getters.isShowCar ? 0 : 1,
						//能力项id
						// abillityIds: this.$store.getters.isShowCar ? this.$store.getters.isAllInfo.abillityIds : this.$store.getters.isLocalCar,
						abillityIds: 7,
						//操作通知的手机号
						number: this.form.number,
						// number:'18226145290',
						//限制原因
						reason: this.form.reason,
						//限制密码
						password: this.$store.getters.isLocalPassword,
						//短信内容
						content: this.form.message,
						//断油类型参数
						infoParam: '5,1'
						//  infoParam:''+this.$store,getters.isLocalCar+',1'

					}
					this.typePam=params.type;
					this.loading = true;
					this.$http({ url: COMMON.baseUrl + '/lockCar/confirm', method: 'POST', params: params }).then((data) => {
						let _self=this;
						if (data.flag) {
							_self.$parent.$parent.$parent.$parent.dialog.flag = false;
							_self.lastCarStatus();		
							this.loading = false;
						} else {
							this.$message.error(this.$t('error.'+data.errorCode));
							this.loading = false;
						}

					})
				} else {
					return false;
				}
			})

		},

	},
	mounted() {
		console.log(this.$store.getters)
	},
	watch: {
		"checked"(newVal) {
			if (newVal==true) {
				this.rules.number[0].required = true;
				this.rules.message[0].required = true;
			} else if(newVal==false){
				this.rules.number[0].required = false;
				this.rules.message[0].required = false;
			}
		},
		'data.flag'(newVal) {
			this.dialog.flag = newVal;

		},
		// 'typePam'(newVal){
		// 	if(newVal==0){
		// 		return this.$store.getters.isShowCar=false;
		// 	}else{
		// 		return this.$store.getters.isShowCar=true;
		// 	}
		// }
	}

}
</script>
<style lang="scss">

.text2{
	textarea{
		overflow-y:hidden;
	}
}

</style>
