<template>
    <div class="vehicleDriveOperation">
        <cv-header>
            <el-form-item label="起止时间">
                <el-date-picker v-model="SEtime" :editable='false' :clearable="false"  size="small" type="daterange" placeholder="选择时间范围" :picker-options="pickerOption" style="width:220px">
                </el-date-picker>
            </el-form-item>
            <el-form-item style='float:right;'>
               <cv-tool
                    style='margin:0px;'
		                :name="$route.name"
                    :data="$store.getters.monitorMenu"
                    :is-modify="false"
                    :is-remove='false'
                    :is-add='false'
                    :is-export='(vehicleSigId || activeName =="vopA") ? true :false'
                    @search='searchVDO'
                    @export='down'
                     ></cv-tool>
            </el-form-item>
        </cv-header>
        <cv-content>
            <!-- tab页签 -->
            <el-tabs class="tabClass" v-model="activeName" @tab-click="tabClick">
                <!-- 车辆运行总表 -->
                <el-tab-pane :label="$t('reportForm.vehicleOpt.vehicleOptTotal')" name="vopA">
                    <!-- 表格 -->
                    <cv-grid class="" :options="vOptGrid.options" @load="vOptloadGrid(false)">
                        <el-table border stripe :data="vOptGrid.table" :max-height="$service.getAutoHeight(2,1)" v-loading="vOptGrid.loading" >
                            <el-table-column :label="$t('reportForm.vehicleOpt.vehicleJia')" header-align="center"  prop="carVin" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.vehicleOpt.vehiclePlateCode')" header-align="center" prop="plateCode"   min-width='120px' :show-overflow-tooltip="true">
                            <template scope="scope">
                                <cv-span type="primary" @click.native.prevent="linkTo(scope)">{{scope.row.plateCode}}</cv-span>
                            </template>
                            </el-table-column>
                            <el-table-column :label="$t('reportForm.vehicleOpt.shebei')" header-align="center"  prop="terminalCode" min-width='100px' :show-overflow-tooltip="true">
                              <template scope="scope">
								               <cv-span type="primary" @click.native.prevent="linkTo(scope)">{{scope.row.terminalCode}}</cv-span>
							                </template>
                            </el-table-column>
                            <el-table-column :label="$t('reportForm.vehicleOpt.operateTime')" header-align="center" prop="" :show-overflow-tooltip="true">
                              <el-table-column :label="$t('reportForm.vehicleOpt.operateDays')" header-align="center" min-width="100px"  prop="runningDays" :show-overflow-tooltip="true"></el-table-column>
                              <el-table-column :label="$t('reportForm.vehicleOpt.operateHours')" header-align="center" min-width="100px" prop="runningHours" :show-overflow-tooltip="true"></el-table-column>
                            </el-table-column>

                            <el-table-column :label="$t('reportForm.vehicleOpt.OilWear')" header-align="center"  prop="" :show-overflow-tooltip="true">
                              <el-table-column :label="$t('reportForm.vehicleOpt.begin')" header-align="center"min-width='100px' prop="initialyEngineFuel" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.vehicleOpt.end')" header-align="center" min-width='100px' prop="endEngineFuel"   :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.vehicleOpt.self')" header-align="center" min-width='100px' prop="thisSectionEngineFuel" :show-overflow-tooltip="true"></el-table-column>
                            </el-table-column>

                            <el-table-column :label="$t('reportForm.vehicleOpt.meter')" header-align="center"   :show-overflow-tooltip="true">
                              <el-table-column :label="$t('reportForm.vehicleOpt.begin')" header-align="center" prop="initialyDistance" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.vehicleOpt.end')" header-align="center"  prop="endDistance" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.vehicleOpt.self')" header-align="center"  prop="thisSectionDistance" :show-overflow-tooltip="true"></el-table-column>
                            </el-table-column>

                            <el-table-column :label="$t('reportForm.vehicleOpt.averageOil')" header-align="center"  prop="thisSectionAvgEngineFuel" min-width="200px" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.vehicleOpt.gpsMeter')" header-align="center"  prop="distanceGPS" min-width="200px" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.vehicleOpt.sliderMeter')" header-align="center"  prop="taxiedDistance" min-width="200px" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.vehicleOpt.sliderPro')" header-align="center"  prop="taxiedScale" min-width="100px" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('el.datepicker.startTime')" header-align="center"  prop="startTime" min-width="100px" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('el.datepicker.endTime')" header-align="center"  prop="endTime" min-width="100px" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('action.operation')" header-align="center"  prop="accountType" min-width="100px" :show-overflow-tooltip="true">
                              <template scope="scope">
								               <cv-span type="primary" @click.native.prevent="linkTo(scope)">查看详情</cv-span>
							                </template>
                            </el-table-column>
                        </el-table>
                    </cv-grid>
                </el-tab-pane>
                <!-- 车辆运行明细 -->
                <el-tab-pane :label="$t('reportForm.vehicleOpt.vehicleOptDetail')" name="vopB">
                    <!-- 表格 -->
                    <cv-grid class="" :options="vOptDGrid.options" @load="vOptDloadGrid(false)">
                        <el-table border stripe :data="vOptDGrid.table" :max-height="$service.getAutoHeight(2,1)" v-loading="vOptDGrid.loading">
                           <el-table-column :label="$t('reportForm.vehicleOpt.vehicleJia')" header-align="center"  prop="carVin" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.vehicleOpt.vehiclePlateCode')" min-width='120px' header-align="center"  prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('fenceManage.date')" header-align="center"  sortable min-width='180px' prop="startTime" :show-overflow-tooltip="true"></el-table-column>

                            <el-table-column :label="$t('reportForm.vehicleOpt.operateHours')" header-align="center"  min-width='100px' prop="runningHours" :show-overflow-tooltip="true"></el-table-column>

                            <el-table-column :label="$t('reportForm.vehicleOpt.OilWear')" header-align="center"  prop="" :show-overflow-tooltip="true">
                              <el-table-column :label="$t('reportForm.vehicleOpt.begin')" header-align="center" min-width='100px' prop="initialyEngineFuel" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.vehicleOpt.end')" header-align="center" min-width='100px' prop="endEngineFuel" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.vehicleOpt.self')" header-align="center" min-width='100px' prop="thisSectionEngineFuel" :show-overflow-tooltip="true"></el-table-column>
                            </el-table-column>

                            <el-table-column :label="$t('reportForm.vehicleOpt.meter')" header-align="center"  prop="" :show-overflow-tooltip="true">
                              <el-table-column :label="$t('reportForm.vehicleOpt.begin')" header-align="center" prop="initialyDistance" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.vehicleOpt.end')" header-align="center"  prop="endDistance" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.vehicleOpt.self')" header-align="center"  prop="thisSectionDistance" :show-overflow-tooltip="true"></el-table-column>
                            </el-table-column>

                            <el-table-column :label="$t('reportForm.vehicleOpt.averageOil')" header-align="center" min-width='200px'  prop="thisSectionAvgEngineFuel" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.vehicleOpt.gpsMeter')" header-align="center" min-width='200px' prop="distanceGPS" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.vehicleOpt.sliderMeter')" header-align="center" min-width='200px' prop="taxiedDistance" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.vehicleOpt.sliderPro')" header-align="center" min-width='100px' prop="taxiedScale" :show-overflow-tooltip="true"></el-table-column>
                        </el-table>
                    </cv-grid>
                </el-tab-pane>
            </el-tabs>
        </cv-content>
    </div>
</template>
<script>
import prot from './index.js'
export default {
    components: {

    },
    mixins: [prot],
    data() {
        return {
            choseCar:'',
            choseIds:[],
            choseCarCode:[],
            activeName: 'vopA',
            enterpriseName: '',
            deviceName:'123123123',
            vehicleSigId:'',
            SEtime: [
                this.$filter.timeStamp(this.$filter.format(new Date(new Date()-24*60*60*1000), 'yyyy-MM-dd')),
                this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd'))
            ],
            vOptGrid: {
                options: {
                    current: 1,
                    total:0,
                    size: 10,
                    flag: false
                },
                table: [],
                loading: false
            },
            vOptDGrid: {
                options: {
                    current: 1,
                    total: 0,
                    size: 10,
                    flag: false
                },
                table: [],
                loading: false
            },
            	// 日期配置
			      pickerOption: {
			      	disabledDate(time) {
				      	return time.getTime() > Date.now()
			     	  }
			     },
        }
    },
    methods: {
      //车辆运行详细报表
        vOptDloadGrid(type) {
          //  if(type){
          //       this.vOptDGrid.options.flag = true;
          //       this.vOptDGrid.options.current = 1;
          //   }else{
          //       this.vOptDGrid.options.flag = false;
          //   }
          //    if(this.choseCar==''){
          //   	this.$message.error({ message: this.$t('请选择车辆') });
          // }
          // let params={
          //   startDate:this.$filter.format(this.SEtime[0], 'yyyy-MM-dd'),
          //   endDate:this.$filter.format(this.SEtime[1], 'yyyy-MM-dd'),
          //   vehicleId:this.choseCar
          // }
          // console.log(params)
          // this.findVehicleBasicsInfo(params).then((data)=>{

          // })
        },
        //车辆运行报表
        vOptloadGrid(type) {
           if(type){
                this.vOptGrid.options.flag = true;
                this.vOptGrid.options.current = 1;
            }else{
                this.vOptGrid.options.flag = false;
            }
           if(this.choseCar==''){
            	this.$message.error({ message: this.$t('请选择车辆') });
              return false;
           }
            if(this.SEtime!=undefined){
              // console.log(this.SEtime)
              if(this.SEtime[0]!=null||this.SEtime[1]!=null){
                let startTime=this.$filter.format(this.SEtime[0], 'yyyy-MM-dd');
                let endtime=this.$filter.format(this.SEtime[1], 'yyyy-MM-dd');
                let params={
                    startDate:startTime,
                    endDate:endtime,
                    vehicleId:this.choseIds.join(",")
                   }
               this.vOptGrid.loading = true;
               this.findVehicleBasicsInfo(params).then((data)=>{
                //  debugger
               this.vOptGrid.loading = false;
               if(data.flag){
				   		    if(data.data.length!=0){
                                //   this.DataArrTranslate(data.data)
                            // this.vOptGrid.options.total = 10;
                                this.vOptGrid.table =data.data;
						      }else{
							    this.vOptGrid.table =[];
							    this.vOptGrid.options.total =0;
					    	  }
					    }else{
						     this.vOptGrid.table =[];
						     this.vOptGrid.options.total =0;
					    }
              }).catch(_=>{
					       this.vOptGrid.loading = false;
				      });
             }
            }else{
                this.$message.error({ message: this.$t('请选择时间') });
            }
            // console.log(this.SEtime,'时间')

        },
        DataArrTranslate(data){
          // console.log('得到数据',data)
          this.vOptGrid.table=[];
          for(let i=0;i<data.length;i++){
            let table=data[i];
            table.plateCode=this.choseCarCode[i]
            this.vOptGrid.table.push(table);
          }
        },
        //转到详细页
        linkTo(scope) {
            this.activeName = 'vopB';
            this.vehicleSigId=scope.row.id;
            // console.log(scope)
            this.vOptDGrid.loading=true;
            if(scope.row.detail){
              //详细页的数据处理
              this.vOptDGrid.loading=false;
              this.detailDataTranslate(scope.row.detail,scope.$index);
              // console.log(scope,'详细数据1')
            }
        },
        detailDataTranslate(data,index){
          this.vOptDGrid.table=[];
          if(data.length>0){
            this.vOptDGrid.table=data;
          }else{
            this.vOptDGrid.table=[];
            this.vOptDGrid.options.total =0;
          }

        },
        tabClick(tab, event) {
            if(tab.name=='vopB'){
                this.vOptDGrid.table=[];
                this.vehicleSigId='';
                this.vOptDGrid.options.total =0;
            }
        },
        //搜索
        searchVDO(){
          //点击搜索跳到初始页,
          this.activeName = 'vopA';
          //车辆运行明细的信息置空
          this.vOptDGrid.table=[];
          this.vOptDGrid.options.total =0;
          if(this.activeName == 'vopA'){
                this.vOptloadGrid(true);
            }else{
                this.vOptDloadGrid(true);
            }

        },
        //导出功能
        down(){
          // console.log(this.choseCar.length,'选择的车辆')
          if(this.choseIds.length == 0){
            	this.$message.error({ message: this.$t('请选择车辆') });
              return false;
           }
          if(this.SEtime!=undefined){
            if(this.SEtime[0]!=null||this.SEtime[1]!=null){
                let startTime=this.$filter.format(this.SEtime[0], 'yyyy-MM-dd');
                let endtime=this.$filter.format(this.SEtime[1], 'yyyy-MM-dd');
                let type=0;
                if(this.activeName=='vopA'){
                    type=0
                }
                if(this.activeName=='vopB'){
                    type=1;
                }
              // console.log("hi")
                const getExcel=this.$service.winParams(this.$COMMON.baseUrl+ '/report/exportVehicleBasicsInfo',{
                    startDate:startTime,
                    endDate:endtime,
                    vehicleId:type==0 ? this.choseIds.join(","):this.vehicleSigId,
                    type:type
                });
                window.location.href=getExcel;
            }
          }else{
            this.$message.error({ message: this.$t('请选择时间') });
          }


        },
        dataForm(row){
          return this.$filter.toFixed(row.endEngineFuel,2)
          // console.log(row)
        }
    },
     watch: {
       //监听左侧车辆树的变
     '$store.getters.ptMultiCar'(newVal){
			this.choseCar = newVal;
      let choseIDS=[];
      let choseNames=[];
      for(let i=0;i<newVal.length;i++){
        choseIDS.push(newVal[i].id);
        choseNames.push(newVal[i].plateCode);
      }
      this.choseIds=choseIDS;
      this.choseCarCode=choseNames;
      // console.log(this.choseIds)
		}
    },
    mounted() {
        //  this.vOptloadGrid();
        //  this.vOptDloadGrid();
    }
}
</script>
<style lang="scss">
.vehicleDriveOperation {
    .el-table .el-tooltip.cell {
        text-align: center;
    }
}
</style>
