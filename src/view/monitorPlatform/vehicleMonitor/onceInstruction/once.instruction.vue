<template>
	<div class="cv-instruction-group">
		<cv-header>
			<el-form-item>
				<cv-span>{{vehicle.plateCode || '--'}}</cv-span>
			</el-form-item>
		</cv-header>
		<cv-content>
			<el-collapse v-model="activeName">
				<el-collapse-item title="采集设备中参数" name="1">
					<collection-params :vehicle="vehicle"></collection-params>
				</el-collapse-item>
				<el-collapse-item title="采集设备中记录" name="2">
					<collection-record :vehicle="vehicle"></collection-record>
				</el-collapse-item>
				<el-collapse-item title="设置记录仪参数" name="3">
				<collection-creat :vehicle="vehicle"></collection-creat>	
				</el-collapse-item>
				<el-collapse-item title="即时指令下发" name="4">
					<once-instruction :vehicle="vehicle"></once-instruction>
				</el-collapse-item>
				<el-collapse-item title="终端远程控制" name="5">
					<collection-terminal :vehicle="vehicle"></collection-terminal>
				</el-collapse-item>
			</el-collapse>
		</cv-content>
	</div>
</template>
<script>
	import collectionCreat from './model/collection.creat.vue'
	import collectionParams from './model/collection.params.vue'
	import onceInstruction from './model/once.instruction.vue'
	import collectionRecord from './model/collection.record.vue'	
	import collectionTerminal from './model/collection.terminal.vue'
	export default {
		components: {
			collectionCreat,
			collectionParams,
			onceInstruction,
			collectionRecord,
			collectionTerminal
		},
		data(){
			return {
				vehicle: {},
				activeName: ["1", "2", "3", "4","5"]
			}
		},
		methods: {
			hello(){
				
			}
		},
		watch: {
			'$store.getters.ptSingleCar'(newVal){
				this.vehicle = newVal;
			}
		}
	}
</script>

<style lang="scss">
	.cv-instruction-group{
		.instruction-item{
			cursor: pointer;
			display: inline-block;
			text-align: center;
			padding: 4px 6px;
			border-radius: 4px;
			margin: 0 5px;
			&:hover{
				background: #20a0ff;
				color: #fff;
			}
			.cv-instruction-icon{
				display: block;
			}
			.cv-instruction-span{
				display: block;
			}
		}
	}
</style>