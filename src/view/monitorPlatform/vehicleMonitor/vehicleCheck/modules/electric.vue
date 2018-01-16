<template>
	<div>
		<el-row class="item" :gutter="20">
			<el-col :span="6">油路状态:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.oilWayStatus|oilWayStatus}}</el-col>
			<el-col :span="6">车门状态:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.doorLockStatus|doorLockStatus}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">电路状态:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.circuitStatus|circuitStatus}}</el-col>
			<el-col :span="6">制动:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.brakeSignal|topCapStatus}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">近光:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.nearLightSignal|topCapStatus}}</el-col>
			<el-col :span="6">远光:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.beamSignal|topCapStatus}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">左转向:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.leftTurnSignal|topCapStatus}}</el-col>
			<el-col :span="6">右转向:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.rightTurnSignal|topCapStatus}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">倒档:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.reverseSignal|topCapStatus}}</el-col>
			<el-col :span="6">雾灯:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.fogSignal|topCapStatus}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">示廊灯:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.outlineMarkerLamps|topCapStatus}}</el-col>
			<el-col :span="6">喇叭:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.speakerSingnal|topCapStatus}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">空调:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.conditioningState|topCapStatus}}</el-col>
			<el-col :span="6">空档:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.neutralSignal|topCapStatus}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">缓速器:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.retarder|topCapStatus}}</el-col>
			<el-col :span="6">ABS:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.absWorking|topCapStatus}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">加热器:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.heater|topCapStatus}}</el-col>
			<el-col :span="6">离合器:</el-col>
			<el-col :span="6">{{$store.getters.carCurrent.clutchStatus|topCapStatus}}</el-col>
		</el-row>
	</div>
</template>

<script>
	export default{
		
	}
</script>