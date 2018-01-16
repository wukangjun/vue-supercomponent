<template>
	<el-row class="container">
		<el-col :span="24">
			<el-form :model="formData" label-position="top" :rules="rules" :inline="true">				
					<el-form-item :label="$t('vt.company1')" prop="enterprise">
						<el-input v-model="formData.enterprise"></el-input>
					</el-form-item>
					<el-form-item :label="$t('vt.brand1')" prop="carBrand">
						<el-select v-model="formData.carBrand"></el-select>
						<el-button icon="plus" @click="addBrand"></el-button>
					</el-form-item>
					<el-form-item :label="$t('vt.carFactory1')" prop="carFactory">
						<el-select v-model="formData.carFactory"></el-select>
						<el-button icon="plus" @click="addCarFactory"></el-button>
					</el-form-item>
					<el-form-item :label="$t('vt.oilType1')" prop="gasoline">
						<el-input v-model="formData.gasoline"></el-input>
					</el-form-item>
					<el-form-item :label="$t('vt.motorNum1')" prop="maxWeight">
						<el-input v-model="formData.maxWeight"></el-input>
					</el-form-item>
					<el-form-item :label="$t('vt.motorStandard1')" prop="engineBasicTurnum">
						<el-input v-model="formData.engineBasicTurnum"></el-input>
					</el-form-item>
					<el-form-item :label="$t('vt.tyre1')" prop="maxWeight">
						<el-input v-model="formData.maxWeight"></el-input>
					</el-form-item>	
					<el-form-item :label="$t('vt.weight1')" prop="maxWeight">
						<el-input v-model="formData.maxWeight"></el-input>
					</el-form-item>								
					<el-form-item :label="$t('vt.vehicleType1')" prop="carMode">
						<el-input v-model="formData.carMode"></el-input>
					</el-form-item>
					<el-form-item :label="$t('vt.limitPeople1')" prop="maxPassenger">
						<el-input v-model="formData.maxPassenger"></el-input>
					</el-form-item>
					<el-form-item :label="$t('vt.electric1')" prop="voltage">
						<el-input v-model="formData.voltage"></el-input>
					</el-form-item>
					<el-form-item :label="$t('vt.motorBrand1')" prop="engineBrand">
						<el-input v-model="formData.engineBrand"></el-input>
					</el-form-item>
					<el-form-item :label="$t('vt.motorType1')" prop="engineType">
						<el-input v-model="formData.engineType"></el-input>
					</el-form-item>
					<el-form-item :label="$t('vt.speed1')" prop="speedRatio">
						<el-input v-model="formData.speedRatio"></el-input>
					</el-form-item>				
			</el-form>
		</el-col>
		<el-col :span="24" class="dialog-footer">
			<el-button type="primary">{{$t('msg.save')}}</el-button>
			<el-button @click="options.flag=false">{{$t('msg.cancel')}}</el-button>
		</el-col>
	</el-row>
</template>

<script>
	export default{
		props: {
			options: {}
		},
		data(){
			return{
				formData:{
					enterprise: "",
					carFactory: "",
					enterpriseCode: "",    	
					carMode: "",			
					carBrand: "",			
					maxWeight: "",			
					maxPassenger: "",		
					gasoline: 1,			
					voltage: "",			
					engineCode: "",			
					engineBrand: "",	
					engineType: 1,	
					engineBasicTurnum: "",	
					tireRollingRadius: "",	
					speedRatio: ""			
				},
				rules: {
					enterprise: [{required: true, message: this.$t('filter.noempty'), trigger: 'blur,change'}]
				}
			}
		},
		methods: {
			//添加品牌弹框事件
			addBrand(){
				this.options.dialog1.flag = true;
				this.options.dialog1.size = 'dialog-small';
				this.options.dialog1.name = 'addBrand';
				this.options.dialog1.title = this.$t('vt.vehicleBrand');
			},
			addCarFactory(){
				this.options.dialog1.flag = true;
				this.options.dialog1.size = 'dialog-small';
				this.options.dialog1.name = 'addCarFactory';
				this.options.dialog1.title = this.$t('vt.vehicleBrand');
			}
		}
	}
</script>
<style lang="scss" scoped>
	.dialog-search{
		margin-top: 24px;
	}
	.el-select{
		width: 120px
	}
</style>