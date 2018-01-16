<template>
    <div class='behavior'>
        <cv-header>
             <el-form-item :label="$t('cL.carNumber')" prop="plateCode">
                <el-input v-model.trim="search.plateCode" size='small' :maxlength='10'></el-input>
            </el-form-item>
            <el-form-item label="车牌颜色" prop="plateColor">
                  <el-select  v-model="search.plateColor" size='small'>
                        <el-option v-for="item in colorType" :key="item.val" :value='item.val' :label="item.name"></el-option>
                    </el-select>     
            </el-form-item>
             <el-form-item label="IC状态" prop="state">
                  <el-select  v-model="search.state" size='small'>
                        <el-option v-for="item in stateType" :key="item.val" :value='item.val' :label="item.name"></el-option>
                    </el-select>     
            </el-form-item>
            <el-form-item label="IC结果" prop="readerresult">
                  <el-select  v-model="search.readerresult" size='small'>
                        <el-option v-for="item in resultType" :key="item.val" :value='item.val' :label="item.name"></el-option>
                    </el-select>     
            </el-form-item>
            <el-form-item style='float:right'>
                <cv-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false"   @export ="down"
                :is-add='false' @search="load(false)" style='margin:0px;'></cv-tool>
            </el-form-item>
            <div slot='bottom'>
            <el-form-item label="证件有效期:">
                <el-date-picker :editable="false" :clearable="false" v-model="ValidTime" size="small" type="daterange" placeholder="请选择时间" style="width:230px" >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="打卡时间:" >
                <el-date-picker :editable="false" :clearable="false" v-model="CheckTime" size="small" type="datetimerange" placeholder="请选择时间" :picker-options="pickerOption" style="width:330px">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="驾驶员姓名">
                <el-input v-model.trim="search.drivername" size='small' :maxlength='10'></el-input>
            </el-form-item>
              <el-form-item label="身份证号">
                <el-input v-model.trim="search.identity" size='small' :maxlength='10'></el-input>
            </el-form-item>
              <el-form-item label="从业资格证" >
                <el-input v-model.trim="search.driverlicense" size='small' :maxlength='10'></el-input>
            </el-form-item>
             <el-form-item label="发证机构" >
                <el-input v-model.trim="search.licenseorga" size='small' :maxlength='10'></el-input>
            </el-form-item>
         
            </div>
        </cv-header>
        <cv-content :fill='true'>
            <cv-grid class="" :options="options" @load="load(false)" >
                <el-table border stripe :data="options.table" :max-height="this.$service.getAutoHeight(1)" v-loading="loading">
                    <el-table-column label="车牌号码"   min-width="100" prop="plateCode" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="车牌颜色"  min-width="100" prop="plateColor" :formatter='plateCodeAndColor'></el-table-column>
                    <el-table-column label="驾驶员姓名"  min-width="150" prop="drivername":show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="打卡时间"  min-width="150" prop="checkTimeStr":show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="IC状态"  min-width="100" prop="state" :formatter='icType'></el-table-column>
                    <el-table-column label="IC结果"  min-width="150" prop="readerresult" :show-overflow-tooltip="true" :formatter='icResult'></el-table-column>
                    <el-table-column label="身份证号"  min-width="100" prop="identity" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="从业资格证"  min-width="120" prop="driverlicense" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="证件有效期"  min-width="150" prop="documentId" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="发证机构"  min-width="150" prop="licenseorga" :show-overflow-tooltip="true"></el-table-column>
                   
                </el-table>
            </cv-grid>
        </cv-content>
    </div>
</template>
<script>
import port from './index.js'
import { http, COMMON,service} from "@/utils";
export default {
    components: {},
    mixins: [port,service],
    data() {
        return {
            paramsCode:{},
            search:{
                plateCode:"",
                plateColor:"",
                state:'',
                readerresult:'',
                drivername:'',
                identity:'',
                driverlicense:'',
                licenseorga:'',
 
            },
        ValidTime:['',''],
        CheckTime:['',''],
            colorType:[
                {val:"1",name:"蓝色"},
                {val:"2",name:"黄色"},
                {val:"3",name:"黑色"},
                {val:"4",name:"白色"},
                {val:"5",name:"绿色"},
                {val:"9",name:"其他"}
            ],
            stateType:[
                {val:"1",name:"上班"},
                {val:"2",name:"下班"}
            ],
            resultType:[
                {val:"0",name:"读卡成功"},
                {val:"1",name:"密钥错误"},
                {val:"2",name:"卡被锁"},
                {val:"3",name:"卡被拔出"},
                {val:"4",name:"数据校验失败"}
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
      // 日期配置
            pickerOption: {
                disabledDate(time) {
                return time.getTime() > Date.now();
                }
            }
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
     
            let params = {   
                plateCode:this.search.plateCode,
                plateColor:this.search.plateColor,
                state:this.search.state,
                readerresult:this.search.readerresult,
                drivername:this.search.drivername,
                identity:this.search.identity,
                driverlicense:this.search.driverlicense,
                licenseorga:this.search.licenseorga,
                startValidTime:this.ValidTime[0]?this.$filter.format(this.ValidTime[0], "yyyy-MM-dd"):'',
                endValidTime:this.ValidTime[1]?this.$filter.format(this.ValidTime[1], "yyyy-MM-dd"):'',
                startCheckTime:this.CheckTime[0]?(this.$filter.format(this.CheckTime[0], "yyyy-MM-dd HH:mm:ss")):'',
                endCheckTime:this.CheckTime[1] ? this.$filter.format(this.CheckTime[1], "yyyy-MM-dd HH:mm:ss") :'',
            };
            this.paramsCode=params;
            this.getDriver(params).then(data => {
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
        down(){
            let downParams= {
                plateCode:this.search.plateCode,
                plateColor:this.search.plateColor,
                state:this.search.state,
                readerresult:this.search.readerresult,
                drivername:this.search.drivername,
                identity:this.search.identity,
                driverlicense:this.search.driverlicense,
                licenseorga:this.search.licenseorga,
                startValidTime:this.ValidTime[0]?this.$filter.format(this.ValidTime[0], "yyyy-MM-dd"):'',
                endValidTime:this.ValidTime[1]?this.$filter.format(this.ValidTime[1], "yyyy-MM-dd"):'',
                startCheckTime:this.CheckTime[0]?(this.$filter.format(this.CheckTime[0], "yyyy-MM-dd HH:mm:ss")):'',
                endCheckTime:this.CheckTime[1] ? this.$filter.format(this.CheckTime[1], "yyyy-MM-dd HH:mm:ss") :'',
                // size:20000,
                // current:1
            }
            const exportUrl = this.$service.winParams(
                this.$COMMON.baseUrl + "/log/getDriverCheckLogExportList",downParams);
            window.location.href = exportUrl;
        },
         plateCodeAndColor(row){
				  return this.$filter.plateCodeColor(row.plateColor);
        },
        icType(row){
				  return this.$filter.icType(row.state);
        },
        icResult(row){
				  return this.$filter.icResult(row.readerresult);
		},      

    },
    mounted() {
        this.load();
    }
}
</script>
<style lang="scss">
.behavior{
    .el-input ,.el-select{
        widows: 190px;
    }
}
</style>