<template>
    <div class="vp-add">
        <el-row>
            <!-- 左边表格 -->
            <el-col :span="10" style="width:44.66667%">
                <el-form>
                    <el-form-item :label="options.enterpriseName + $t('vgPower.vall')">
                        <el-input
                        :placeholder="$t('vgPower.typePlateCode')"
                        icon="search"
                        v-model.trim="gridL.plateCode"
                        :on-icon-click="handleIconClickL"
                        :maxlength='30'
                        ></el-input>
                    </el-form-item>
                </el-form>
                <cv-grid :options="gridL.options" @load="listL">
                    <el-table border stripe height=280 :data="gridL.table" v-loading="gridL.loading" @selection-change="handlerChange">
                        <el-table-column type="selection" width="50" :show-overflow-tooltip="true" ></el-table-column>
                        <el-table-column :label="$t('vgPower.vg')" prop="fleetName" :show-overflow-tooltip="true" ></el-table-column>
                        <el-table-column :label="$t('vgPower.plateCode')" :show-overflow-tooltip="true" prop="plateCode"></el-table-column>
                    </el-table>
                </cv-grid>
            </el-col>
            <!-- 中间绑定按钮 -->
            <el-col :span="2" style="text-align:center;margin:200px 10px 0 10px;">
                <el-button :loading="loadFlag" @click="addClick">{{$t('vgPower.add')}}</el-button>
            </el-col>
            <!-- 右边表格 -->
            <el-col :span="10" style="width:44.66667%">
                <el-form>
                    <el-form-item :label="options.vgName + $t('vgPower.v')">
                        <el-input
                        :placeholder="$t('vgPower.typePlateCode')"
                        icon="search"
                        v-model.trim="gridR.plateCode"
                        :on-icon-click="handleIconClickR"
                        :maxlength='30'
                        ></el-input>
                    </el-form-item>
                </el-form>
                <cv-grid :options="gridR.options" @load="listR">
                    <el-table border stripe height=280 :data="gridR.table" v-loading="gridR.loading">
                        <el-table-column type="selection" width="50"></el-table-column>
                        <el-table-column :label="$t('vgPower.plateCode')" prop="plateCode"></el-table-column>
                    </el-table>
                </cv-grid>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import prots from './index.js'
   export default{
        props:{
            options:{}
        },
        mixins:[prots],
        data(){
            return{
                loadFlag:false,
                //左边表格数据
                gridL:{
                    options:{
                        current:1,
                        size:10,
                        total:0
                    },
                    loading:false,
                    table:[],
                    loading:false,
                    fleetId:this.options.fleetId,
                    plateCode:'',
                    enterpriseId:this.options.enterpriseId,
                    multipleSelection:[]
                },
                // 右边表格数据
                gridR:{
                    options:{
                        current:1,
                        size:10,
                        total:0
                    },
                    loading:false,
                    table:[],
                    fleetId:this.options.fleetId,
                    plateCode:''
                }
            }
        },
        methods:{
            //公司下所有车辆
            listL(){
                let params = {
                    fleetId:this.gridL.fleetId,
                    enterpriseId:this.gridL.enterpriseId,
                    current:this.gridL.options.current,
                    size:this.gridL.options.size,
                    plateCode:this.gridL.plateCode
                }
                this.gridL.loading = true;
                this.findNoAuthorizeVehicleforPage(params).then(data=>{
                    if(data.flag){
                        if(data.data.length !== 0){
                            this.gridL.options.total = data.data.total;
                            this.gridL.table = data.data.records;
                        }else{
                            this.gridL.options.total = 0;
                            this.gridL.table = data.data;
                        }
                    }else{
                        this.gridL.options.total = 0;
                        this.gridL.table = [];
                    }
                    this.gridL.loading = false; 
                })
            },
            //当前车组车辆
            listR(){
                let params = {
                    current:this.gridR.options.current,
                    size:this.gridR.options.size,
                    fleetId:this.gridR.fleetId,
                    plateCode:this.gridR.plateCode
                }
                this.gridR.loading = true;
                this.findVehicleByFleetIdforPage(params).then(data=>{
                   if(data.flag){
                        if(data.data.length !== 0){
                            this.gridR.options.total = data.data.total;
                            this.gridR.table = data.data.records;
                        }else{
                            this.gridR.options.total = 0;
                            this.gridR.table = data.data;
                        }
                   }else{
                         this.gridR.options.total = 0;
                         this.gridR.table = [];
                   }
				   this.gridR.loading = false;
                })
            },
            //icon搜索点击L
            handleIconClickL(ev){
                this.listL()
            },
            //icon搜索点击R
            handleIconClickR(ev){
                this.listR()
            },
            //多选行
            handlerChange(val){
                this.gridL.multipleSelection = [];
                val.forEach( item =>{
                    this.gridL.multipleSelection.push(item.id);   
                });
            },
            //添加按钮
            addClick(){
                if(this.gridL.multipleSelection.length !== 0){
                    let params = {
                        vehicleIds:this.gridL.multipleSelection.join(","),
                        fleetId:this.gridL.fleetId,
                        enterpriseId:this.gridL.enterpriseId
                    }                
                    this.loadFlag = true;
                    this.addFleetVehicle(params).then(data=>{
                        if(data.flag){
                            this.$message.success(this.$t('vgPower.bindSuccess'));
                            this.gridL.plateCode = '';
                            this.gridR.plateCode = '';
                            this.listL();
                            this.listR();
                            this.$emit('confirm');
                            this.loadFlag = false
                        }else{
                            this.$message.error(this.$t('vgPower.bindError'));
                            this.loadFlag = false
                        }
                    }).catch(_=>{
                        this.loadFlag = false;
                    })
                }else{
                    this.$message.error(this.$t('vgPower.choseVehicle'));
                }
            }
        },
        //监听弹框，每次弹框消失后重置弹框(仅限弹框内容绑定的是弹框内部数据，而不是options传入的)
        watch:{
            'options.flag'(newVal){
                if(!newVal){
                    this.options.name = "";
                }
            }
        },
        //页面加载完成后执行
        mounted(){
            this.listL();
            this.listR();
		}
   }
</script>

<style lang="scss">

</style>