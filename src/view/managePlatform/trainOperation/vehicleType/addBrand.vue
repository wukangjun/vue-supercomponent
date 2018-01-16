<template>
	<el-row class="container">
		<el-col :span='24'>
			<el-form :inline="true">
				<el-form-item label="车厂名称:">
					<el-input></el-input>
				</el-form-item>
				<el-form-item label="公司名称:">
					<el-input></el-input>
				</el-form-item>
				<el-form-item label="所属企业">
					<el-input></el-input>
				</el-form-item>
			</el-form>
		</el-col>
		<el-col :span="24" class="dialog-footer">
			<el-button type="primary">{{$t('msg.save')}}</el-button>
			<el-button @click="options.flag=false">{{$t('msg.cancel')}}</el-button>
		</el-col>
	</el-row>
</template>
<script>
	export default{
		props: {
			options: {}
		}
	}
</script>