<template>
	<el-input 
	size="small" 
	placeholder="请选择下方车辆" 
	:style="{width: width+'px'}"
	:readonly="true"
	v-model="content"></el-input>
</template>

<script>
	export default{
		name: 'cvShowVehicle',
		props: {
			width: {
				default: 120
			}
		},
		computed:{
			content(){
				if(this.$store.getters.ptMultiCar.length){
					// 多车
					let array = [];
					this.$store.getters.ptMultiCar.forEach(val => {
						array.push(val.plateCode);
					});
					return array.join(',');
				}else{
					return this.$store.getters.ptSingleCar.plateCode
				}
			}
		}
	}
</script>
