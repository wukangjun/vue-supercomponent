<template>
	<div>
		<el-row class="item" :gutter="20">
			<el-col :span="6">所属企业:</el-col>
			<el-col :span="17">{{detailInfo.enterpriseName|isValue}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">所属分组:</el-col>
			<el-col :span="17">{{detailInfo.fleetName|isValue}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">车架号:</el-col>
			<el-col :span="17">{{detailInfo.carVin|isValue}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">SIM卡号:</el-col>
			<el-col :span="17">{{detailInfo.simCode|isValue}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">终端编号:</el-col>
			<el-col :span="17">{{detailInfo.terminalCode|isValue}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">车牌颜色:</el-col>
			<el-col :span="17">{{detailInfo.plateColor|isValue|plateCodeColor}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">司机:</el-col>
			<el-col :span="17">{{detailInfo.driver|isValue}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">车辆品牌:</el-col>
			<el-col :span="17">{{detailInfo.brandName|isValue}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">车辆型号:</el-col>
			<el-col :span="17">{{detailInfo.modelName|isValue}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">车辆类型:</el-col>
			<el-col :span="17">{{detailInfo.vehicleType|isValue}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">发动机号:</el-col>
			<el-col :span="17">{{detailInfo.engineCode|isValue}}</el-col>
		</el-row>
	</div>
</template>

<script>
	export default{
		props:{
			detailInfo:{}
		}
	}
</script>