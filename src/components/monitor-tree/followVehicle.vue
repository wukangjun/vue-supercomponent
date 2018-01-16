<template>
    <div class="cv-treeFollow">
        <cv-scrollbar class="treeFollow-cont" v-loading="data.loading">
            <el-checkbox-group v-model="data.checks" ref='iconTreeFollow'>
                <li  v-if="double" v-for="(list, index) in data.lists" class="treeFollow-li">
                    <el-checkbox  
                    ref="checkbox"
                    @change="checkChange($event, list)" 
                    :key="list.id" 
                    :label="list.id"></el-checkbox>
                    <div class="clickArea" @click="checked(index, list)">
                        <cv-icon name="cheliang1" size="18" :color="list.onlineStatus=='1'?'#1bca22':''" 
                        style="vertical-align:sub" ref='list'></cv-icon>
                        <span style="display:inline-block " class='plateCodeText showText'
                        @mouseenter="handleCellMouseEnter($event, list)"
					@mouseleave="handleCellMouseLeave" >{{list.plateCode}}</span>
                    </div>
                    <span  style="display:inline-block " class='iptext showText'  ref='spanText'
                    @mouseenter="handleCellMouseEnter($event, list)"
					@mouseleave="handleCellMouseLeave" >
                        {{list.alias}}
                    </span>
                    <el-input v-model="list.alias" class='iptext' size="small"   style="display:none;" ref='inputTexts' @blur="noneIpt(index,list)" @keyup.native.enter="noneIpt(index,list)" :maxlength="20"></el-input>
                    <i   class="el-icon-edit trackIcon" style='right:30px;color:#bfbfbf;font-size:16px;' ref='editIcon' @click="editText(index,list)" data-flag='false'></i>
                    <i   class="el-icon-delete trackIcon" style="color:#bfbfbf;font-size:16px;" @click="delLi(index,list,data)"></i>
                    <!-- <cv-icon v-if="true" name="guiji3" class="trackIcon" @click.native.prevent="trackBtn(list)"></cv-icon> -->
                </li>
                <!-- <el-checkbox v-if="double" v-for="list in data.lists" @change="checkChange($event, list)" :key="list.id" :label="list.id">
                    <cv-icon name="cheliang1" size="18" :color="list.onlineStatus=='1'?'#1bca22':''" style="vertical-align:sub"></cv-icon>
                    {{list.plateCode}}
                    <icon v-if="true" name="level-up" class="trackIcon" @click.native.prevent="trackBtn(list)"></icon>
                </el-checkbox> -->
            </el-checkbox-group>
            <li ref="single" v-if="!double" v-for="(list, index) in data.lists" :key="list.id" :label="list.id" class="treeFollow-item" @click="singleEvent(list, index)">
                <cv-icon name="cheliang1" size="18" :color="list.onlineStatus=='1'?'#1bca22':''" 
                        style="padding-left:10px;vertical-align:sub" ref='list'></cv-icon>
                <span class="list-check plateCodeText showText" style="display:inline-block "
                    @mouseenter="handleCellMouseEnter($event, list)"
					@mouseleave="handleCellMouseLeave">{{list.plateCode}}</span>
                <span  style="display:inline-block; width:140px;" class='iptext showText'  ref='spanText'
                    @mouseenter="handleCellMouseEnter($event, list)"
					@mouseleave="handleCellMouseLeave" >
                        {{list.alias}}
                    </span>
                    <el-input v-model="list.alias" class='iptext' size="small"   style="display:none;left:80px;width:140px" ref='inputTexts' @blur="noneIpt(index,list)" @keyup.native.enter="noneIpt(index,list)" :maxlength="20"></el-input>
                    <i   class="el-icon-edit trackIcon" style='right:30px;color:#bfbfbf;font-size:16px;' ref='editIcon' @click="editText(index,list)" data-flag='false'></i>
                    <i   class="el-icon-delete trackIcon" style="color:#bfbfbf;font-size:16px;" @click="delLi(index,list,data)"></i>
            </li>
            <el-tooltip 
				:content="tooltipContent" 
				placement="top" 
				ref="tooltip" 
				effect="light"></el-tooltip>
        </cv-scrollbar>
        <el-pagination small layout="prev, pager, next" :page-size="data.search.size" :total="data.search.total" @current-change="handleCurrentChange" ></el-pagination>
    </div>
</template>
<script>
export default {
    props: {
        data:{},
        updataList:{},
        double:{}
    },
    data(){
        return{
            tooltipContent:'',
            editTextIdx:null,
        }
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
        delLi(index,list,_data){
            event.stopPropagation();
            event.preventDefault();
            this.$confirm('是否取消对该车辆的关注', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                _data.loading=true;
                this.$store.dispatch('deleteVehicleAttentionInfo', {vehicleId:list.id}).then((data) => {
                    if(data.flag){
                        this.$emit('delFollowList');
                        this.$message.success("取消关注成功");
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
           
        },
        editText(idx){
            event.stopPropagation();
            event.preventDefault();
            let _ipt = this.$refs['inputTexts'][idx].$el;
            let _span = this.$refs['spanText'][idx].$el;
            let editIcon =this.$refs['editIcon'][idx];
            // console.log("1."+editIcon.dataset.flag)
            // console.log("1."+idx)
            if(editIcon.dataset.flag=="false"){
                editIcon.dataset.flag="true";
                //  console.log("2."+editIcon.dataset.flag)
                this.$myJq.css(_ipt,"display","inline-block");
                this.$myJq.css(_span,"display","none");
                this.$refs['inputTexts'][idx].$refs.input.focus();
            }else{
                 this.$refs['inputTexts'][idx].$refs.input.focus();
            }
        },
        noneIpt(idx,list){
            let _ipt = this.$refs['inputTexts'][idx].$el;
            let _span = this.$refs['spanText'][idx].$el;
            let editIcon =this.$refs['editIcon'][idx];
            this.editTextIdx=idx;
            // console.log("3"+idx)
            this.$myJq.css(_span,"display","inline-block");
            this.$myJq.css(_ipt,"display","none");
            this.$store.dispatch('insertVehicleAttentionInfo', {vehicleId:list.id,alias:list.alias}).then((data) => {
                if(data.flag){
                    this.$message.success("备注信息修改成功");
                }else{
                    this.$emit('delFollowList');
                    this.$message.error(this.$t('error.'+data.errorCode));
                }
                editIcon.dataset.flag="false";
                    // console.log("3."+editIcon.dataset.flag)
            }).catch(() =>{
                this.$myJq.css(_span,"display","inline-block");
                this.$myJq.css(_ipt,"display","none");
                this.$message.error("网络错误");
            });
            
        },
        // 移入是否显示el-tooltip
        handleCellMouseEnter(event, list){
            const target = event.target;
            if(target.scrollWidth > target.offsetWidth){
                const tooltip = this.$refs.tooltip;					
                this.tooltipContent = target.innerText;
                tooltip.referenceElm = target;
                tooltip.$refs.popper.style.display = 'none';
                tooltip.doDestroy();
                tooltip.setExpectedState(true);
                tooltip.handleShowPopper();	
            }	
        },
        handleCellMouseLeave(){
            const tooltip = this.$refs.tooltip;
            if (tooltip) {
                tooltip.setExpectedState(false);
                tooltip.handleClosePopper();
            }
        }


    }
}
</script>
<style lang="scss">
$multiH: 500px; 
.cv-treeFollow{
    .treeFollow-cont{
        position: absolute;
        width: 100%;
        bottom: 40px;
        top:130px;
        // margin-top: 40px;
        // height: $multiH - 175px;
        .treeFollow-li{
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
        .treeFollow-item{
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
    .el-pagination{ 
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
    .iptext{
        position: absolute;
        width:105px;
        top:0px;
        left: 130px;
        color:rgb(157,158,160);
    }
    .plateCodeText{
        position: absolute;
        width:60px;
        top:0px;
    }
    .showText{
         text-overflow:ellipsis;
         white-space:nowrap;
         overflow: hidden;
    }
}
</style>
