<template>
	<div>
		<cv-grid :options="grid" @load="load(false)">
			<el-table 
			border stripe 
			ref="table"  
			:data="table" 
			highlight-current-row
			v-loading="tableflag"
			@current-change="handleCurrentChange">
			    <el-table-column  type="index" width="55"></el-table-column>
				<el-table-column :label="$t('protocolGroup.protocolName')" prop="protocolName" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('protocolGroup.remark')" prop="remark" :show-overflow-tooltip="true"></el-table-column>
			</el-table>
		</cv-grid>
		<div class="dialog-footer" style="margin-top: 50px">
			<el-button type="primary" :loading="orderflag"  @click="confirm">
				{{$t('action.confirm')}}
			</el-button>
			<el-button    @click="reset">{{$t('action.reset')}}</el-button>
			<el-button  @click="options.flag=false">{{$t('action.cancel')}}</el-button>
		</div>
	</div>
</template>

<script>
	import { getProtocolTransferGroupPage } from '../../src/instruction.other.api'
	import { publicApi } from '../../src/instruction.public.api'
	export default {
		props: {
			options: {}
		},
		data(){
			return{
				grid: {
					current: 1,
					size: 10,
					total:0,
					flag:false
				},
				tableflag: false,
				orderflag: false,
				table: [],
				// 表格行选择值
				id:'',
				name:''
			}
		},
		methods: {
			handleCurrentChange(val){
			    this.id=val.id;
				this.name=val.remark;//分组名称
			},
			async confirm(){
				if(!this.id){
					this.$message.warning({message:this.$t("protocolGroup.pleaseSelectGroup")});
				}else{
					this.options.transferGroupId=this.id;
					this.options.transferGroupName=this.name;
					console.log('group id is :'+this.options.transferGroupId);

					this.options.flag=false;// 关闭当前窗口
					
					typeof this.options.callback === 'function' && this.options.callback(this.options)

				}
			},
			async reset(){
				this.options.transferGroupId='';
				this.options.transferGroupName='';
				this.options.flag=false;// 关闭当前窗口
				typeof this.options.callback === 'function' && this.options.callback(this.options)
			},
			// 表格加载
			async load(isRepeat){
				// 重新加载分页
				if(isRepeat){
					this.grid.flag = true;
					this.grid.current = 1;
				}else{
					this.grid.flag = false;
				};				
				const params = {
					current: this.grid.current,
					size: this.grid.size
				};
				this.tableflag = true;
				const {data, flag} = await getProtocolTransferGroupPage(params);
				this.tableflag = false;
				if(flag && data.length != 0 ){
					this.table = data.records;
					this.grid.total = data.total;
				}else{
					this.table = [];
					this.grid.total = 0;
				}
			}
		},
		mounted(){
			this.load();
		}
	}
</script>