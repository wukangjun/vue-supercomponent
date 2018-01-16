<template>
    <div class="singleAlarm">
        <cv-header>
            <el-form-item :label="$t('dm.company')">
                <cv-dropdown-tree 
                :placeholder="$t('common.enterprise.affiliated')"
                :interface=" $COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'"
                v-model="search.enterpriseName"
                @label="enterpriseId"></cv-dropdown-tree>
            </el-form-item>
            <el-form-item :label="$t('cL.carNumber')">
                <el-input v-model.trim="search.plateCode" size='small' :maxlength='10'></el-input>
            </el-form-item>
            <el-form-item label="选择时间:">
                <el-date-picker class="picker" v-model="time" :picker-options='pickerOptions0'  :clearable="true" :editable="false" type="datetimerange"  placeholder="选择时间范围" prop='time'></el-date-picker>
            </el-form-item>
            <el-form-item style='float:right'>
                <cv-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false"   @export ="down"
                :is-add='false' @search="load" style='margin:0px;'></cv-tool>
            </el-form-item>
        </cv-header>
        <cv-content :fill='true'>
            <cv-grid class="" :options="options" @load="load(false)"  v-loading="loading">
                <el-table border stripe :data="options.table" :max-height="$service.getAutoHeight(1,1)" ref='doubleTable' class='doubleTable'>
                    <el-table-column label="车牌号 "  min-width="150" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="车牌颜色"  min-width="100" prop="plateColor"></el-table-column>
                    <el-table-column label="公司名称"  min-width="150" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="紧急报警"  min-width="100" prop="alarmNum0" ></el-table-column>
                    <el-table-column label="超速报警"  min-width="100" prop="alarmNum1"></el-table-column>
                    <el-table-column label="疲劳驾驶 "  min-width="100" prop="alarmNum2" ></el-table-column>
                    <el-table-column label="预警"  min-width="80" prop="alarmNum3"></el-table-column>
                    <el-table-column label="GNSS模块发生故障"  min-width="200" prop="alarmNum4"> </el-table-column>
                    <el-table-column label="GNSS天线未接或被剪断"  min-width="200" prop="alarmNum5" ></el-table-column>
                    <el-table-column label="GNSS天线短路"  min-width="150" prop="alarmNum6"></el-table-column>
                    <el-table-column label="终端主电源欠压"  min-width="170" prop="alarmNum7"></el-table-column>
                    <el-table-column label="终端主电源掉电"  min-width="170" prop="alarmNum8"></el-table-column>
                    <el-table-column label="终端LCD或显示器故障"  min-width="200" prop="alarmNum9" ></el-table-column>
                    <el-table-column label="TTS模块故障"  min-width="130" prop="alarmNum10"></el-table-column>
                    <el-table-column label="摄像头故障"  min-width="130" prop="alarmNum11"></el-table-column>
                    <el-table-column label="当天累计驾驶超时"  min-width="150" prop="alarmNum18"></el-table-column>
                    <el-table-column label="超时停车"  min-width="100" prop="alarmNum19" ></el-table-column>
                    <el-table-column label="进区域"  min-width="80" prop="alarmNum20"></el-table-column>
                    <el-table-column label="进路线"  min-width="80" prop="alarmNum21"></el-table-column>
                    <el-table-column label="路段行驶时间不足"  min-width="170" prop="alarmNum22" ></el-table-column>
                    <el-table-column label="路线偏离报警"  min-width="150" prop="alarmNum23"></el-table-column>
                    <el-table-column label="车辆VSS故障"  min-width="150" prop="alarmNum24" ></el-table-column>
                    <el-table-column label="车辆油量异常"  min-width="150" prop="alarmNum25"></el-table-column>
                    <el-table-column label="车辆被盗(通过车辆防盗器)"  min-width="205" prop="alarmNum26"></el-table-column>
                    <el-table-column label="车辆非法点火"  min-width="135" prop="alarmNum27"></el-table-column>
                    <el-table-column label="车辆非法移位"  min-width="135" prop="alarmNum28" ></el-table-column>
                    <el-table-column label="碰撞侧翻报警"  min-width="135" prop="alarmNum29"></el-table-column>
                    <el-table-column label="严重故障"  min-width="100" prop="alarmNum32"></el-table-column>
                    <el-table-column label="制动气压报警"  min-width="135" prop="alarmNum33"></el-table-column>
                    <el-table-column label="油压报警"  min-width="100" prop="alarmNum34" ></el-table-column>
                    <el-table-column label="水位低报警"  min-width="135" prop="alarmNum35"></el-table-column>
                    <el-table-column label="制动蹄片磨损报警 "  min-width="155" prop="alarmNum36"></el-table-column>
                    <el-table-column label="空滤堵塞报警"  min-width="135" prop="alarmNum37" ></el-table-column>
                    <el-table-column label="缓速器高温报警信号"  min-width="165" prop="alarmNum38" ></el-table-column>
                    <el-table-column label="仓温报警信号"  min-width="154" prop="alarmNum39"></el-table-column>
                    <el-table-column label="机滤堵塞信号 "  min-width="154" prop="alarmNum40" ></el-table-column>
                    <el-table-column label="燃油堵塞信号"  min-width="154" prop="alarmNum41"></el-table-column>
                    <el-table-column label="机油温度报警信号"  min-width="153" prop="alarmNum42"></el-table-column>
                    <el-table-column label="燃油警告"  min-width="100" prop="alarmNum43" ></el-table-column>
                    <el-table-column label="空档滑行告警"  min-width="135" prop="alarmNum44"></el-table-column>
                    <el-table-column label="超长怠速告警"  min-width="135" prop="alarmNum45"></el-table-column>
                    <el-table-column label="怠速空调告警"  min-width="135" prop="alarmNum46"></el-table-column>
                    <el-table-column label="发动机超转告警"  min-width="155" prop="alarmNum47" ></el-table-column>
                    <el-table-column label="急加速报警"  min-width="135" prop="alarmNum48"></el-table-column>
                    <el-table-column label="急减速报警"  min-width="135" prop="alarmNum49"></el-table-column>
                    <el-table-column label="门开报警"  min-width="100" prop="alarmNum50"></el-table-column>
                    <el-table-column label="冷却液温度过高报警"  min-width="165" prop="alarmNum51" ></el-table-column>
                    <el-table-column label="蓄电池电压报警"  min-width="155" prop="alarmNum52"></el-table-column>
                    <el-table-column label="ABS故障告警"  min-width="155" prop="alarmNum53"></el-table-column>
                    <el-table-column label="平台-偏离路线报警"  min-width="165" prop="alarmNum64" ></el-table-column>
                    <el-table-column label="平台-线路关键点报警"  min-width="200" prop="alarmNum65"></el-table-column>
                    <el-table-column label="平台-进区域报警"  min-width="155" prop="alarmNum66" ></el-table-column>
                    <el-table-column label="平台-分路段限速报警"  min-width="200" prop="alarmNum67"></el-table-column>
                    <el-table-column label="平台-疲劳驾驶报警"  min-width="165" prop="alarmNum68"></el-table-column>
                    <el-table-column label="平台围栏区域超速报警"  min-width="200" prop="alarmNum69"></el-table-column>
                    <el-table-column label="出区域"  min-width="100" prop="alarmNum71" ></el-table-column>
                    <el-table-column label="出线路"  min-width="100" prop="alarmNum72"></el-table-column>
                    <el-table-column label="路段行驶时间过长"  min-width="155" prop="alarmNum73"></el-table-column>
                    <el-table-column label="场外停车预警"  min-width="135" prop="alarmNum74"></el-table-column>
                    <el-table-column label="非指定道口出入境预警"  min-width="200" prop="alarmNum75" ></el-table-column>
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
    data(){
        return{
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            search:{
                enterpriseName:"",
                plateCode:"",
                startTime:'',
                endTime:'',
                enterpriseId:"",
                query:false
            },
            time: [
                this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd start')),
                this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd end'))	
            ],
            loading:false,
            options:{
                size:10,
                total:0,
                current: 1,
                table:[],
                flag:false
            },
        }
    },
    methods: {
        load(flag){
           let _params=this.getData();
            if (flag) {
                this.options.flag = true;
                this.options.current = 1;
            } else {
                this.options.flag = false;
            }
            if(!this.time[0]){
                this.$message.warning("请选择时间!");
                return false;
            }
             if(this.$filter.timeRange(_params.startTime,_params.endTime)>1){
                this.$message.warning("查询范围不能超过一天!");
                return false;
            }
            this.loading=true;
            this.queryData(_params).then(data => {
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
        enterpriseId(val){
            if(val.id !="empty"){
                this.search.enterpriseId=val.id;
            }else{
                this.search.enterpriseId="";
            }
        },
        down(){
            let _params=this.getData();
              if(!this.time[0]){
                this.$message.warning("请选择时间!");
                return false;
            }
             if(this.$filter.timeRange(_params.startTime,_params.endTime)>1){
                this.$message.warning("查询范围不能超过一天!");
                return false;
            }
            const exportUrl = this.$service.winParams(this.$COMMON.baseUrl + "/alarmInfo/exportSingleCarAlarmInfo",_params);
            window.location.href = exportUrl;
        },
        getData(){
            this.search.startTime = /NAN/ig.test(this.$filter.format(this.time[0]))?this.time[0]:this.$filter.format(this.time[0], 'yyyy-MM-dd HH:mm:ss');
            this.search.endTime = /NAN/ig.test(this.$filter.format(this.time[1]))?this.time[1]:this.$filter.format(this.time[1], 'yyyy-MM-dd HH:mm:ss');
            let params = {
                startTime:this.search.startTime,
                endTime:this.search.endTime,
                plateCode:this.search.plateCode,
                size:this.options.size,
                current:this.options.current
            };
            this.search.enterpriseId !="" && (params.enterpriseId=this.search.enterpriseId);
            if(params.plateCode!="" || this.search.enterpriseId !=""){
                params.query=true;
                this.search.query=true;
            }else{
                params.query=false;
                this.search.query=false;
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


