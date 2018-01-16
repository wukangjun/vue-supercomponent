<template>
    <div class='behavior'>
        <cv-header>
            <el-form-item :label="$t('dm.company')" prop="enterpriseName">
                <!-- <cv-dropdown-tree 
                :placeholder="$t('common.enterprise.affiliated')"
                :interface=" $COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'"
                
                @label="enterpriseId"></cv-dropdown-tree> -->
    	<cv-dropdown-tree  :placeholder="$t('common.enterprise.enterpriseName')" :interface="$COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'" :readonly="false" v-model="search.enterpriseName" :is-default="false" @label="searchEnterprise"></cv-dropdown-tree>





            </el-form-item>
            <el-form-item :label="$t('cL.subGroup')" prop="fleetName">
                <cv-dropdown-tree v-model="search.fleetName" :is-fleet="true" :interface="$COMMON.baseUrl + '/fleet/findFleetInfoList'" :placeholder="$t('cE.ownCar')" :is-default="false" :enterprise-id="search.enterpriseId" @label="vehicleIdCall"></cv-dropdown-tree>
            </el-form-item>
            <el-form-item :label="$t('cL.carNumber')" prop="plateCode">
                <el-input v-model.trim="search.plateCode" size='small' :maxlength='10'></el-input>
            </el-form-item>
            <el-form-item style='float:right'>
                <cv-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false"   @export ="down"
                :is-add='false' @search="load" style='margin:0px;'></cv-tool>
            </el-form-item>
            <div slot='bottom'>
                <el-form-item label="日期类型:">
                    <el-select  v-model="search.dataType" size='small'>
                        <el-option v-for="item in type" :key="item.val" :value='item.val' :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期选择:">
                    <el-date-picker v-model="search.earchTime" :editable='false' size="small" type="date" :clearable='false'>
                    </el-date-picker>
                </el-form-item>
            </div>
        </cv-header>
        <cv-content :fill='true'>
            <cv-grid class="" :options="options" @load="load(false)" >
                <el-table border stripe :data="options.table" :max-height="this.$service.getAutoHeight(1)" v-loading="loading">
                    <el-table-column label="车牌号码"   min-width="150" prop="plateCode" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="起始时间"  min-width="150" :show-overflow-tooltip="true">
                        <template scope="scope">
                            {{options.startTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="结束时间"  min-width="150"  :show-overflow-tooltip="true">
                        <template scope="scope">
                            {{options.endTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="运行天数"  min-width="100" prop="totalDays"></el-table-column>
                    <el-table-column label="运行小时"  min-width="100" prop="totalKeepHour"></el-table-column>
                    <el-table-column label="日均运行时长(s)"  min-width="150" prop="avgDayDrivingHour"></el-table-column>
                    <el-table-column label="本段里程(km)"  min-width="150" prop="totalMileage" :formatter="content"></el-table-column>
                    <el-table-column label="日均里程(km)"  min-width="150" prop="avgDayMileage"></el-table-column>
                    <el-table-column label="驾驶评分"  min-width="100" prop="safeDrivingScore"></el-table-column>
                    <el-table-column label="侧翻(s)"  min-width="120" prop="totalRollover" ></el-table-column>
                    <el-table-column label="超速(s)"  min-width="100" prop="totalOverspeed"></el-table-column>
                    <el-table-column label="疲劳驾驶(s)"  min-width="150" prop="totalDriverFatigue"></el-table-column>
                    <el-table-column label="碰撞(次)"  min-width="150" prop="totalCollision" ></el-table-column>
                    <el-table-column label="急加速(s)"  min-width="150" prop="totalHardAcceleration"></el-table-column>
                    <el-table-column label="急减速(s)"  min-width="150" prop="totalSharpSlowdown"></el-table-column>
                    <el-table-column label="急转弯(s)"  min-width="150" prop="totalSharpTurns"></el-table-column>
                    <el-table-column label="总油量(L)"  min-width="150" prop="totalFuelEconomy" ></el-table-column>
                    <el-table-column label="百公里平均油耗(L/100km)"   min-width="230" prop="avgDayFuelEconomy" ></el-table-column>
                </el-table>
            </cv-grid>
        </cv-content>
    </div>
</template>
<script>
import port from './index.js'
export default {
    components: {},
    mixins: [port],
    data() {
        return {
            search:{
                enterpriseName:"",
                fleetName:"",
                plateCode:"",
                dataType:"0",
                isQuery:false,
                fleetId:"",
                enterpriseId:"",
                earchTime:this.$filter.format(new Date()-1000*60*60*24, 'yyyy-MM-dd'),
            },
            type:[
                {val:"0",name:"周报"},
                {val:"1",name:"月报"}
            ],
            loading:false,
            options:{
                size:10,
                total:0,
                startTime:'',
                endTime:'',
                table:[],
                loading:false,
                current: 1,
                flag:false
            },
        }
    },
    methods: {
        load(flag){
            this.loading=true;
            if (flag) {
                this.options.flag = true;
                this.options.current = 1;
            } else {
                this.options.flag = false;
            }
            this.queryData(this.getData()).then(data => {
                if(data.flag && data.data.length!=0){
                    this.options.table = data.data.records;
                    this.options.total = data.data.total;
                    this.options.current=data.data.current;
                }else{
                    this.options.table =[];
                    this.options.total =0;
                }
                this.loading = false;
            }).catch(_=>{
                this.loading=false;
            });
        },
    searchEnterprise({ id, enterpriseCode }) {
      this.search.enterpriseId = id;
    },
        vehicleIdCall(val){
            if(val.id !="empty"){
                this.search.fleetId=val.id;
            }else{
                this.search.fleetId="";
            }
        },
        down(){
            if(this.search.plateCode!="" || this.search.enterpriseId !="" || this.search.fleetId !=""){
                this.search.isQuery=true;
            }else{
                this.search.isQuery=false;
            }
            const exportUrl = this.$service.winParams(
                this.$COMMON.baseUrl + "/report/exportDrivingDataListInfo",{
                startTime:this.options.startTime,
                endTime:this.options.endTime,
                plateCode:this.search.plateCode,
                enterpriseId:this.search.enterpriseId,
                fleetId:this.search.fleetId,
                isQuery:this.search.isQuery
            });
            window.location.href = exportUrl;
        },  
        content(row){
            return this.$filter.toFixed(row.totalMileage,2);
        },
        getData(){
            let str=this.search.earchTime;
            let _time;
            if(typeof str === 'string'){
                _time=this.search.earchTime;
            }else{
               _time=this.$filter.format(this.search.earchTime, 'yyyy-MM-dd');
            }
            
            let time=this.$filter.dateWeekMonth(_time,'yyyy-MM-dd');
            this.options.startTime = (this.search.dataType=="0" ? time.week.WeekStart : time.month.MonthStart);
            this.options.endTime = (this.search.dataType=="0" ? time.week.WeekEnd : time.month.MonthEnd);
            let params = {
                startTime:this.options.startTime,
                endTime:this.options.endTime,
                plateCode:this.search.plateCode,
                enterpriseId:this.search.enterpriseId,
                fleetId:this.search.fleetId,
                size:this.options.size,
                current:this.options.current,
                queryType:"A"
            };
            if(params.plateCode!="" || params.enterpriseId !="" || params.fleetId !=""){
                params.isQuery=true;
                this.search.isQuery=true;
            }else{
                params.isQuery=false;
                this.search.isQuery=false;
            }
            return params;
        }

    },
    mounted() {
        this.load();
    }
}
</script>
<style lang="scss">

</style>