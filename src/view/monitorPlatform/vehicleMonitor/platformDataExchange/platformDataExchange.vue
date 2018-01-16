<template>
	<div>
		<cv-header>
			<el-form-item :label="$t('platformDataExchange.plateCode')">
	            <el-input v-model.trim="search.plateCode" size="small" :maxlength='500'></el-input>
			</el-form-item>

			<el-form-item :label="$t('platformDataExchange.transferGroupShowName')">
	            <el-input v-model.trim="search.transferGroupName" size="small" :maxlength='500' v-on:focus="openGroupPage" ></el-input>
			</el-form-item>

            <el-form-item :label="$t('platformDataExchange.orderShowName')">
			 <el-select v-model="search.orderType"  size="small">
					<el-option :label="$t('platformDataExchange.pleaseToSelect')" value=""></el-option>
					<el-option :label="$t('platformDataExchange.ordertypeSelectOpt1')" value="1"></el-option>
					<el-option :label="$t('platformDataExchange.ordertypeSelectOpt2')" value="2"></el-option>
					<el-option :label="$t('platformDataExchange.ordertypeSelectOpt3')" value="0"></el-option>
				</el-select>
            </el-form-item>

			<el-form-item style="float:right">
				<cv-tool
					style="margin: 0px"
					:name="$route.name"
					:data="$store.getters.monitorMenu"
					:is-add="false"
					:is-modify="false"
					:is-remove="false"
					:is-export="false"
					:is-search="true"
					:is-send="true"
					@search="switchSearch"
					@send="send"
					></cv-tool>
			</el-form-item>
		</cv-header>
		<cv-content :fill='true'>
         <el-tabs v-model="activeName" @tab-click="handleClick">

		   <el-tab-pane :label="$t('platformDataExchange.header1')" name="first">
				<cv-grid :options="grid.options" @load="searchTabFirst(false)">
					<el-table 
					border stripe 
					:data="grid.table" 
					highlight-current-row
					v-loading="grid.loading" 
					ref="table" @current-change="handleCurrentChange">
					    <el-table-column  type="index" width="55"></el-table-column>
						<el-table-column :label="$t('platformDataExchange.plateCode')" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('platformDataExchange.plateColor')" prop="plateColor" :formatter="plateColor" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('platformDataExchange.transferGroupName')" prop="transferGroupName" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('platformDataExchange.vehicleType')" prop="vehicleType" :formatter="superPlatformCarType"  :show-overflow-tooltip="true"></el-table-column>
					</el-table>
				</cv-grid>
			</el-tab-pane>

			 <el-tab-pane :label="$t('platformDataExchange.header2')" name="second">
				<cv-grid :options="grid.options" @load="searchTabSecond(false)">
					<el-table 
					border stripe 
					:data="grid.table" 
					highlight-current-row
					v-loading="grid.loading" 
					ref="table"  @current-change="handleCurrentChange">
					    <el-table-column  type="index" width="55"></el-table-column>
						<el-table-column :label="$t('platformDataExchange.plateCode')" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('platformDataExchange.plateColor')" prop="plateColor" :formatter="plateColor" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('platformDataExchange.transferGroupName')" prop="transferGroupName" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('platformDataExchange.vehicleType')" prop="vehicleType" :formatter="superPlatformCarType"  :show-overflow-tooltip="true"></el-table-column>
					</el-table>
				</cv-grid>
			</el-tab-pane>

			 <el-tab-pane :label="$t('platformDataExchange.header3')" name="third">
				<cv-grid :options="grid.options" @load="searchTabThird(false)">
					<el-table 
					border stripe 
					:data="grid.table" 
					highlight-current-row
					v-loading="grid.loading" 
					ref="table" @current-change="handleCurrentChange">
					    <el-table-column  type="index" width="55"></el-table-column>
						<el-table-column :label="$t('platformDataExchange.plateCode')" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('platformDataExchange.plateColor')" prop="plateColor" :formatter="plateColor" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('platformDataExchange.transferGroupName')" prop="transferGroupName" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column :label="$t('platformDataExchange.vehicleType')" prop="vehicleType" :formatter="superPlatformCarType" :show-overflow-tooltip="true"></el-table-column>
					</el-table>
				</cv-grid>
			</el-tab-pane>
		  </el-tabs>
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
		props: {
			options: {}
		},
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
					title: "--",
					size: "dialog-tiny",
					name: "search"
		        },
				search: {
					vehicleId:'',
					plateCode:'',
					transferGroupId:'',
					transferGroupName:'',
					orderType:''
				},
				order:{
					vehicleId:'',
					transferGroupId:'',
					vehicleType:''
				},
				multipleSelection: [],
				activeName:'first'
			}
		},
		methods: {
			// 指令发送选择行
			handleCurrentChange(val){
				if(val){
					this.order.vehicleId=val.vehicleId;
					this.order.vehicleType=val.vehicleType;
					this.order.transferGroupId=val.transferGroupId;
				}
				
			},
			// 清除选择的车辆数据
			clearSelectVehicleData(){
  				this.order.vehicleId='';
				this.order.transferGroupId='';
				this.order.vehicleType='';
			},
			// tab切换操作查询
			switchSearch(){
				if(!this.handleClickName){
                    this.handleClickName=this.activeName;
				}
				console.log('enter switchSearch function...');
				if(this.handleClickName == "first"){
					this.searchTabFirst(true);
				}
				if(this.handleClickName == "second"){
					this.searchTabSecond(true);
				}
				if(this.handleClickName == "third"){
					this.searchTabThird(true);
				}
			},
			handleClick(tab, event){
				this.handleClickName = tab.name
				if(tab.name == 'first' ){
					this.searchTabFirst();
				}
				if( tab.name == 'second'){
					this.searchTabSecond();
				}
				if( tab.name == 'third'){
					this.searchTabThird();
				}
			},
			// 查询数据1
			searchTabFirst(flag){
				this.clearSelectVehicleData();
				if(flag){
					this.grid.options.flag = true;
					this.grid.options.current = 1;
				}else{
					this.grid.options.flag = false;
				}
				let params = {
					current: this.grid.options.current,
					size: this.grid.options.size,
					plateCode:this.search.plateCode,
					transferGroupId:this.search.transferGroupId
				}
				this.grid.loading = true;
				this.$store.dispatch('getProtocolTransferVehiclePage', params).then(data =>{
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
			// 查询数据2
			searchTabSecond(flag){
				this.clearSelectVehicleData();
				if(flag){
					this.grid.options.flag = true;
					this.grid.options.current = 1;
				}else{
					this.grid.options.flag = false;
				}
				let params = {
					current: this.grid.options.current,
					size: this.grid.options.size,
					plateCode:this.search.plateCode,
					transferGroupId:this.search.transferGroupId
				}
				this.grid.loading = true;
				this.$store.dispatch('getDownCrossVanStaticinfoPage', params).then(data =>{
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
			// 查询数据3
			searchTabThird(flag){
				this.clearSelectVehicleData();
				if(flag){
					this.grid.options.flag = true;
					this.grid.options.current = 1;
				}else{
					this.grid.options.flag = false;
				}
				let params = {
					current: this.grid.options.current,
					size: this.grid.options.size,
					plateCode:this.search.plateCode,
					transferGroupId:this.search.transferGroupId
				}
				this.grid.loading = true;
				this.$store.dispatch('getDownCrossCoachStaticinfoPage', params).then(data =>{
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
			openGroupPage(event){
				this.$instruction({
						name: 'protocolGroup',
						title:this.$t('protocolGroup.selectGroup'),
						callback:this.changeInputValue
				})
			},
			// 弹出框传值回来
			changeInputValue(options){
				console.log("callback data:"+options);
				this.search.transferGroupId=options.transferGroupId;
				this.search.transferGroupName=options.transferGroupName;
			},
			// 发送指令
			send(){
				if(!this.order.vehicleId||!this.order.transferGroupId){
					this.$message.warning({ message: this.$t("platformDataExchange.pleaseSelectVehicle") });
					return;
				}
				if(!this.search.orderType||isNaN(this.search.orderType)){
					this.$message.warning({ message: this.$t("platformDataExchange.pleaseSelectOrderType") });
					return;
				}
				let params={
					vehicleId:this.order.vehicleId,
					vehicleType:this.order.vehicleType,
					tgoupId:this.order.transferGroupId,
					orderType:this.search.orderType
				}
				// console.log(params);
				// 执行指令发送
				this.grid.loading = true;
				this.confirmPrompt(this.$t("platformDataExchange.confirmIsSendOrder")).then(() => {
						this.$store.dispatch('sendSkipAreaVehicleLocationCmd', params).then(data => {
							if (!data.flag && !!data.errorCode){
									this.$message.error({ message: this.$t("error."+data.errorCode) });
									this.grid.loading = false;
							}else{
								this.switchSearch();
								this.$message.success({ message: this.$t("action.actionSuccess") });
								this.grid.loading = false;
							}
							this.clearSelectVehicleData();
						}).catch(error=>{
							this.grid.loading = false;
						})
					})
			},
			 //车牌颜色过滤
			plateColor(vall){
				return this.$filter.plateCodeColor(vall.plateColor);
			},
			// 上级平台车辆类型
			superPlatformCarType(vall){
				return this.$filter.superPlatformCarType(vall.vehicleType);
			}
		},
		mounted(){
			this.searchTabFirst();// 初始化加载第一个tab数据
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

