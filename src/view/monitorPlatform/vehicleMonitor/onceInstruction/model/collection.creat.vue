<template>
	<div>
		<li 
		class="instruction-item" 
		v-for="arr in arrays"
		:key="arr.name"
		v-instruction="{
			title: arr.name,
			id: vehicle.id,
			enterpriseId: vehicle.enterpriseId,
			size: arr.size,
			router:arr.routerUrl,
			name: arr.template, 
			direct: arr.direct, 
			url: arr.url, 
			params:{vehicleId:vehicle.id,enterpriseId:vehicle.enterpriseId,type:arr.type,command:arr.command}}">
			<cv-icon :name="arr.icon" class="cv-instruction-icon" size="24"></cv-icon>
			<span class="cv-instruction-span">{{arr.name}}</span>
		</li>	
	</div>
</template>

<script>
	export default {
		props: {
			vehicle:{}
		},
		data(){
			return {
				arrays: [
					{icon: 'jiankong1', name: '设置车辆信息', template: 'setVehiclemessage',size:'dialog-small'},
					{icon: 'renyuanjiankong', name: '设置安装日期', template: 'setInstalldate',size:'dialog-tiny'},
					{icon: 'yuyan2', name: '配置状态量', template: 'configStatus',size:'dialog-small'},
					{icon: 'monitor1', name: '设置时间', template: 'setTimer',size:'dialog-tiny'},
					{icon: 'rizhiguanli', name: '设置脉冲系数', template: 'setPulse',size:'dialog-small'},
					{icon: 'jiesuo1', name: '设置初始里程', template: 'setInitmileage',size:'dialog-tiny'},
					{icon: 'yunwei1', name: '实时时钟', direct: true,url:'/grapherOrderSend/sendGatherMsg',command:'采集记录仪的实时时钟',type:'02'},
					{icon: 'yunwei1', name: '当前驾驶员', direct: true,url:'/grapherOrderSend/sendGatherMsg',command:'采集当前驾驶人',type:'01'}		
				]
			}
		},
		methods: {
			ok(){
				console.log(this.vehicle)
			}
		}
		// mounted(){
		// 	console.log(this.vehicle+'---------')
		// }
	}
</script>

