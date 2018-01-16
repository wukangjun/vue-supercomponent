<template>
    <div id="body" v-show="hent">
        <div class="head">
            提示时间
             <el-select v-model="value" clearable :placeholder="$t('terminal.placeholder')" size='small' id="change"  style="width:120px;height:20px;">
				<el-option v-for="item in filterTime" :key="item.id" :label="item.label" :value="item.id" >
			</el-option>
			</el-select>
        <a @click="confirm" class="confirm">{{$t('action.confirm')}}</a>
        <cv-icon name="remove" 
        color="#fff"
        @click.native="nowClosed()" 
        style="float:right;margin-top:7px"></cv-icon>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick"> 
        <el-tab-pane  name="first">
            <span slot="label">
                {{$t('common.alarm.serious')}}
            	<el-badge :value="serNum" :max="99" style="cursor:pointer">	
			</el-badge>
            </span>
            <el-table :data="serious" class="main" height="200">
            <el-table-column :label="$t('vgPower.plateCode')" prop="plateCode" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('common.alarm.alarmTypeName')" prop="alarmTypeName" min-width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('common.alarm.messageText')" prop="messageText" min-width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('common.alarm.time')" prop="time" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('action.operation')" width='109'>
                <template scope="scope">
              <el-button @click="HandelEvent(scope)" style="border:none;background:none" type="text" v-loading="scope.row.idp==1?true:false">确认</el-button>
                </template>
            </el-table-column>
            </el-table>
      
        </el-tab-pane>
        <el-tab-pane  name="general"> 
              <span slot="label">
              {{$t('common.alarm.intermediate')}}
            <el-badge :value="intNum" :max="99" style="cursor:pointer">	
			</el-badge>
              </span>
            <el-table :data="intermediate" class="main" height="200">
            <el-table-column :label="$t('vgPower.plateCode')" prop="plateCode" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('common.alarm.alarmTypeName')" prop="alarmTypeName"  min-width="100"  :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('common.alarm.messageText')" prop="messageText"   min-width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('common.alarm.time')" prop="time" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('action.operation')" width='109'>
                <template scope="scope">
                    <el-button @click="HandelEvent(scope)" style="border:none;background:none" type="text" v-loading="scope.row.idp==1?true:false">确认</el-button>
                </template>
            </el-table-column>
        </el-table>
        </el-tab-pane>
         <el-tab-pane  name="third"> 
               <span slot="label">
                {{$t('common.alarm.ordinary')}}
            	<el-badge :value="ordNum" :max="99" style="cursor:pointer">	
			</el-badge>
            </span>
            <el-table :data="ordinary" class="main" height="200">
            <el-table-column :label="$t('vgPower.plateCode')" prop="plateCode" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('common.alarm.alarmTypeName')" prop="alarmTypeName"  min-width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('common.alarm.messageText')" prop="messageText" min-width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('common.alarm.time')" prop="time" width="100" :show-overflow-tooltip="true"></el-table-column>
             <el-table-column :label="$t('action.operation')" width='109'>
                <template scope="scope" >
                    <el-button @click="HandelEvent(scope)" style="border:none;background:none" type="text" v-loading="scope.row.idp==1?true:false" v-show="scope.row.action=='1'?true:false">确认</el-button>
                </template>
            </el-table-column>
            </el-table> 
            </el-tab-pane>      
         </el-tabs> 
         
    </div>
</template>
<script>
import { http, COMMON } from '@/utils'
export default {
    data() {
        return {
            filterTime: [
                { id: 1, label: '10秒' },
                { id: 2, label: '30秒' },
                { id: 3, label: '10分钟' },
                { id: 4, label: "暂时关闭" }
            ],
            data: {},
            value: 4,
            waring: true,
            closeLong: false,
            cont: 1,
            show: true,
            hent: false,
            music: false,
            isActive: false,
            timeInterval: null,
            laterTime: null,
            activeName: 'third',
            serNum: 0,
            intNum: 0,
            ordNum: 0,
            onlineNum:0,
            //定义报警类型的初始值
            serious: [],
            serious1: [],
            intermediate: [],
            ordinary: [],
            //表格内部显示字段
            plateCode: '',
            alarmTypeId: '',
            gpsdeep: '',
            deep: '',
            time: '',
            socket: null,
            alarmNum: 0,
            directive: [],
            online: [],
            //数据
            nameS: '',
            data1: [],
            data2: [],
            data3: []
        }
    },
    methods: {
        // 处理指令操作
        // async HandleEvent(scope){
        //    this.loading=true;
        //     const { data, flag } = await this.$http({     
        //         url: COMMON.baseUrl + '/sendOrder/alarmNotarize',
        //         params: {sim:scope.row.simCode}
        //     });
        //     flag ? this.$message.success(this.$t('action.noticeSuccess')) :
        //     this.$message.error(this.$t('action.noticeFail'));
        //     this.loading=false;
        // }, 
    handleClick(tab,event){
    // console.log(document.getElementsByClassName('main')[0].style)
        },
        HandelEvent(scope, data) {
            scope.row.idp = 1;
            let params = {
                sim: scope.row.simCode,
                serialNumber: scope.row.serialNumber,
                alarmTypeId: scope.row.alarmTypeId
            }
            this.$http({ url: COMMON.baseUrl + '/sendOrder/alarmSingleNotarize', method: 'POST', params: params }).then((data) => {
                if (data.flag) {
                    this.$message.success(this.$t('action.noticeSuccess'));
                } else {
                    this.$message.error(this.$t('action.noticeFail'));
                }
                scope.row.idp = 0;
            })

        },
        confirm() {
            switch (this.value) {
                case 1:
                    this.timeShow();
                    break;
                case 2:
                    this.longShow();
                    break;
                case 3:
                    this.tenShow();
                    break;
                case 4:
                    this.closed();
                    break;
                default:
                    break
            }
        },
        nowClosed() {
            this.hent = false;
        },
        clearInterval() {
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        },
        closed() {
            this.createDom();
            this.closeLong = true;
            this.clearInterval();
        },
        controncl(time) {
            this.clearInterval();
            this.createDom();
            this.timeInterval = setInterval(() => {
                this.domShow();
            }, time)
        },
        timeShow() {
            this.controncl(15000);
        },
        longShow() {
            this.controncl(30000);

        },
        tenShow() {
            this.controncl(600000);
        },
        getIndex(id) {
            let commands = this.directive;
            for (let i = 0; i < commands.length; i++) {
                if (commands[i].id == id) {
                    return { flag: true, index: i };
                }
            }
            return { flag: false, index: -1 };
        },
        domShow() {
            let $body = document.getElementById('body');
            return $body.style.display = "block";

        },
        createDom() {
            let $body = document.getElementById('body');
            return $body.style.display = "none";

        },
        arrSplice(arr, data) {
            if (arr.length <= 50) {
                arr.unshift(data);
            } else {
                arr.unshift(data);
                arr.pop();
                return arr;
            }
        },
        outTime() {
            let token = localStorage.getItem("token");//登录之后,取token的值
            let user = localStorage.getItem("user");
            if (user == "" || user == null) {
                return false
            }
            let userId = JSON.parse(user).id.toString();
            if (token) {
                let socket = io(this.$COMMON.socketUrl, {
                    query: {
                        "token": token,
                        "userId": userId
                    }
                });
                socket.on('connect', function() {
                    console.log('连上了')
                });
                //到时候改回t1暂时用A来测试；
                socket.on('t1', mess => {  
                    let data = null;
                    if(typeof mess === 'string'){
                        data = JSON.parse(mess);
                    }else{
                        data = mess;
                    }
                    this.hent = true;
                    data.idp = 0;
                    switch (data.msgType) {
                        case "W":
                            //this.directive.unshift(data);
                            this.$store.dispatch('addDirective', this.directive);
                        break;
                        // 上下线统计
                        case "O":
                            this.onlineNum++;
                            this.$store.dispatch('onlineList',data);
                            this.$store.dispatch('onlineNub',this.onlineNum);
                            break;
                        // 企业和车组
                        case "ENTERPRISE_FLEET_MSG": return this.$store.dispatch('socketIsManage', data);
                        // 车辆
                        case "VehicleMsg": return this.$store.dispatch('socketIsVehicle', data);
                        // 关注车辆
                        case "attentionMsg": return this.$store.dispatch('isAttention',data);
                    };
                    switch (data.alarmLevel){
                        case "0":
                            this.serNum++;
                            this.arrSplice(this.serious, data);
                            break;
                        case "1":
                            this.intNum++;
                            this.arrSplice(this.intermediate, data);
                            break;
                        case "2":
                            this.ordNum++;
                            this.arrSplice(this.ordinary, data);
                            break;
                    };
                });
                socket.on('disconnect', data => {
                    console.log('连接断开')
                });
                return this.socket = socket;
            };
        },


    },
    mounted() {
        this.outTime();
    },
    destroyed() {
        this.timeInterval && (clearInterval(this.timeInterval), this.timeInterval = null);
        this.socket && this.socket.disconnect();
    }

}

</script>
<style lang="scss">
#body {
    font-family: '微软雅黑';
    background:#fff;
    position: absolute;
    z-index: 2001;
    right: 10px;
    bottom: 10px;
    width:510px;    
    .el-tabs__header{
        margin: 0;
    }
    .el-checkbox-button__original, .el-pagination--small .arrow.disabled, .el-table .hidden-columns, .el-table td.is-hidden>*, .el-table th.is-hidden>*, .el-table--hidden{
        visibility: visible !important;
    }
    .el-table thead{
        width:100%;
    }
    .el-table__body-wrapper{
         overflow-x:hidden; 
    }
    .head{
        background:#F7BA2A;
        height:30px;
        padding:5px 20px; 
    }
    .right{
        margin-left:300px;
        cursor:pointer;
    }
    #chang{
        position:absolute;
        z-index:999;    
    }
    .el-table__body, .el-table__header{
        width:489px !important;  
          
    } 
    
    .confirm{
        width:40px;
        height:30px;
        cursor:pointer;
    }
    .time{
        display:inline-block;
        margin-left:20px;
        height:30px;
        width:40px;
        font-size:28px;
    }
    .later {
        position:absolute;
        left:200px;
    }
    .show{
        cursor:pointer;
        margin-left:400px;
      
    }
    .closed {
        cursor:pointer
    }
 
}
</style>


