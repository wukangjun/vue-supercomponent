<template>
	<div>
		<el-row class="item" :gutter="20">
			<el-col :span="6">ACC状态:</el-col>
			<el-col :span="17">{{detailInfo.accStatus|accStatus|isValue}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">转速:</el-col>
			<el-col :span="17">{{detailInfo.can1|isValue('rpm')}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">油门:</el-col>
			<el-col :span="17">{{detailInfo.can2|isValue('%')}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">扭矩:</el-col>
			<el-col :span="17">{{detailInfo.can3|isValue('%')}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">水温:</el-col>
			<el-col :span="17">{{detailInfo.can4|isValue('℃')}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">机油压力:</el-col>
			<el-col :span="17">{{detailInfo.can4|isValue('kPa')}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">电瓶电压:</el-col>
			<el-col :span="17">{{detailInfo.can5|isValue('V')}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20">
			<el-col :span="6">燃油液位:</el-col>
			<el-col :span="17">{{detailInfo.can6|isValue('%')}}</el-col>
		</el-row>
	</div>
</template>

<script>
	export default{
		props:{
			detailInfo:{}
        },
        watch:{
            detailInfo(newVal){
                // console.log(newVal)
            }
        }
	}
</script>