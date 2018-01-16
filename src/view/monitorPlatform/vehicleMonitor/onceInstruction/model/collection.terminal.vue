<template>
	<div>
		<li 
		class="instruction-item" 
		v-for="arr in arrays"
		:key='arr.name'
		v-instruction="{
			title: arr.name,
			id: vehicle.id,
			enterpriseId: vehicle.enterpriseId,
			size: arr.size,
			name: arr.template, 
			direct: arr.direct, 
            url:arr.url,
            type:arr.type}">
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
					{icon: 'pdf', name: '无线升级',direct:false, template: 'remoteUpdata',size:'dialog-middle'},
					{icon: 'pdf', name: '连接指定服务器',direct:false, template: 'serverSet',size:'dialog-middle'},
					{icon: 'pdf', name: '终端关机',direct:false, template: 'sendMes',size:'dialog-tiny',url:'/sendOrder/terminalControl',type:'3'},
					{icon: 'pdf', name: '终端复位',direct:false, template: 'sendMes',size:'dialog-tiny',url:'/sendOrder/terminalControl',type:'4'},
					{icon: 'pdf', name: '恢复出厂设置',direct:false, template: 'sendMes',size:'dialog-tiny',url:'/sendOrder/terminalControl',type:'5'},
					{icon: 'pdf', name: '关闭数据通信',direct:false, template: 'sendMes',size:'dialog-tiny',url:'/sendOrder/terminalControl',type:'6'},
					{icon: 'pdf', name: '关闭所有无线通信',direct:false, template: 'sendMes',size:'dialog-tiny',url:'/sendOrder/terminalControl',type:'7'}
				]
			}
		}

	}
</script>
