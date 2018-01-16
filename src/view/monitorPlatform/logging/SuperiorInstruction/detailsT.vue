
<template>
    <el-row :gutter="20" >
        <el-col :span="24" class="main">
        <label>通信类型:</label>
       <span>{{options.conntype}}</span>
        </el-col>
	     <el-col :span="24" class="main">
        <label>通信时间:</label>
       <span>{{options.comTime}}</span>
        </el-col>
		<el-col :span="24" class="main">
        <label>通信内容:</label>
       <span>{{options.connmsg}}</span>
        </el-col>
			<div class="dialog-footer">
			<!-- <el-button type="primary">{{$t('msg.confirm')}}</el-button> -->
			<el-button @click="options.flag=false" type="primary">{{'取消'}}</el-button>
		</div>
    </el-row>
	
</template>
<script>
import port from './index.js'
	export default{
		mixins: [port],
		props:{
			options:{

			}
		},
		data(){
			return{
			
			}
		},
		methods: {	
		
		},
		watch: {
		}
	}
</script>
<style lang='scss' scoped>
.main{
	margin-bottom:10px;
}
</style>