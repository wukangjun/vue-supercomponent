<template>
	<div>
		<el-row class="item" :gutter="20">
			<el-col :span="6">上报时间:</el-col>
			<el-col :span="17">
				{{$store.getters.carCurrent.gpsTime | format('yyyy-MM-dd HH:mm:ss')|isValue}}
			</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">GPS速度:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.gpsSpeed | isValue('km/h')}}</el-col>
			<el-col :span="6">行驶速度:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.dspeed | isValue('km/h')}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">方向:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.directionText|direction|isValue}}</el-col>
			<el-col :span="6">海拔:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.height|isValue('m')}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">经度:</el-col>
			<el-col :span="17">{{$store.getters.carCurrent.mapLongitude|toFixed(6)|isValue}}</el-col>			
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">纬度:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.mapLatitude|toFixed(6)|isValue}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">当前报警:</el-col>
			<el-col :span="17">{{$store.getters.carCurrent.alarmCount|isValue}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">报警信息:</el-col>
			<el-col :span="17">{{$store.getters.carCurrent.alarmShortInfo|isValue}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">地理位置:</el-col>
			<el-col :span="17">{{$store.getters.carCurrent.locationDesc|isValue}}</el-col>
		</el-row>
	</div>
</template>

<script>
	export default{
	}
</script>
