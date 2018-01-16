<template>
    <div class="vehiclePeccancy">
        <cv-header>
            <el-form-item :label="$t('dm.company')" v-show='(activeName != "first" ? false : true)'>
                <cv-dropdown-tree 
                :placeholder="$t('common.enterprise.affiliated')"
                :interface=" $COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'"
                v-model="search.enterpriseName"
                @label="enterpriseId"></cv-dropdown-tree>
            </el-form-item>
            <el-form-item label="分组名称" v-show='(activeName != "third" ? false : true)'>
                <cv-dropdown-tree v-model.trim="search.fleetName" :is-fleet="true" :interface="$COMMON.baseUrl + '/fleet/findFleetInfoList'" :is-default="false"  :enterprise-id="$store.getters.user.enterpriseId" @label="vehicleIdCall"></cv-dropdown-tree>
            </el-form-item>
     	    <el-form-item label="报警类型:">
				<dropdown-tree style="display:inline-block" :isCheck="true" size='small' :interface="$COMMON.baseUrl+'/alarmInfo/frinAlarmTypeInfoList.do'" :show-checkbox="true" @checked="checked"></dropdown-tree>
			</el-form-item>
            <el-form-item :label="$t('cL.carNumber')" v-show='((activeName == "first" || activeName == "third") ? false : true)'>
                <el-input v-model.trim="search.plateCode" size='small' :maxlength='10'></el-input>
            </el-form-item>
            <el-form-item label="选择时间:">
                <el-date-picker class="picker" v-model="time" :picker-options='pickerOptions0'  :clearable="false" :editable="false" type="datetimerange"  placeholder="选择时间范围" prop='time'></el-date-picker>
            </el-form-item>
            <el-form-item style='float:right'>
                <cv-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false"   @export ="down"
                :is-add='false' @search="load"  :is-export="downFlag" style='margin:0px;'></cv-tool>
            </el-form-item>
        </cv-header>
        <cv-content :fill='true'>
            <el-tabs v-model="activeName" @tab-click="load(false,'clear')">
                <el-tab-pane label="公司告警及时处理统计信息" name="first">
                    <cv-grid class="" :options="table1" @load="load(false)"  v-loading="table1.loading">
                        <el-table border stripe :data="table1.table" :max-height="$service.getAutoHeight(1,1)" ref='table1'>
                            <el-table-column label="公司名称 "  min-width="100" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="报警级别"  min-width="100" prop="alarmLevel" :formatter="alarmLev"></el-table-column>
                            <el-table-column label="报警类型"  min-width="150" prop="alarmTypeName" :show-overflow-tooltip="true">
                            </el-table-column>
                            <el-table-column label="开始时间" min-width="150" prop="startTime" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="结束时间"  min-width="150" prop="endTime" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="报警次数 "  min-width="100" prop="alarmCount" ></el-table-column>
                            <el-table-column label="处理次数"  min-width="100" prop="timelyHandle"></el-table-column>
                            <el-table-column label="未处理次数"  min-width="100" prop="unTimelyHandle" :formatter="getunTimelyHandle"></el-table-column>
                            <el-table-column label="处理率"  min-width="80" prop="timelypercentage" ></el-table-column>
                            <el-table-column :label="$t('action.operation')" prop="operate">
                                <template scope="scope" >
                                    <cv-span type="primary" @click.native='companyDeil(scope.row)'>详细信息</cv-span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </cv-grid>
                </el-tab-pane>
                <el-tab-pane label="公司告警及时处理详细信息" name="second">
                    <cv-grid class="" :options="table2" @load="load(false)"  v-loading="table2.loading">
                        <el-table border stripe :data="table2.table" :max-height="$service.getAutoHeight(1,1)" ref='table2'>
                            <el-table-column label="车牌号"  min-width="100" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="公司名称"  min-width="100" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="分组名称"  min-width="100" prop="dpName" :show-overflow-tooltip="true"></el-table-column>
                             <el-table-column label="报警级别"  min-width="100" prop="alarmLevel" :formatter="alarmLev"></el-table-column>
                            <el-table-column label="报警类型"  min-width="150" prop="alarmTypeName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="开始时间 "  min-width="150" prop="startTime" :show-overflow-tooltip="true">
                            </el-table-column>
                            <el-table-column label="结束时间"  min-width="150" prop="endTime" :show-overflow-tooltip="true">
                            </el-table-column>
                            <el-table-column label="报警次数"  min-width="100" prop="alarmCount"></el-table-column>
                            <el-table-column label="已处理次数"  min-width="120" prop="timelyHandle"></el-table-column>
                            <el-table-column label="未处理次数"  min-width="120" prop="unTimelyHandle" :formatter="getunTimelyHandle"></el-table-column>
                            <el-table-column label="处理率"  min-width="80" prop="timelypercentage" ></el-table-column>
                        </el-table>
                    </cv-grid>
                </el-tab-pane>
                <el-tab-pane label="分组告警及时处理统计信息" name="third">
                    <cv-grid class="" :options="table3" @load="load(false)"  v-loading="table3.loading">
                        <el-table border stripe :data="table3.table" :max-height="$service.getAutoHeight(1,1)" ref='table3'>
                             <el-table-column label="公司名称 "  min-width="100" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                              <el-table-column label="分组名称"  min-width="100" prop="dpName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="报警级别"  min-width="100" prop="alarmLevel" :formatter="alarmLev"></el-table-column>
                            <el-table-column label="报警类型"  min-width="150" prop="alarmTypeName" :show-overflow-tooltip="true">
                            </el-table-column>
                            <el-table-column label="开始时间" min-width="150" prop="startTime" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="结束时间"  min-width="150" prop="endTime" :show-overflow-tooltip="true"> 
                            </el-table-column>
                            <el-table-column label="报警次数 "  min-width="100" prop="alarmCount" ></el-table-column>
                            <el-table-column label="处理次数"  min-width="100" prop="timelyHandle"></el-table-column>
                            <el-table-column label="未处理次数"  min-width="120" prop="unTimelyHandle" :formatter="getunTimelyHandle"></el-table-column>
                            <el-table-column label="处理率"  min-width="80" prop="timelypercentage" ></el-table-column>
                            <el-table-column :label="$t('action.operation')" prop="operate">
                                <template scope="scope" >
                                    <cv-span type="primary" @click.native="groupDeil(scope.row)">详细信息</cv-span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </cv-grid>
                </el-tab-pane>
                <el-tab-pane label="分组告警及时处理详细信息" name="fourth">
                    <cv-grid class="" :options="table4" @load="load(false)"  v-loading="table4.loading">
                        <el-table border stripe :data="table4.table" :max-height="$service.getAutoHeight(1,1)" ref='table4'>
                            <el-table-column label="车牌号"  min-width="100" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="公司名称"  min-width="100" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="分组名称"  min-width="100" prop="dpName" :show-overflow-tooltip="true"></el-table-column>
                             <el-table-column label="报警级别"  min-width="100" prop="alarmLevel" :formatter="alarmLev"></el-table-column>
                            <el-table-column label="报警类型"  min-width="150" prop="alarmTypeName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="开始时间 "  min-width="150" prop="startTime" :show-overflow-tooltip="true">
                            </el-table-column>
                            <el-table-column label="结束时间"  min-width="150" prop="endTime" :show-overflow-tooltip="true">
                            </el-table-column>
                            <el-table-column label="报警次数"  min-width="100" prop="alarmCount"></el-table-column>
                            <el-table-column label="已处理次数"  min-width="120" prop="timelyHandle"></el-table-column>
                            <el-table-column label="未处理次数"  min-width="120" prop="unTimelyHandle" :formatter="getunTimelyHandle"></el-table-column>
                            <el-table-column label="处理率"  min-width="80" prop="timelypercentage" ></el-table-column>
                        </el-table>
                    </cv-grid>
                </el-tab-pane>
            </el-tabs>
        </cv-content>
     </div>
</template>
<script>
import dropdownTree from '@/components/dropdown-tree/dropdown.tree.vue'
import port from './index.js'
export default {
   	components: { dropdownTree },
    mixins: [port],
    data(){
        return{
            alarmTypes:[],
            allAlarm:[],
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            downFlag:true,
            search:{
                enterpriseName:"",
                enterpriseId:"",
                fleetName:"",
                fleetId:"",
                plateCode:"",
                startTime:'',
                endTime:'',
                vehicleId:"",
                type:[]
            },
            time: [
                this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd start')),
                this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd end'))	
            ],
            table1:{
                size:10,
                total:0,
                current: 1,
                table:[],
                loading:false,
                flag:false
            },
            table2:{
                size:10,
                total:0,
                current: 1,
                enterpriseId:"",
                type:'',
                table:[],
                loading:false,
                flag:false
            },
            table3:{
                size:10,
                total:0,
                current: 1,
                table:[],
                loading:false,
                flag:false
            },
            table4:{
                size:10,
                total:0,
                current: 1,
                fleetId:"",
                table:[],
                loading:false,
                type:'',
                flag:false
            },
            activeName:"first"
        }
    },
    methods: {
        checked(alarms) {
            this.search.type = alarms;
            this.table2.type=alarms.join(",");
            this.table4.type=alarms.join(",");
		},
        load(flag,cl){
            switch(this.activeName){
                case "first":
                    this.table1Load(flag);
                    this.downFlag =true;
                    break;
                case "second":
                    this.table2Load(flag);
                    this.table2.enterpriseId='';
                    this.table2.type='';
                    this.downFlag =true;
                    break;
                case "third":
                    this.table3Load(flag);
                    this.downFlag =true;
                    break;
                case "fourth":
                    this.table4.fleetId='';
                    this.table4.type='';
                    this.table4Load(flag);
                    this.downFlag =true;
                    break;
            }
        },
        vehicleIdCall(val){
            if(val.id=="empty"){
                this.search.fleetId="";
            }else{
                 this.search.fleetId=val.id;
            }
        },
        alarmLev(row){
            let html=""
            switch(row.alarmLevel){
                case "2":
                    html="一般报警";
                    break;
                case "1":
                    html="中级报警";
                    break;
                case "0":
                    html="紧急报警";
            }
            return html;
        },
        table1Load(flag){
            let _params = this.getData(this.table1);
            if (flag) {
                this.table1.flag = true;
                this.table1.current = 1;
            } else {
                this.table1.flag = false;
            }
            if(!this.time[0]){
                this.$message.warning("请选择时间!");
                return false;
            }
            if(this.$filter.timeRange(_params.startTime,_params.endTime)>1){
                this.$message.warning("查询范围不能超过一天!");
                return false;
            }
            this.table1.loading=true;
            this.search.enterpriseId != "" && (_params.enterpriseId = this.search.enterpriseId);
            _params.typeName=1;
            _params.size=this.table1.size;
            _params.current=this.table1.current;
            this.queryCompanyAlarm(_params).then(data => {
                if(data.flag){
                    this.table1.table = data.data.records;
                    this.table1.total = data.data.total;
                    this.table1.current=data.data.current;
                }else{
                    this.$message.error(this.$t('error.'+data.errorCode));
                    this.table1.table =[];
                    this.table1.total =0;
                }
                this.table1.loading = false;
            }).catch(_=>{
                this.$message.error("网络请求错误");
                this.table1.loading=false;
            });
        },
        table2Load(flag,id,type){
            let _params = this.getData(this.table2);
            if (flag) {
                this.table2.flag = true;
                this.table2.current = 1;
                id ? ( _params.enterpriseId = id): (_params.enterpriseId = this.table2.enterpriseId);
                type ? (_params.alarmTypeIds= type):(_params.alarmTypeIds=this.table2.type);
                _params.typeName=2;
            } else {
                this.table2.flag = false;
                 _params.enterpriseId = this.table2.enterpriseId;
                _params.alarmTypeIds= this.table2.type;
                _params.typeName=2;
            }
            _params.plateCode=this.search.plateCode;
             _params.size=this.table2.size;
             _params.current=this.table2.current;
            if(!this.time[0]){
                this.$message.warning("请选择时间!");
                return false;
            }
            if(this.$filter.timeRange(_params.startTime,_params.endTime)>1){
                this.$message.warning("查询范围不能超过一天!");
                return false;
            }
            this.table2.loading=true;
            this.queryCompanyAlarm(_params).then(data => {
                if(data.flag){
                    this.table2.table = data.data.records;
                    this.table2.total = data.data.total;
                    this.table2.current=data.data.current;
                }else{
                    this.$message.error(this.$t('error.'+data.errorCode));
                    this.table2.table =[];
                    this.table2.total =0;
                }
                this.table2.loading = false;
            }).catch(_=>{
                this.$message.error("网络请求错误");
                this.table2.loading=false;
            });
            
        },
        table3Load(flag){
            let _params = this.getData(this.table3);
            if (flag) {
                this.table3.flag = true;
                this.table3.current = 1;
            } else {
                this.table3.flag = false;
            }
            if(!this.time[0]){
                this.$message.warning("请选择时间!");
                return false;
            }
            if(this.$filter.timeRange(_params.startTime,_params.endTime)>1){
                this.$message.warning("查询范围不能超过一天!");
                return false;
            }
            this.table3.loading=true;
             _params.dpId = this.search.fleetId;
            _params.typeName=1;
             _params.size=this.table3.size;
             _params.current=this.table3.current;
            this.queryGoupAlarm(_params).then(data => {
                if(data.flag){
                    this.table3.table = data.data.records;
                    this.table3.total = data.data.total;
                    this.table3.current=data.data.current;
                }else{
                    this.$message.error(this.$t('error.'+data.errorCode));
                    this.table3.table =[];
                    this.table3.total =0;
                }
                this.table3.loading = false;
            }).catch(_=>{
                this.$message.error("网络请求错误");
                this.table3.loading=false;
            });
        },
        table4Load(flag,cl,id,type){
            let _params = this.getData(this.table4);
            if (flag) {
                this.table4.flag = true;
                this.table4.current = 1;
                id ? ( _params.dpId = id): (_params.dpId = this.table4.fleetId);
                type ?( _params.alarmTypeIds= type):(_params.alarmTypeIds= this.table4.type);
                _params.typeName=2;
            } else {
                this.table4.flag = false;
                _params.dpId = this.table4.fleetId;
                _params.alarmTypeIds= this.table4.type;
                _params.typeName=2;
            }
            _params.plateCode=this.search.plateCode;
             _params.size=this.table4.size;
             _params.current=this.table4.current;
            if(!this.time[0]){
                this.$message.warning("请选择时间!");
                return false;
            }
            if(this.$filter.timeRange(_params.startTime,_params.endTime)>1){
                this.$message.warning("查询范围不能超过一天!");
                return false;
            }
            if(!cl){
                this.table4.loading=true;
                this.queryGoupAlarm(_params).then(data => {
                    if(data.flag){
                        this.table4.table = data.data.records;
                        this.table4.total = data.data.total;
                        this.table4.current=data.data.current;
                    }else{
                        this.$message.error(this.$t('error.'+data.errorCode));
                        this.table4.table =[];
                        this.table4.total =0;
                    }
                    this.table4.loading = false;
                }).catch(_=>{
                    this.$message.error("网络请求错误");
                    this.table4.loading=false;
                });
            }else{
                this.table4.table =[];
                this.table4.total =0;
                this.table4.loading=false;
            }
            
        },
        companyDeil(row){
            this.table2Load(true,row.enterpriseId,row.alarmTypeId);
            this.table2.enterpriseId=row.enterpriseId;
            this.table2.type=row.alarmTypeId;
            this.activeName='second';
        },
        groupDeil(row){
            this.table4Load(true,null,row.dpId,row.alarmTypeId);
            this.table4.fleetId=row.dpId;
            this.table4.type=row.alarmTypeId;
            this.activeName='fourth';
        },
        getunTimelyHandle(item){
            if(item.unTimelyHandle==0 && item.timelyHandle ==0){
                return item.alarmCount;
            }else{
                return item.unTimelyHandle;
            }
        },
        enterpriseId(val){
            if(val.id=="empty"){
                this.search.enterpriseId="";
            }else{
                 this.search.enterpriseId=val.id;
            }
        },
        down(){
            let url="";
            let _params ={};
            if(!this.time[0]){
                this.$message.warning("请选择时间!");
                return false;
            }
            switch(this.activeName){
                case "first":
                    url="/report/reportVehicleAlarmHandle";
                    _params = this.getData(this.table1);
                    if(this.$filter.timeRange(_params.startTime,_params.endTime)>1){
                        this.$message.warning("查询范围不能超过一天!");
                            return false;
                    }
                    this.search.enterpriseId != "" && (_params.enterpriseId = this.search.enterpriseId);
                    _params.typeName=1;
                    break;
                case "second":
                    url="/report/reportVehicleAlarmHandle";
                    _params = this.getData(this.table2);
                    if(this.$filter.timeRange(_params.startTime,_params.endTime)>1){
                        this.$message.warning("查询范围不能超过一天!");
                        return false;
                    }
                    _params.enterpriseId = this.table2.enterpriseId;
                    _params.alarmTypeIds= this.table2.type;
                    _params.typeName=2;
                    break;
                case "third":
                    url="/report/reportVehicleAlarmHandleInfo";
                    _params = this.getData(this.table3);
                    if(this.$filter.timeRange(_params.startTime,_params.endTime)>1){
                        this.$message.warning("查询范围不能超过一天!");
                        return false;
                    }
                    _params.dpId = this.search.fleetId;
                    _params.typeName=1;
                    break;
                case "fourth":
                    url="/report/reportVehicleAlarmHandleInfo";
                    _params = this.getData(this.table4);
                    if(this.$filter.timeRange(_params.startTime,_params.endTime)>1){
                        this.$message.warning("查询范围不能超过一天!");
                        return false;
                    }
                    _params.dpId = this.table4.fleetId;
                    _params.alarmTypeId= this.table4.type;
                    _params.typeName=2;
                    break;
            }
            const exportUrl = this.$service.winParams(this.$COMMON.baseUrl + url,_params);
            window.location.href = exportUrl;
        },
        getData(data){
            this.search.startTime = /NAN/ig.test(this.$filter.format(this.time[0]))?this.time[0]:this.$filter.format(this.time[0], 'yyyy-MM-dd HH:mm:ss');
            this.search.endTime = /NAN/ig.test(this.$filter.format(this.time[1]))?this.time[1]:this.$filter.format(this.time[1], 'yyyy-MM-dd HH:mm:ss');
            let params = {
                startTime:this.search.startTime,
                endTime:this.search.endTime,
                size:data.size,
                alarmTypeIds:this.search.type.join(","),
                // alarmTypeId:"",
                current:data.current
            };
            // this.search.type.length > 1 ? (params.alarmTypeIds=this.search.type.join(",")) :(params.alarmTypeId =this.search.type.join(",")) ;
            return params;
        }

    },
    mounted() {
        this.table1Load();
        // this.table2Load();
        // this.table3Load();
        // this.table4Load();
    }
  
}
</script>
<style lang="scss">

</style>


