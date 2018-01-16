<template>   
    <cv-scrollbar class="cv-treelist" v-loading="data.loading">
        <el-checkbox-group v-model="data.checks">
            <li  v-if="double" v-for="(list, index) in data.lists" class="carList-li">
                <el-checkbox  
                ref="checkbox"
                @change="checkChange($event, list)" 
                :key="list.id" 
                :label="list.id"></el-checkbox>
                <div class="clickArea" @click="checked(index, list)">
                    <cv-icon name="cheliang1" size="18" :color="list.onlineStatus=='1'?'#1bca22':''" 
                    style="vertical-align:sub" ref='list'></cv-icon>
                    <span>{{list.plateCode}}</span>
                </div>
            </li>
        </el-checkbox-group>
        <li ref="single" v-if="!double" v-for="(list, index) in data.lists" :key="list.id" :label="list.id" class="carList-item" @click="singleEvent(list, index)">
            <cv-icon name="cheliang1" size="18" :color="list.onlineStatus=='1'?'#1bca22':''"
             style="vertical-align:sub;padding-left:10px" ref='list'></cv-icon>
            <span class="list-check">{{list.plateCode}}</span>
        </li>
        <el-pagination small layout="prev, pager, next" :page-size="data.search.size" :total="data.search.total" @current-change="handleCurrentChange"></el-pagination>
    </cv-scrollbar>     
</template>
<script>
export default {
    props: {
        data:{},
        double:{}
    },
    components: {

    },
    mixins: [''],
    watch:{
        // 监听车辆上下线
        '$store.getters.onlineList'(newVal){
            this.upListIcon(newVal);
        }
    },
    methods: {
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
        }
    }
}
</script>
<style lang="scss">
$multiH: 500px; 
.cv-treelist{
    position: absolute;   
    bottom: 0;
    width: 100%;
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
                    background: #d4d2d2
                }
            }
        }
        .el-checkbox{
            width: 30px;
            overflow: hidden; 
            margin-left: 0;
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
            border-bottom: 1px solid #d1dbe5;
            cursor: pointer;
            &:hover{
                background: #ebebeb
            }
            .list-check{
                margin-left: 10px;
            }
        }
        .el-pagination{        
        .btn-prev,
        .btn-next{
            padding-top:4px;
        }
        .el-pager li{
            padding: 0 1px;
        }
    }
}
</style>
