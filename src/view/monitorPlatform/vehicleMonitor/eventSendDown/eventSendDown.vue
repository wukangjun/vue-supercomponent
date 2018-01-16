<template>
	<div>
		<cv-header>
			<el-form-item style="float:right">
				<cv-tool
					style="margin: 0px"
					:name="$route.name"
					:data="$store.getters.monitorMenu"
					:is-add="false"
					:is-modify="false"
					:is-remove="true"
					:is-export="false"
					:is-search="false"
					@remove="sendDel"
					@sendDelAll="sendDelAll"
					@sendUpdate="sendUpdate"
					@sendAdd="sendAdd"
					@sendEdit="sendEdit"
					></cv-tool>
			</el-form-item>
		</cv-header>
		<cv-content>
			<cv-grid :options="grid.options" @load="load(false)">
				<el-table 
				border stripe 
				:data="grid.table" 
				v-loading="grid.loading" 
				ref="table"   @selection-change="handleSelectionChange">
				    <el-table-column type="selection" width="55"></el-table-column>
					<el-table-column :label="$t('vehicleEventSend.plateCode')" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column :label="$t('vehicleEventSend.eventId')" prop="eventId" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column :label="$t('vehicleEventSend.eventContent')" prop="eventContent" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column :label="$t('vehicleEventSend.createtimeStr')" prop="createtimeStr" :show-overflow-tooltip="true"></el-table-column>
				</el-table>
			</cv-grid>
		</cv-content>
		<!-- 一级弹框 -->
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="load(true)"></component>
		</el-dialog>
	</div>
</template>

<script>
	import common from '@/utils/mixins/common'
	export default{
		mixins:[common],
		data(){
			return{
				grid: {
					options:{
						current: 1,
						size: 10,
						total:0,
						flag:false
					},
					table: [],
					loading: false,
					selectedData: []
				},
				dialog: {
					flag: false,
					title: '--',
					size: 'dialog-tiny',
					selectVehicleObject: null,
					name: 'search',
					search: {
						vehicleId:''
					}
				},
				multipleSelection: []
			}
		},
		methods: {
		    toggleSelection(rows) {
				if (rows) {
				  rows.forEach(row => {
				    this.$refs.multipleTable.toggleRowSelection(row);
				  });
				} else {
				  this.$refs.multipleTable.clearSelection();
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			getSelectedCount(){
			      return this.multipleSelection.length
			},
			getSelectedIds(){
			      let ids=[];
			      this.multipleSelection.map((item)=> {
				    ids.push(item.id);
			      })
			      return ids;
			},
			searchDataList(vehicleId){
				let params = {
					current: this.grid.options.current,
					size: this.grid.options.size,
					vehicleId:vehicleId?vehicleId:this.dialog.search.vehicleId
				}
				this.grid.loading = true;
				this.$store.dispatch('getVehicleEventPage', params).then(data =>{
					if(data.flag && data.data.length!=0){
						this.grid.table = data.data.records;
						this.grid.options.total = data.data.total;
					}else{
						this.grid.table =[];
						this.grid.options.total =0;
					}
					this.grid.loading = false;
					
				}).catch(error=>{
                    this.grid.loading = false;
                })
			},
			load(flag) {
				if(flag){
					this.grid.options.flag = true;
					this.grid.options.current = 1;
				}else{
					this.grid.options.flag = false;
				}
				this.searchDataList()
			},
			// 发送删除所有
			sendDelAll(){
			     if(!this.dialog.selectVehicleObject){
			         this.$message.warning({ message: this.$t("vgPower.choseVehicle") });
					 return;
			     }
			     let params = {
			        vehicleId:this.dialog.selectVehicleObject.id,
				    type:0,
					ids: this.getSelectedIds().join(',')
			     };
			     this.confirmPrompt(this.$t("vehicleEventSend.confirmIsSendDelAll")).then(() => {
			        this.$store.dispatch('sendVehicleEventCmd', params).then(data => {
				        if (!data.flag && !!data.errorCode){
					        this.$message.error({ message: this.$t("error."+data.errorCode) });
					}else{
						this.load();
						this.$message.success({ message: this.$t("action.orderSuccess") })
					}
				})
			     })
			},
            // 发送更新
			sendUpdate(){
			    if(!this.dialog.selectVehicleObject){
			        this.$message.warning({ message: this.$t("vgPower.choseVehicle") });
				 	return;
			    }else{
					this.$instruction({
						name: 'eventUpdate',
						title: this.dialog.selectVehicleObject.plateCode,
						id: this.dialog.selectVehicleObject.id,
						callback:this.load
					})
			    }
			    
			},
            // 发送追加==弹出框添加IDS
			sendAdd(){
				if(!this.dialog.selectVehicleObject){
			        this.$message.warning({ message: this.$t("vgPower.choseVehicle") });
					return;
			    }else{
			    	this.$instruction({
						name: 'eventAdd',
						title: this.dialog.selectVehicleObject.plateCode,
						id: this.dialog.selectVehicleObject.id,
						callback:this.load
					})
			    }
			    
			},
            // 发送修改
			sendEdit(){
				 if(!this.dialog.selectVehicleObject){
			         this.$message.warning({ message: this.$t("vgPower.choseVehicle") });
					 return;
			     }
			    let params = {
			        vehicleId:this.dialog.selectVehicleObject.id,
					type:3,
					ids: this.getSelectedIds().join(',')
			    };
				console.log("ids:"+params.ids);
				if(this.getSelectedCount()>0){
					 this.confirmPrompt(this.$t("vehicleEventSend.confirmIsSendEdit")).then(() => {
						this.$store.dispatch('sendVehicleEventCmd', params).then(data => {
							if (!data.flag && !!data.errorCode){
								this.$message.error({ message: this.$t("error."+data.errorCode) });
							}else{
								this.load();
								this.$message.success({ message: this.$t("action.orderSuccess")})
							}
						});
					 });
				}else{
					this.$message.warning({ message: this.$t("vehicleEventSend.alertToSelect") });
				}	     
			   
			},
			// 发送删除特定的几项
			sendDel(){
        		 console.log(this.dialog.selectVehicleObject);
			     if(!this.dialog.selectVehicleObject){
			         this.$message.warning({ message: this.$t("vgPower.choseVehicle") });
					 return;
			     }
			     let params = {
			        vehicleId:this.dialog.selectVehicleObject.id,
				    type:4,
					ids: this.getSelectedIds().join(',')
			     };
				 console.log("ids:"+params.ids);
				 if(this.getSelectedCount()>0){
					this.confirmPrompt(this.$t("vehicleEventSend.confirmIsSendDel")).then(() => {
						this.$store.dispatch('sendVehicleEventCmd', params).then(data => {
							if (!data.flag && !!data.errorCode){
									this.$message.error({ message: this.$t("error."+data.errorCode) });
							}else{
								this.load();
								this.$message.success({ message: this.$t("action.orderSuccess") })
							}
						})
					})
				 }else{
					 this.$message.warning({ message: this.$t("vehicleEventSend.alertToSelect") });
				 }
			    
			},
		},
		watch: {
			'$store.getters.ptSingleCar'(newVal){
			    this.dialog.selectVehicleObject = newVal;
				this.dialog.search.vehicleId=this.dialog.selectVehicleObject.id;
				this.searchDataList(this.dialog.selectVehicleObject.id);
			 }
		},
		mounted(){
			this.searchDataList();
			
		},
		beforeDestroy(){
			this.$instruction({}).close();
		}
	}
</script>
<style lang="scss">
	.table-expand{
		.el-form-item{
			margin-bottom: 0;
			.el-form-item__label{
				font-size: 12px;
				color: #99a9bf;
			}
			.el-form-item__content{
				vertical-align: initial
			}
		}
	}
</style>

