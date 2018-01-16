<template>
	<div>
	<cv-header>
	   <el-form-item style="float:right">
	    <cv-tool
		style="margin: 0px"
		:name="$route.name"
		:data="$store.getters.monitorMenu"
		:is-search="false"
		:is-add="false"
		:is-modify="false"
		:is-remove="false"
		:is-export="false"
		:is-sendDelAll="true"
		:is-sendUpdate="true"
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
			ref="table"  @selection-change="handleSelectionChange">
			    <el-table-column type="selection" width="55"></el-table-column>
			    <el-table-column :label="$t('vehicleInfomation.plateCode')" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('vehicleInfomation.plateColor')" prop="plateColor" :show-overflow-tooltip="true" :formatter="plateColor"></el-table-column>
				<el-table-column :label="$t('vehicleInfomation.infoType')" prop="infoType" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('vehicleInfomation.infoTypeName')" prop="infoTypeName" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('vehicleInfomation.subscribe')" prop="isSend" :show-overflow-tooltip="true" :formatter="filterSubscribe"></el-table-column>
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
					name: 'search',
					search:{
					  vehicleId:''
					},
					selectVehicleObject: null
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
			vehicleInfomationList(vehicleId){
				let params = {
					current: this.grid.options.current,
					size: this.grid.options.size,
					vehicleId:vehicleId?vehicleId:this.dialog.search.vehicleId
				}
				this.grid.loading = true;
				this.$store.dispatch('getVehicleInformationPage', params).then(data =>{
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
				this.vehicleInfomationList();
			},
			filterSubscribe(row){
			   switch(row.subscribe){
					case 0:
					return this.$t("vehicleInfomation.unsubscribe");
					break
					case 1:
					return this.$t("vehicleInfomation.subscribed");
					break
					default:
					break
			    }
			},
			//删除几条数据
			remove(){
				 if(!this.dialog.selectVehicleObject){
			         this.$message.warning({ message: this.$t("vgPower.choseVehicle") });
					 return;
				 }
				 let ids=this.getSelectedIds().join(",");
				 let params = {
					vehicleId:this.dialog.selectVehicleObject.id,
					type:0,// 此参数不必传，后天接口决定
	                ids:ids
			     };
				 if(this.getSelectedCount()>0){
                     this.confirmPrompt().then(() => {
						this.$store.dispatch('deleteSomeVehicleInformationSettingsCmd', params).then(data => {
							// console.log(data);
							if (!data.flag && !!data.errorCode){
								this.$message.error({ message: this.$t("error."+data.errorCode)});
								//this.$notify.error({message: this.$t("error."+data.errorCode)});
							}else{
								this.load();
								this.$message.success({ message: this.$t("action.removeSuccess") })
								// this.$notify.success(this.$t('action.removeSuccess'));
							}
						})
					})
				 }else{
					 this.$message.warning({ message: this.$t("vehicleInfomation.alertToSelect") });
				 }
				
			},
			// 发送删除所有
			sendDelAll(){
        		 console.log(this.dialog.selectVehicleObject);
			     if(!this.dialog.selectVehicleObject){
			         this.$message.warning({ message: this.$t("vgPower.choseVehicle") });
					 return;
			     }
			     let params = {
					type:0,// 此参数不必传，后天接口决定
			        vehicleId:this.dialog.selectVehicleObject.id
			     };
			     this.confirmPrompt(this.$t("vehicleInfomation.confirmIsSendDelAll")).then(() => {
			        this.$store.dispatch('deleteAllVehicleInformationSettingsCmd', params).then(data => {
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
						name: 'vehicleInfoUpdate',
						title: this.dialog.selectVehicleObject.plateCode,
						id: this.dialog.selectVehicleObject.id,
						callback:this.load
					})
			    }
			},
            // 发送追加
			sendAdd(){
					if(!this.dialog.selectVehicleObject){
			        this.$message.warning({ message: this.$t("vgPower.choseVehicle") });
					return;
			    }else{
			    	this.$instruction({
						name: 'vehicleInfoAdd',
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
				let ids=this.getSelectedIds().join(",");
			    let params = {
			        vehicleId:this.dialog.selectVehicleObject.id,
					type:3,// 此参数不必传，后天接口决定
					ids: ids
			    };
				if(this.getSelectedCount()>0){
					 this.confirmPrompt(this.$t("vehicleInfomation.confirmIsSendEdit")).then(() => {
                        this.$store.dispatch('updateVehicleInformationSettingsCmd', params).then(data => {
							if (!data.flag && !!data.errorCode){
								this.$message.error({ message: this.$t("error."+data.errorCode) });
							}else{
								this.load();
								this.$message.success({ message: this.$t("action.orderSuccess")})
							}
						});
					 })
                    
				}else{
					this.$message.warning({ message: this.$t("eventInfo.alertToSelect") });
				}	     
			   
			},
			  //车牌过滤
			plateColor(vall){
				return this.$filter.plateCodeColor(vall.plateColor)
			}
		},
		watch: {
			'$store.getters.ptSingleCar'(newVal){
			    this.dialog.selectVehicleObject = newVal;
				console.log(this.dialog.selectVehicleObject.plateCode);
				this.dialog.search.vehicleId=this.dialog.selectVehicleObject.id;
				this.vehicleInfomationList(this.dialog.selectVehicleObject.id);
			 }
		},
		mounted(){
			this.vehicleInfomationList()
			
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

