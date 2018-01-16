<template>
	<div class='terminal'>
		<cv-tool 
	    :name="$route.name"
        :data="$store.getters.manageMenus"
		@add="addEvent"
		@search="searchEvent"
		:is-remove='false'
		:is-modify='false'
		:is-export="false"
		></cv-tool>
		<cv-grid :options='grid.options' @load='isSearch(false)'>
			<el-table border stripe :data='grid.table' v-loading="grid.loading">
				<el-table-column :label="$t('terminal.code1')" prop='code' width='120'></el-table-column>
				<el-table-column :label="$t('terminal.terminalType')" prop='manufacturerModel' :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('terminal.terminalTel')" prop='mobileCode' width="150"></el-table-column>
				<el-table-column :label="$t('terminal.company')" prop='enterpriseName' :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('terminal.bindingCar')" prop='plateCode' width='130'></el-table-column>
				<el-table-column :label="$t('terminal.isLogOut')" prop='isLogout' width='110' :formatter='isLogout'></el-table-column>
				<el-table-column :label="$t('action.operation')" width='100'>
					<template scope="scope">
						<cv-table-tool
						:name="$route.name"
        				:data="$store.getters.manageMenus"
						@modify="modify(scope)"
						@remove="removes(scope)"
						:is-remove="scope.row.isLogout=='0'?false:true"
						></cv-table-tool>
						<div class="cv-table-tool">
							<cv-span type='success' @click.native="updataTerminal(scope)"  v-show='(scope.row.isLogout !=null && scope.row.isLogout=="0") ? true : false'>注销</cv-span>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</cv-grid>
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class='dialog.size'>
			<component :is='dialog.name' :options='dialog' @confirm="isSearch(true)"></component>
		</el-dialog>
	</div>
</template>
<script>
	import search from './search.vue'
	import add from './add.vue'
	import port from './index.js'
	import common from '@/utils/mixins/common'
	export default{
		components: {
			search,
			add
		},
		mixins: [port,common],
		data(){
			return{
				flag:false,
				grid: {
					options: {
						current: 1,
						size: 10,
						total: 0,
						flag: false
					},
					table: [],
					loading: false
				},
				dialog: {
					title: '--',
					flag: false,
					name: 'search',
					size: 'dialog-small',
					id:"",//设备ID，用来区分新增和修改，以及修改传参
					search: {
						enterpriseId: "",//企业ID
						terminalTel: "",//终端手机号
						plateCode:"",//车牌号码
						company:"",
						code:""
					}
				}
			}
		},
		methods: {
			isSearch(type){
				if(type){
					this.grid.options.flag = true;
					this.grid.options.current = 1;
				}else{
					this.grid.options.flag = false;
				}
				this.queryList();				
			},
			queryList(){//查询设备列表
				let params = {
					current: this.grid.options.current,
					size: this.grid.options.size,
					enterpriseId: this.dialog.search.enterpriseId,
					mobileCode: this.dialog.search.terminalTel,
					plateCode: this.dialog.search.plateCode,
					code:this.dialog.search.code
				};
				this.grid.loading = true;
				this.queryTerminalMsg(params).then(data => {
					if(data.flag && data.data.length !=0 ){
						this.grid.table = data.data.records;
						this.grid.options.total = data.data.total;
					}else{
						this.grid.table =[];
						this.grid.options.total = 0;
					}
					this.grid.loading = false;
				}).catch(_=>{
					this.grid.loading = false;
				});
			},
			addEvent(val){//打开新增弹框
				this.dialog.id="";
				this.dialogOpen('dialog-middle',val.name,val.title);
			},
			searchEvent(val){//打开搜索弹框
				this.dialogOpen('dialog-tiny',val.name,val.title);
			},
			//打开修改弹框
			modify(scope){				
				this.dialogOpen('dialog-middle','add',this.$t('power.modify'));
				this.dialog.id=scope.row.id;
			},
			dialogOpen(size,name,title){
				this.dialog.size =size ;
				this.dialog.flag = true;
				this.dialog.name = name;
				this.dialog.title = title;
			},
			isLogout(row){ //解析注册状态
				return	this.$filter.isRegisterFilter(row.isLogout);
			},
			//删除单条数据
			removes(scope){
				this.confirmPrompt().then(() => {
					(async()=>{
						let {data,flag,errorCode} = await this.deleteTerminalById({"id":scope.row.id});
						flag ? (this.queryList(),this.$message.success(this.$t('action.removeSuccess'))):this.$message.error(this.$t('error.'+errorCode));
					})()
				});
			},
			updataTerminal(scope){
				this.logoutTerminal(scope.row.vehicleId).then(data => {
					if(data.flag){
						this.queryList();
						this.$message.success('注销成功');
					}else{
						this.$message.error(this.$t('error.'+data.errorCode));
					}
				});
			}
		},
		mounted(){
			this.queryList()
		}
	}
</script>

<style lang="scss">
	
</style>