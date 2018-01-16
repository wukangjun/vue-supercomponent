<template>
	<div class="cv-predefined-info">
		<cv-header>
			<el-form-item style="float:right">
				<cv-tool
					style="margin: 0px"
					:name="$route.name"
					:data="$store.getters.monitorMenu"
					:is-add="false"
					:is-modify="false"
					:is-remove="false"
					:is-export="false"
					@search="search">
				</cv-tool>
			</el-form-item>
		</cv-header>
		<cv-content :fill="true">
		   <cv-grid :options="grid.options" @load="load(false)">
				<el-table border stripe :data="grid.table" v-loading="grid.loading" ref="table" >
				    <!--	<el-table-column type="selection" width="55"></el-table-column> -->
					<el-table-column :label="$t('informationSendLog.plateCode')" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column :label="$t('informationSendLog.plateColor')" prop="plateColor" :show-overflow-tooltip="true" :formatter="filterColor"></el-table-column>
					<el-table-column :label="$t('informationSendLog.infoTypeName')" prop="infoTypeName" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column :label="$t('informationSendLog.lastSendTimeStr')" prop="lastSendTimeStr" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column :label="$t('informationSendLog.sendTimes')" prop="sendTimes" :show-overflow-tooltip="true" ></el-table-column>
					<el-table-column :label="$t('informationSendLog.successed')" prop="successed" :show-overflow-tooltip="true"  :formatter="filterIsSendSuccess"></el-table-column>
				</el-table>
		   </cv-grid>
		</cv-content>
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="load(true)"></component>
		</el-dialog>
	</div>
</template>

<script>
	import search from './search.vue'
	import common from '@/utils/mixins/common'
	import port from './'
	export default{
		components: {
			search
		},
		mixins:[common, port],
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
					size: 'dialog-small',
					name: 'search',
					search: {
						plateCode:'',
						infoTypeName:''
					}
				},
				multipleSelection: []
			}
		},
		methods: {
			pageDataList(){
				let params = {
					current: this.grid.options.current,
					size: this.grid.options.size,
					plateCode:this.dialog.search.plateCode,
					infoTypeName:this.dialog.search.infoTypeName
				};
				this.grid.loading = true;
				this.getInformationSendlogPage(params).then(data =>{
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
				this.pageDataList()
			},
			search(val){
				this.dialog.flag = true;
				this.dialog.title = val.title;
				this.dialog.name = val.name;
				this.dialog.size = 'dialog-tiny';
			},
			filterColor(row){
			   switch(row.plateColor){
				    case "1":
				      return this.$t('filter.colorBlue');
				      break;
				    case "2":
				      return  this.$t('filter.colorYellow');
				      break;
				    case "3":
				      return  this.$t('filter.colorBlack');
				      break;
				    case "4":
				      return  this.$t('filter.colorWhite');
				      break;
				    case "5":
				      return  this.$t('filter.colorGreen');
				      break;
					default:
					  return this.$t('filter.color');
					  break;
			  }
			},
			filterIsSendSuccess(row){
			   switch(row.successed){
				    case 0:
				      return this.$t('informationSendLog.isSendFailture');
				      break;
				    case 1:
				      return  this.$t('informationSendLog.isSendSuccess');
				      break;
			  }
			}
		},
		mounted(){
			this.pageDataList()
			
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