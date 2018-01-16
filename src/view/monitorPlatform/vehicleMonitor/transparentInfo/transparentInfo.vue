<template>
	<div>
	<cv-header>
	   <el-form-item style="float:right">
	    <cv-tool
		style="margin: 0px"
		:name="$route.name"
		:data="$store.getters.monitorMenu"
		:is-add="false"
		:is-search="false"
		:is-modify="false"
		:is-remove="false"
		:is-export="false"
		:is-sendDown="true"
		@sendDown="sendDown"
		></cv-tool>
	    </el-form-item>
	</cv-header>
	<cv-content>
		<cv-grid :options="grid.options" @load="load(false)">
			<el-table 
			border stripe 
			:data="grid.table" 
			v-loading="loading" 
			ref="table" >
			    <el-table-column :label="$t('transparentInfoSend.plateCode')" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('transparentInfoSend.plateColor')" prop="plateColor" :show-overflow-tooltip="true" :formatter="filterColor"></el-table-column>
				<el-table-column :label="$t('transparentInfoSend.type')" prop="type" :show-overflow-tooltip="true" :formatter="filterType"></el-table-column>
				<el-table-column :label="$t('transparentInfoSend.data')" prop="dataStr" :show-overflow-tooltip="true"></el-table-column>
			</el-table>
		</cv-grid>
	   </cv-content>
		<!-- 一级弹框 -->
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="load"></component>
		</el-dialog>
	</div>
</template>

<script>
	import sendDown from './sendDown.vue'
	import common from '@/utils/mixins/common'
	export default{
		components: {
			sendDown
		},
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
				},
				loading: false,
				dialog: {
					flag: false,
					title: '--',
					size: 'dialog-tiny',
					name: 'search'
				},
				search:{
					vehicleId:'',
					plateCode:'',
					enterpriseId:''
				}
			}
		},
		methods: {
			transparentInfoSendList(vehicleId){
				let params = {
					current: this.grid.options.current,
					size: this.grid.options.size,
					vehicleId:this.search.vehicleId
				}
				this.$store.dispatch('getTransparentinfoSendlogPage', params).then(data =>{
					if(data.flag && data.data.length!=0){
						this.grid.table = data.data.records;
						this.grid.options.total = data.data.total;
					}else{
						this.grid.table =[];
						this.grid.options.total =0;
					}
					this.loading = false;
				}).catch(error=>{
                    this.loading = false;
				});			
			},
			load(flag) {
				if(flag){
					this.grid.options.flag = true;
					this.grid.options.current = 1;
				}else{
					this.grid.options.flag = false;
				}
				this.loading = true;
				setTimeout(_=>{
					this.transparentInfoSendList();
				},2000)
			},
			filterColor(row){
				return this.$filter.plateCodeColor(row.plateColor);
			},
			filterType(row){
			   switch(row.type){
					case 0:
						return this.$t("transparentInfoSend.gnssModelDetailData");
						break;
					case 11:
						return this.$t("transparentInfoSend.roadTransICCardInfo");
						break;
					case 65:
						return this.$t("transparentInfoSend.serialCom1");
						break;
					case 66:
						return this.$t("transparentInfoSend.serialCom2");
						break;
					case 245:
						return this.$t("transparentInfoSend.selfDefined245");
						break;
					case -1:
						return this.$t("transparentInfoSend.userSelfDefined");
						break;
					default:
						break;
			    }
			},
			//打开发送框
			sendDown(){
				 if(this.search.vehicleId){
					this.dialog.flag = true;
					this.dialog.title = this.$t('power.sendDown');
					this.dialog.name = 'sendDown';
					this.dialog.size = 'dialog-tiny';
					this.dialog.id=this.search.vehicleId;
					this.dialog.enterpriseId=this.search.enterpriseId;
				 }else{
					  this.$message.warning({ message: this.$t("transparentInfoSend.alertToSelectVehicle") });
				 }
				
			}
		},
		watch: {
			'$store.getters.ptSingleCar'(newVal){
				this.search.vehicleId=newVal.id;
				this.search.plateCode=newVal.plateCode;
				this.search.enterpriseId=newVal.enterpriseId;
				this.load();
			 }
		},
		mounted(){
			
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

