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
			params:{vehicleId:vehicle.id,enterpriseId:vehicle.enterpriseId}}">
			<cv-icon :name="arr.icon" class="cv-instruction-icon" size="24"></cv-icon>
			<span class="cv-instruction-span">{{arr.name}}</span>
		</li>
		<li class="instruction-item" @click="routerUrl">
			<cv-icon name="pdf" class="cv-instruction-icon" size="24"></cv-icon>
			<span class="cv-instruction-span">查询终端参数</span>
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
					{icon: 'jiankong1', name: '监听', template: 'monitor'},
					{icon: 'renyuanjiankong', name: '拍照指令下发', template: 'photo',size:'dialog-middle'},
					{icon: 'yuyan2', name: '录音', template: 'record'},
					{icon: 'monitor1', name: '视频', template: 'videos'},
					{icon: 'rizhiguanli', name: '文本下发', template: 'textIssue'},
					{icon: 'jiesuo1', name: '锁车', template: 'lockcar',size:'dialog-tiny'},
					{icon: 'yuyan1', name: '媒体上传', template: 'mediaUpload',size:'dialog-small'},
					{icon: 'dunpai1', name: '媒体检索', template: 'mediaSearch',size:'dialog-small'},
					{icon: 'shijian1', name: '北斗查询终端属性', direct:true,url:'/sendOrder/terminalProperty'},
					{icon: 'yunwei1', name: '北斗上报驾驶员身份信息', direct: true,url:'/sendOrder/driverInfo'}
				]
			}
		},
		methods:{
			routerUrl(){
				if(this.vehicle.id){
					this.$router.push('/monitor/terminalParamSet' + '?id='+this.vehicle.id);
				}else{
					this.$message.warning('请选择车辆');
				}
			}
		}
	}
</script>