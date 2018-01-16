<template>
	<div>
		<cv-grid :options="grid" @load="load(false)">
			<el-table 
			border stripe 
			ref="table"  
			:data="table" 
			v-loading="tableflag"
			@selection-change="handleSelectionChange">
			    <el-table-column type="selection" width="55"></el-table-column>
				<el-table-column :label="$t('vehicleEventSend.eventId')" prop="id" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('vehicleEventSend.eventContent')" prop="eventinfo" :show-overflow-tooltip="true"></el-table-column>
			</el-table>
		</cv-grid>
		<div class="dialog-footer" style="margin-top: 50px">
			<el-button type="primary" :loading="orderflag"  @click="confirm">
				{{$t('action.save')}}
			</el-button>
			<el-button  @click="options.flag=false">{{$t('action.cancel')}}</el-button>
		</div>
	</div>
</template>

<script>
	import { getEventInfoPage } from '../../src/instruction.other.api'
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
				// 勾选的事件id集合
				ids: []
			}
		},
		methods: {
			handleSelectionChange(val){
				this.ids = [];
				val.forEach(context => {
					this.ids.push(context.id);
				});
			},
			async confirm(){
				if(this.ids.length > 0){
					this.orderflag = true;
					const {data, flag} = await publicApi({
						url: '/sendOrder/sendVehicleEventCmd',
						params: {
							type: 1,
							vehicleId: this.options.id,
							ids: this.ids.join(',')
						}
					});
					this.orderflag = false;
					if(flag){
						this.options.flag = false;
						this.$message.success({ message: this.$t("action.orderSuccess") })
					}else{
						 this.$message.error({ message: this.$t("error."+data.errorCode) });
					}
					typeof this.options.callback === 'function' && this.options.callback(flag);
				}else{
					this.$message.warning({message:this.$t("vehicleEventSend.atleastOnBeSelected")});
				}
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
				const {data, flag} = await getEventInfoPage(params);
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