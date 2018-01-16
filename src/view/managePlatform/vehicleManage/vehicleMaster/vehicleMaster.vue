<template>
	<div class="vehicleMaster">
		<cv-tool :name="$route.name" :data="$store.getters.manageMenus" :is-remove="false" :is-modify="false" :is-export='false' @add="add"  @search="search"></cv-tool>
		<cv-grid :options="grid.options" @load="load(false)">
			<el-table border stripe :data="grid.table" v-loading="grid.loading" >
				<el-table-column label="姓名" prop="username" width='150' :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="性别" prop="sexy" :show-overflow-tooltip="true" :formatter="sexyText"></el-table-column>
				<el-table-column label="生日" prop="birthday"  :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="身份证" prop="idcards" width='150' :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="手机号" prop="mobilephone" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="注册时间" prop="registerTime" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="所属企业" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('action.operation')" width='150'>
					<template scope="scope">
						<cv-table-tool 
						:name="$route.name"
        				:data="$store.getters.manageMenus"
						@modify="modify(scope)"
						@remove="remove(scope)"></cv-table-tool>
						<div class="cv-table-tool">
							<cv-span type='success' @click.native="vehicleList(scope)">拥有车辆</cv-span>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</cv-grid>
		<!-- 一级弹框 -->
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="load(true)"></component>	
		</el-dialog>	
	</div>
</template>
<script>
	import search from './search.vue'
    import add from './addAndEdit.vue'
    import list from './vehicleList.vue'
    import port from './index.js'
	import common from '@/utils/mixins/common'
	import { COMMON } from '@/utils'
	export default{
		components: {
			search,
            add,
            list
		},
		mixins: [port,common],
		data(){
			return{
				grid: {
					options: {
						current: 1,
						size: 10,
						total: 0,
						flag:false
					},
					table: [],
					loading: false
				},
				dialog: {
					title: '--',
					flag: false,
					name: 'add',
					size: 'dialog-full',
					id:"",
					search: {
						username: "",
						enterpriseName: '',
						sexy: "",
						mobilephone: "",
						idcards: "",
						startTime: '',
						endTime: ''
					}
                },
            }
		},
		methods: {
			search(val){
                this.dialog.flag = true;
				this.dialog.size = 'dialog-small';
				this.dialog.name = val.name;
				this.dialog.title = val.title;
            },
            load(flg){
                if(flg){
					this.grid.options.flag = true;
					this.grid.options.current = 1;
				}else{
					this.grid.options.flag = false;
				}
                let params = this.dialog.search;
                params.size=this.grid.options.size;
                params.current=this.grid.options.current;
				this.grid.loading = true;
				this.queryList(params).then(data => {
					if(data.flag){
						if(data.data.length!=0){
                            this.grid.table = data.data.records;
							this.grid.options.total = data.data.total;
						}else{
							this.grid.table =[];
							this.grid.options.total =0;
						}
					}else{
						this.grid.table =[];
						this.grid.options.total =0;
					}
					this.grid.loading = false;
				}).catch(_=>{
					this.grid.loading = false;
				});
            },
            remove(scope){
                this.confirmPrompt().then(() => {
					this.delitem({id:scope.row.id}).then(data => {
						if (data.flag){
							this.$message.success(this.$t('action.removeSuccess'));
							this.load();
						}else{
							this.$message.error(this.$t('action. removeFail'));
						}
					});
				});
            },
            add(val){
                this.dialog.id='';
                this.dialog.flag = true;
				this.dialog.size = 'dialog-large';
				this.dialog.name = val.name;
				this.dialog.title = val.title;
            },
            modify(scope){
                this.dialog.id=scope.row.id;
                this.dialog.flag = true;
				this.dialog.size = 'dialog-large';
				this.dialog.name = 'add';
				this.dialog.title = '修改';
            },
            vehicleList(scope){
                this.dialog.id=scope.row.id;
                this.dialog.flag = true;
				this.dialog.size = 'dialog-small';
				this.dialog.name = 'list';
				this.dialog.title = '车辆信息';
            },
            sexyText(row){
                let text='';
                if(row.sexy=="1"){
                    text='男';
                }else if(row.sexy=="0"){
                    text='女';
                }else{
                    text='';
                }
                return text;
            }

		},
		mounted(){
			this.load();
		}
	}
</script>

