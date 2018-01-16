<template>
	<div>		
		<el-row class="item" :gutter="20">
			<el-col :span="6">油量:</el-col>
			<el-col :span="17">{{detailInfo.oil|isValue('L')}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20" 
		v-show="$filter.abillityIds(detailInfo.abillityIds,5)">
			<el-col :span="6">举升状态:</el-col>
			<el-col :span="17">{{detailInfo.artificialLiftStatus|artificialLiftStatus}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20"
		v-show="$filter.abillityIds(detailInfo.abillityIds,2)">
			<el-col :span="6">承重状态:</el-col>
			<el-col :span="17">{{detailInfo.bearing|isValue|bearing}}</el-col>
		</el-row>
		<el-row class="item" :gutter="20"
		v-show="$filter.abillityIds(detailInfo.abillityIds,4)">
			<el-col :span="6">顶盖:</el-col>
			<el-col :span="17">{{detailInfo.topCapStatus|topCapStatus}}</el-col>
		</el-row>
	</div>
</template>

<script>
export default {
  props: {
    detailInfo: {}
  }
};
</script>