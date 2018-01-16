<template>
	<div>
		<el-row class="item" :gutter="20">
			<el-col :span="6">上报时间:</el-col>
			<el-col :span="17">
				{{basicInfo.gpsTime | format('yyyy-MM-dd HH:mm:ss')|isValue}}
			</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">速度:</el-col>
			<el-col :style="{'color':basicInfo.locateStatus == 1?'#000':'red'}" :span="6">{{(basicInfo.dspeed == "0.0"?basicInfo.gpsSpeed =='0.0'?'':basicInfo.gpsSpeed:basicInfo.dspeed) | isValue('km/h')}}</el-col>
			<el-col :span="6">总里程:</el-col>
			<el-col :span="6">{{basicInfo.mileage | isValue('km')}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">方向:</el-col>
			<el-col :span="6">{{basicInfo.directionText|direction|isValue}}</el-col>
			<el-col :span="6">海拔:</el-col>
			<el-col :span="6">{{basicInfo.height|isValue('m')}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">经度:</el-col>
			<el-col :span="6">{{basicInfo.mapLongitude|toFixed(6)|isValue}}</el-col>	
			<el-col :span="6">纬度:</el-col>		
			<el-col :span="6">{{basicInfo.mapLatitude|toFixed(6)|isValue}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">当前报警:</el-col>
			<el-col :span="17">{{basicInfo.alarmCount|isValue}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">报警信息:</el-col>
			<el-col :span="17">{{basicInfo.alarmShortInfo|isValue}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">地理位置:</el-col>
			<el-col :span="17">{{basicInfo.locationDesc|isValue}}</el-col>
		</el-row>
	</div>
</template>

<script>
	export default{
		props:{
			basicInfo:{}
		}
	}
</script>
