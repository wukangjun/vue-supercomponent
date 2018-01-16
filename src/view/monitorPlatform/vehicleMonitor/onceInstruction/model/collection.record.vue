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
			name: arr.template, 
			direct: arr.direct, 
			callback: ok,
			url: arr.url, 
			params: arr.params}">
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
					{icon: 'jiankong1', name: '行驶速度记录', template: 'driverRecord',size:'dialog-tiny'},
					{icon: 'renyuanjiankong', name: '位置信息记录', template: 'locationMessage',size:'dialog-tiny'},
					{icon: 'yuyan2', name: '事故疑点记录', template: 'eventDoubtful',size:'dialog-tiny'},
					{icon: 'monitor1', name: '超时驾驶记录', template: 'overtimeDrive',size:'dialog-tiny'},
					{icon: 'rizhiguanli', name: '驾驶人身份记录', template: 'driverIdentity',size:'dialog-tiny'},
					{icon: 'jiesuo1', name: '外部供电记录', template: 'externalPower',size:'dialog-tiny'},
					{icon: 'yuyan1', name: '参数修改记录', template: 'paramsModify',size:'dialog-tiny'},
					{icon: 'dunpai1', name: '速度状态日志', template: 'speedStatus',size:'dialog-tiny'}
				]
			}
		},
		methods: {
			ok(){
				console.log('HHHHHH')
			}
		}
	}
</script>