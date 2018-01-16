<template>
    <div class="cv-terminal-success">
        <cv-header>
            <el-form-item label="终端编号">
                <el-input
                    placeholder="终端编号"
                    v-model.trim="searchOptions.terminalCode"
                    size="small">
                </el-input>
            </el-form-item>
            <el-form-item label="车牌号">
                <el-input 
                placeholder="车牌号"
                v-model.trim="searchOptions.plateCode" 
                size="small"></el-input>
            </el-form-item>
            <el-form-item label="所属公司">
                <cv-dropdown-tree 
                    placeholder="所属公司"
                    :interface=" $COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'"
                    v-model="searchOptions.enterpriseName"
                    @label="outputEnterpriseId">
                </cv-dropdown-tree>
            </el-form-item>
            <el-form-item label="在线状态">
                <el-select 
                    v-model="searchOptions.online" 
                    size="small">
                    <el-option value="1" label="在线"></el-option>
                    <el-option value="0" label="不在线"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style='float:right'>
                <cv-tool 
                    style='margin:0px;'
                    :name="$route.name" 
                    :data="$store.getters.monitorMenu" 
                    :is-modify="false" 
                    :is-remove="false"  
                    :is-add='false' 
                    @export ="exportGrid"
                    @search="loadGrid"></cv-tool>
            </el-form-item>
            <div slot="bottom">
                <el-form-item label="注册起止日期:">
                    <el-date-picker 
                        v-model="searchOptions.registerTime" 
                        type="datetimerange"
                        size="small" 
                        :clearable='false'>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="鉴权起止日期:">
                    <el-date-picker
                        v-model="searchOptions.authenticationTime" 
                        type="datetimerange"
                        size="small" 
                        :clearable='false'>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="注销起止日期:">
                    <el-date-picker
                        v-model="searchOptions.cancelTime" 
                        type="datetimerange"
                        size="small" 
                        :clearable='false'>
                    </el-date-picker>
                </el-form-item>
                
            </div>
        </cv-header>
        <cv-content :fill="true">
            <cv-grid :options="gridOptions.options" @load="loadGrid(false)">
                <el-table :data="gridOptions.table" border stripe v-loading="gridOptions.loading">
                    <el-table-column :label="$t('cE.carNumber')" min-width="100" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column :label="$t('cE.carColor')" min-width="100" prop="plateColor"></el-table-column>
                    <el-table-column label="终端编号"  min-width="120" prop="terminalCode" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="终端手机号"  min-width="150" prop="mobileCode" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="注册时间" min-width="150" prop="registerDateStr" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="鉴权时间" min-width="150" prop="authDateStr" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label='在线状态' min-width="100" prop="onlineStr" ></el-table-column>
                    <el-table-column label="注销状态"  min-width="120" prop="isLogoutStr" ></el-table-column>
                    <el-table-column label="注销时间"  min-width="150" prop="logoutDateStr" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="所属企业" min-width="150" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
				</el-table>
            </cv-grid>
        </cv-content>
    </div>
</template>

<script>
import port from './index.js'
export default {
    mixins: [port],
    data(){
        return {
            // 搜索参数配置1
            searchOptions: {
                // 在线状态
                online: '',
                // 车牌号
                plateCode: '',
                terminalCode:'',
                // 所属公司
                enterpriseName: '',
                // 所属公司enterpriseId
                enterpriseId: '',
                // 注册起止时间
                registerTime: "",
                // 鉴权起止时间
                authenticationTime: "",
                // 注销起止时间
                cancelTime:""
            },
            // 表格参数配置
            gridOptions: {
                // 表格互动参数
                options: {
                    size: 10,
                    total: 0,
                    current: 1,
                    flag: false
                },
                table:[],
                loading: false
            }
        }
    },
    methods: {
        /**
         * @params val: 公司树点击返回信息{id, plateCode}
         */
        outputEnterpriseId(val){
            const {id, plateCode} = val;
            if(id!="empty"){
                this.searchOptions.enterpriseId = id;
            }else{
                this.searchOptions.enterpriseId='';
            }
        },
        /**
         * @augments: flag判断搜索查询还是分页查询
         * @function 加载表格方法
         */
        loadGrid(flag){
            if (flag) {
                this.gridOptions.options.flag = true;
                this.gridOptions.options.current = 1;
            } else {
                this.gridOptions.options.flag = false;
            }
            let _params=this.getData();
            _params.current=this.gridOptions.options.current;
            _params.size=this.gridOptions.options.size;
            this.gridOptions.loading=true;
            this.queryData(_params).then(data => {
                if(data.flag){
                    this.gridOptions.table=data.data.records;
                    this.gridOptions.options.total = data.data.total;
                }else{
                    this.gridOptions.table =[];
                    this.gridOptions.options.total =0;
                }
                this.gridOptions.loading=false;
            }).catch(_ => {
                this.$message.error('网络异常')
                this.gridOptions.loading=false;
            })
        },
        getData(){
			let item={};
			item=this.searchOptions;
			if(this.searchOptions.registerTime.length>0){
				item.startRegisterDate=this.$filter.format(this.searchOptions.registerTime[0], 'yyyy-MM-dd HH:mm:ss');
				item.endRegisterDate=this.$filter.format(this.searchOptions.registerTime[1], 'yyyy-MM-dd HH:mm:ss');
			}
			if(this.searchOptions.authenticationTime.length >0){
				item.startAuthDate=this.$filter.format(this.searchOptions.authenticationTime[0], 'yyyy-MM-dd HH:mm:ss');
				item.endAuthDate=this.$filter.format(this.searchOptions.authenticationTime[1], 'yyyy-MM-dd HH:mm:ss');
            }
            if(this.searchOptions.cancelTime.length >0){
				item.startLogoutDate=this.$filter.format(this.searchOptions.cancelTime[0], 'yyyy-MM-dd HH:mm:ss');
				item.endLogoutDate=this.$filter.format(this.searchOptions.cancelTime[1], 'yyyy-MM-dd HH:mm:ss');
			}
			return item;
		},
        /**
         * @function: 导出表格数据
        */
        exportGrid(){
            let par={
                online:this.searchOptions.online,
                plateCode:this.searchOptions.plateCode,
                terminalCode:this.searchOptions.terminalCode,
                enterpriseName:this.searchOptions.enterpriseName,
                enterpriseId:this.searchOptions.enterpriseId
            }
            if(this.searchOptions.registerTime.length>0){
				par.startRegisterDate=this.$filter.format(this.searchOptions.registerTime[0], 'yyyy-MM-dd HH:mm:ss');
				par.endRegisterDate=this.$filter.format(this.searchOptions.registerTime[1], 'yyyy-MM-dd HH:mm:ss');
			}
			if(this.searchOptions.authenticationTime.length >0){
				par.startAuthDate=this.$filter.format(this.searchOptions.authenticationTime[0], 'yyyy-MM-dd HH:mm:ss');
				par.endAuthDate=this.$filter.format(this.searchOptions.authenticationTime[1], 'yyyy-MM-dd HH:mm:ss');
            }
            if(this.searchOptions.cancelTime.length >0){
				par.startLogoutDate=this.$filter.format(this.searchOptions.cancelTime[0], 'yyyy-MM-dd HH:mm:ss');
				par.endLogoutDate=this.$filter.format(this.searchOptions.cancelTime[1], 'yyyy-MM-dd HH:mm:ss');
			}
            const exportUrl = this.$service.winParams(this.$COMMON.baseUrl + "/log/getTerminalRegisterExportList",par);
            window.location.href = exportUrl;
        }
    },
    mounted(){
        this.loadGrid();
    }
}
</script>



