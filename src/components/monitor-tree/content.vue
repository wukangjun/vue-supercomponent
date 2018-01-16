<template>
    <div class="cv-treelist">
        <cv-scrollbar class="carList-cont" v-loading="data.loading">
            <el-checkbox-group v-model="data.checks" ref='iconCarList'>
                <li  
                    v-if="double" 
                    :key="list.id" 
                    v-for="(list, index) in data.lists" 
                    class="carList-li">
                    <el-checkbox  
                    ref="checkbox"
                    @change="checkChange($event, list)" 
                    :label="list.id"></el-checkbox>
                    <div class="clickArea" @click="checked(index, list)">
                        <cv-icon name="cheliang1" size="18" :color="list.onlineStatus=='1'?'#1bca22':''" 
                        style="vertical-align:sub" ref='list'></cv-icon>
                        <span>{{list.plateCode}}</span>
                    </div>
                     <cv-icon  name="shoucang1" class="trackIcon"  size="18" ref='shoucangs' :color="list.isAttention=='0' ? '#bfbfbf' : '#1296db'" 
                        @click.native="changeCarPitc(index,list,data)"></cv-icon>
                    <!-- <cv-icon v-if="true" name="guiji3" class="trackIcon" @click.native.prevent="trackBtn(list)"></cv-icon> -->
                </li>
                <!-- <el-checkbox v-if="double" v-for="list in data.lists" @change="checkChange($event, list)" :key="list.id" :label="list.id">
                    <cv-icon name="cheliang1" size="18" :color="list.onlineStatus=='1'?'#1bca22':''" style="vertical-align:sub"></cv-icon>
                    {{list.plateCode}}
                    <icon v-if="true" name="level-up" class="trackIcon" @click.native.prevent="trackBtn(list)"></icon>
                </el-checkbox> -->
            </el-checkbox-group>
            <li ref="single" v-if="!double" v-for="(list, index) in data.lists" :key="list.id" :label="list.id" class="carList-item" @click="singleEvent(list, index)">
                <cv-icon name="cheliang1" size="18" :color="list.onlineStatus=='1'?'#1bca22':''" 
                        style="padding-left:10px;vertical-align:sub" ref='list'></cv-icon>
                <span class="list-check">{{list.plateCode}}</span>
                <cv-icon  name="shoucang1" class="trackIcon"  size="18" ref='shoucangs' :color="list.isAttention=='0' ? '#bfbfbf' : '#1296db'" 
                        @click.native="changeCarPitc(index,list,data)"></cv-icon>
            </li>
        </cv-scrollbar>
        <el-pagination class="monitorPagination" small layout="prev, pager, next" :page-size="data.search.size" :total="data.search.total" @current-change="handleCurrentChange"></el-pagination>
    </div>
</template>
<script>
export default {
    props: {
        data:{},
        updataList:{},
        double:{}
    },
    mixins: [''],
    watch:{
        // 监听车辆上下线
        '$store.getters.onlineList'(newVal){
            this.upListIcon(newVal);
        }
    },
    methods: {
        checkChange(event,list){
            this.$emit('change', {event: event, list: list});
        },
        trackBtn(val){
            this.$emit('clickNativePrevent', val);
        },
        singleEvent(list,index){
            this.$emit('click', {list: list, index: index, single: this.$refs['single']});
        },
        handleCurrentChange(val){
            this.$emit('currentChange', val);
        },
        checked(index, list){
            this.$emit('already', this.$refs['checkbox'][index], list);
        },
        upListIcon(item){
            if(this.$service.isArray(this.data.lists) && this.data.lists.length > 0){
                this.data.lists.forEach((val, index) => {
                    if(item.plateCode == val.plateCode){
                        item.messageText === '上线' 
                        ? this.$refs['list'][index].color = "#1bca22"
                        : this.$refs['list'][index].color = "";
                    }
                })
            }          
        },
        changeCarPitc(index,list,_data){
            event.stopPropagation();
            event.preventDefault();
            let color = this.$refs['shoucangs'][index].color;
            if(color == "#bfbfbf"){
                this.$prompt('关注备注信息', '关注确认', {
                    inputValue:list.alias,
                    inputPattern:/^.{0,20}$/,
                    inputErrorMessage:"备注长度不能超过20",
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({ value }) => {
                    let params={};
                    params.vehicleId=list.id;
                    params.alias=value;
                    _data.loading=true;
                    this.$store.dispatch('insertVehicleAttentionInfo', params).then((data) => {
                        if(data.flag){
                            // this.$refs['shoucangs'][index].color = "#1296db";
                            list.isAttention=1;
                            this.$emit('delFollowList');
                            this.$message.success("关注成功");
                        }else{
                            this.$message.error(this.$t('error.'+data.errorCode));
                        }
                        _data.loading=false;
                    }).catch(() =>{
                        _data.loading=false;
                        this.$message.error("网络错误");
                    })
                }).catch(() => {      
                });
            }else{
                let params={};
                params.vehicleId=list.id;
                _data.loading=true;
                this.$store.dispatch('deleteVehicleAttentionInfo', params).then((data) => {
                    if(data.flag){
                        this.$emit('delFollowList');
                        list.isAttention=0;
                        // this.$refs['shoucangs'][index].color = "#bfbfbf";
                        this.$message.success("取消关注成功");
                    }else{
                        this.$message.error(this.$t('error.'+data.errorCode));
                    }
                     _data.loading=false;
                }).catch(() =>{
                    _data.loading=false;
                    this.$message.error("网络错误");
                })
                
            }
        },

    }
}
</script>
<style lang="scss">
$multiH: 500px; 
.cv-treelist{
    top:129px;
    .carList-cont{
        position: absolute;
        width: 100%;
        top:0;
        bottom: 40px;
        // margin-top: 40px;
        // height: $multiH - 175px;
        .carList-li{
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #ccc;
            clear: both;
            position: relative;
            cursor: pointer;
            &:hover{
                background: #ebebeb
            }
            .clickArea{
                margin: 0 35px;
            }
            .trackIcon{
                position: absolute;
                right: 0;
                top: 0;
                padding: 12px;
                &:hover{
                    background: #d4d2d2;
                }
            }
        }
        .el-checkbox{
            width: 30px;
            overflow: hidden; 
            float: left;     
            .el-checkbox__input{
                padding-left: 10px
            }
            
        }
        .el-checkbox+.el-checkbox{
            margin: 0 !important;
        }
        .singleBg{
            background: #ebebeb
        }
        .carList-item{
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #ccc;
            clear: both;
            position: relative;
            cursor: pointer;
            &:hover{
                background: #ebebeb
            }
            .list-check{
                margin-left: 10px;
            }
             .trackIcon{
                position: absolute;
                right: 0;
                top: 0;
                padding: 12px;
                &:hover{
                    background: #d4d2d2;
                }
            }
        }
    }
    .monitorPagination{ 
        position: absolute;             
        bottom: 10px;
        .el-pager li{
            padding: 0 2px;
        }
        .btn-prev,
        .btn-next{
            padding-top:4px;
        }
    }
}
</style>
