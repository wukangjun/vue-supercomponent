<template>
<div class="bindVehicle">
    <div class="left">
        <public-tree ref='spmtree' style="display:block;top:0;"></public-tree>
    </div>
    <div class="mid">
        <el-button @click.native="bind" :loading="bindFlag">绑定></el-button>
        <el-button @click.native="unbind" :loading="unbindFlag">解绑<</el-button>
    </div>
    <cv-scrollbar class="right">
        <el-checkbox-group v-model="checkList">
            <li class="bind-li" v-for="li in arrList" :key="li._id">
                <el-checkbox :label="li.vehicleId">{{li.plateCode}}</el-checkbox>
                <!-- <div class="clickArea" @click="check">
                    <span>{{li.pcode}}</span>
                </div> -->
            </li>
        </el-checkbox-group>
    </cv-scrollbar>
</div>
</template>
<script>
import publicTree from "@/components/public-tree/public.tree.vue";
import prot from './index.js'
export default {
    props:{
        options:{}
    },
    components: {
        publicTree
    },
    mixins: [prot],
    data() {
        return {
            checkList:[],
            isCheck:false,
            arrList:[],
            selectIds:'',
            delSelectIds:'',
            tempArrList:[],
            bindFlag:false,
            unbindFlag:false
        };
    },
    methods: {
        getList(){
            let params = {
                groupId:this.options.bindVehicle.id
            }
            this.findVehiclePlatInfoList(params).then(data=>{
                if(data.flag){
                    this.arrList = data.data;
                }
            })
        },
        bind(){
            if(this.selectIds.length == 0){
                this.$message.warning({message:this.$t('请选择绑定车辆')});
                return false;
            }
            let params = {
                groupId:this.options.bindVehicle.id,
                vehicleIds:this.selectIds.join(',')
            }
            this.bindFlag = true;
            this.insertVehicleAttachPlatBeanListInfo(params).then(data=>{
                if(data.flag){
                    this.$message.success({message:this.$t('绑定成功')});
                    this.$refs['spmtree'].cancelChecked()
                    this.getList();
                    this.selectIds = [];
                    this.bindFlag = false;
                }else{
                    this.$message.error({message:this.$t('error.'+data.errorCode)});
                    this.bindFlag = false;
                }
            }).catch(_=>{
                this.bindFlag = false;
            })
        },
        unbind(){
            if(this.delSelectIds.length == 0){
                this.$message.warning({message:this.$t('请选择解绑车辆')});
                return false;
            }
            let params = {
                groupId:this.options.bindVehicle.id,
                vehicleIds:this.delSelectIds.join(',')
            }
            this.unbindFlag = true;
            this.delProtocolTransferVehicleInfo(params).then(data=>{
                if(data.flag){
                    this.$message.success({message:this.$t('解绑成功')});
                    this.unbindFlag = false;
                    this.delSelectIds = [];
                    this.checkList = [];
                    this.getList();
                }else{
                    this.$message.error({message:this.$t('error.'+data.errorCode)});
                    this.unbindFlag = false;
                }
            }).catch(_=>{
                this.unbindFlag = false;
            })
        },
        check(){
        },
        checkbox(){
            this.isCheck = !this.isCheck;
        }
    },
    mounted(){
        this.getList()
    },
    watch:{
       '$store.getters.ptMultiCar'(newVal){
            let checkedVid = [];
            newVal.forEach(ele => {
                checkedVid.push(ele.id)
            });
            this.selectIds = checkedVid;
        },
        'checkList'(newVal){
            this.delSelectIds = newVal
        },
        'options.bindVehicle.id'(newVal){
            this.getList();
        }
    }
};
</script>
<style lang="scss">
.bindVehicle {
    .left {
        display: inline-block;
        position: relative;
        width: 310px;
        height: 500px;
        box-sizing: border-box;
        margin-left: 60px;
        .cv-public-tree {
            border-left: 1px solid #ccc;
        }
        .el-input-group__prepend {
            border-left: 0;
        }
        .toggleIcons {
            display: none;
        }
    }
    .mid {
        display: inline-block;
        position: relative;
        width: 120px;
        height: 490px;
        vertical-align: top;
        box-sizing: border-box;
        .el-button {
            float: left;
            margin-left: 20px;
        }
        .el-button:first-child {
            margin-top: 180px;
        }
        .el-button+.el-button {
            margin-top: 30px;
        }
    }
    .right {
        vertical-align: top;
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        border: 1px solid #ccc;
        box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
        width: 300px;
        height: 490px;
        .bind-li {
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #ccc;
            clear: both;
            position: relative;
            cursor: pointer;
            &:hover {
                background: #ebebeb
            }
            .clickArea {
                margin: 0 35px;
            }
            .trackIcon {
                position: absolute;
                right: 0;
                top: 0;
                padding: 12px;
                &:hover {
                    background: #d4d2d2
                }
            }
        }
        .el-checkbox{
                position: absolute;
                left:5px;
                right: 0;
            }
    }
}
</style>
