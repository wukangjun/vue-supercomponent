<template>
    <div class="paramsRecord">
        <cv-header>
            <el-form-item label="起始时间:">
                <el-date-picker class="picker" v-model="time" :picker-options='pickerOptions0'  :clearable="false " :editable="false" type="datetimerange"  placeholder="选择时间范围" prop='time'></el-date-picker>
            </el-form-item>
            <el-form-item style="float:right;">
                <cv-tool style="margin:0;" :name="$route.name" :data="$store.getters.monitorMenu" class="cv-tool" :is-export="false" :is-remove="false" :is-add="false" :is-modify="false" @search="search" :disabled='activeName=="second" ? true :false'></cv-tool>
            </el-form-item>
        </cv-header>
        <cv-content>
            <el-tabs v-model="activeName">
                <el-tab-pane label="采集参数记录列表" name="first">
                    <cv-grid class="list" :options="options" v-loading="loading">
                        <el-table border stripe :data="options.table">
                            <el-table-column label="车牌号 "  min-width="150" align='center' prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="所属企业 "  min-width="150" align='center' prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="记录采集时间 "  min-width="150" align='center' prop="recordTimeStr" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('action.operation')" width='100'>
                                <template scope="scope">
                                    <div class="cv-table-tool">
                                        <cv-span type='success' @click.native="view(scope)">查看详细</cv-span>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table> 
                    </cv-grid>
                </el-tab-pane>
                <el-tab-pane label="采集参数记录详细列表" name="second">
                    <cv-grid class="list" :options="lists" v-loading="lists.loading">
                        <el-table border stripe :data="lists.table">
                            <el-table-column label="事件类型 "  min-width="150" align='center' prop="typeText" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="事件发生时间 "  min-width="150" align='center' prop="recordTimeStr" :show-overflow-tooltip="true"></el-table-column>
                        </el-table>
                    </cv-grid>
                </el-tab-pane>
            </el-tabs>
        </cv-content>
    </div>
</template>
<script>
import port from "./index.js";
export default {
    components: {},
    mixins: [port],
    data() {
        return{
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            time: [
                this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd start')),
                this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd end'))	
            ],
            plateCode:'',
            loading:false,
            activeName:'first',
            options:{
                size:10,
                total:0,
                table:[],
                current: 1,
                flag:false
            },
            lists:{
                size:10,
                total:0,
                table:[],
                current: 1,
                flag:false,
                loading:false
            },
        }
    },
    methods: {
        //搜索
        search(flag){
            let params = this.getData();
            if(params){
                flag ? (this.options.flag = true,this.options.current = 1): this.options.flag = false;
                this.loading=true;
                this.queryData(params).then(item => {
                    if(item.flag){
                        this.options.table = item.data.records;
                        this.options.total=item.data.total;
                    }else{
                        this.options.table = [];
                    }
                    this.loading=false;
                });
            }
        },
        view(ite){
            this.activeName = "second";
            this.lists.table=[];
            this.lists.loading=true;
            this.queryList({orderId:ite.row.orderId}).then(item => {
                if(item.flag){
                    this.lists.table = item.data.records;
                    this.lists.total=item.data.total;
                }else{
                    this.lists.table = [];
                }
                this.lists.loading=false;
            });
        },
        //获取参数
        getData(){
            if(this.plateCode==""){
                this.$message.warning("请选择车辆");
                return false;
            }
            if(!this.time[0]){
                this.$message.warning("请选择时间");
                return false;
            }
            let params={
                startTime:this.$filter.format(this.time[0],'yyyy-MM-dd HH:mm:ss'),
                endTime:this.$filter.format(this.time[1],'yyyy-MM-dd HH:mm:ss'),
                current:this.options.current,
                size:this.options.size,
                plateCode:this.plateCode
            };
            return params;
        }
    },
    watch:{
        '$store.getters.ptSingleCar'(newVal) {
            this.plateCode=newVal.plateCode;
        }
    }
};
</script>

