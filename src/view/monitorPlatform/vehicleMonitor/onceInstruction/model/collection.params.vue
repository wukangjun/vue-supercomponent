<template>
	<div>
		<li 
		class="instruction-item" 
		v-for="arr in arrays"
		:key='arr.name'
		v-instruction="{
			title: vehicle.plateCode,
			id: vehicle.id,
			name: arr.template, 
			direct: arr.direct, 
			url: arr.url, 
			params: {vehicleId:vehicle.id,enterpriseId:vehicle.enterpriseId,type:arr.type}}">
			<cv-icon :name="arr.icon" class="cv-instruction-icon" size="24"></cv-icon>
			<span class="cv-instruction-span">{{arr.name}}</span>
		</li>	
	</div>
</template>

<script>
	export default {
		props: {
			vehicle: {}
		},
		data(){
			return {
				arrays: [
					{icon: 'pdf', name: '采集执行版本',direct:true,url:'/grapherOrderSend/sendGrapherOrder',type: '00'},
					{icon: 'pdf', name: '驾驶人信息',direct:true,url:'/grapherOrderSend/sendGrapherOrder',type:"01"},
					{icon: 'pdf', name: '采集实时时间',direct:true,url:'/grapherOrderSend/sendGrapherOrder',type:"02"},
					{icon: 'pdf', name: '累计行驶里程',direct:true,url:'/grapherOrderSend/sendGrapherOrder',type:"03"},
					{icon: 'pdf', name: '采集脉冲系数',direct:true,url:'/grapherOrderSend/sendGrapherOrder',type:"04"},
					{icon: 'pdf', name: '采集车辆信息',direct:true,url:'/grapherOrderSend/sendGrapherOrder',type:"05"},
					{icon: 'pdf', name: '状态信号配置',direct:true,url:'/grapherOrderSend/sendGrapherOrder',type:"06"},
					{icon: 'pdf', name: '采集唯一编号',direct:true,url:'/grapherOrderSend/sendGrapherOrder',type:"07"}
				]
			}
		}

	}
</script>