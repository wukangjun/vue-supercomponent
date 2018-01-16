<template>
  <div class="videoBACK">
        <cv-scrollbar class="cvs">
         <div class="operateleftw">
          <el-form  label-width="90px">
            <el-form-item label="摄像头:">
                <el-select  v-model="cameraNum"  size="small" style="width:200px">
                  <el-option
                    v-for="item in camera"
                    :key='item.name'
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间:">
               <el-date-picker
                 v-model="operation.startTime"
                 type="datetime"
                 placeholder="选择开始时间"
                 style='width:200px;'
                 >
               </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间:">
               <el-date-picker
                 v-model="operation.endTime"
                 type="datetime"
                 placeholder="选择结束时间"
                 style='width:200px;'
                 >
               </el-date-picker>
               <el-button @click='SearchTodayRec()' type="primary" style='margin-left:15px;'>搜索</el-button>
             </el-form-item>
                <div class="showBox">
                <el-scrollbar
                  class="scroll-area"
                  tag="ul"
                  wrap-class="el-select-dropdown__wrap scrollSpecial"
                  view-class="el-select-dropdown__list">
                 <div   style='width:120px'></div>
                  <el-radio-group v-model="defaultR" @change="getChosetime" :disabled="radioFlag">
                    <el-radio
                      v-for="timeItem in timeArr"
                      :key="timeItem.fileName"
                      :label="timeItem.fileName+'~'+timeItem.sT+'~'+timeItem.eT"
                    >{{timeItem.cms+'~'+timeItem.cme}}
                    </el-radio>
                  </el-radio-group>
                  </el-scrollbar>
                </div>
                <div style="margin:20px 10px;">
                  <el-button @click='StartRemoteRecTimePlay()' :disabled='playBackFlag'>远程时间回放</el-button>
                  <el-button @click='StopRemoteRecPlay()' :disabled='stopBackFlag'>远程时间停止回放</el-button>
                  <!-- <el-button @click='RemoteRecPlayPause()'>{{IsParseName}}</el-button> -->
                </div>

                <div>
                 <!--  <el-button @click='RemoteRecPlayGetPos()'>获得回放的播放位置百分比</el-button>
                  <el-input v-model="getVideoPos" placeholder="显示获得的播放位置的百分比" style='width:120px'></el-input>
                  -->
               </div>
               <!-- <div>
                  <el-input v-model="setVideoPos" placeholder="设置播放位置的百分比" style='width:120px' ></el-input>
                  <el-button @click='RemoteRecPlayPause()'>设置位置百分比</el-button>
               </div> -->
                 <!-- <el-form-item>
                      <cv-icon :name="!playFlag ?'bofang':'zanting'"  size='23' style='cursor: pointer;position:absolute;top:10px;left:-50px;' @click='playVideo()' ></cv-icon>
                     <el-slider v-model="playProgress" style='width:250px;'  @change="dragEvent()"></el-slider>
                </el-form-item> -->


            </el-form>
          </div>
          <div class="onlyOne">
            <el-row>
                  <el-col :span="24">
                     <videoObject id='replayObject'></videoObject>
                  </el-col>
                </el-row>
          </div>
        </cv-scrollbar>
  </div>
</template>

<script type="text/javascript">
import videoObject from './videoObject.vue'
export default {
  components: {videoObject},
    data(){
      return{
         props: {
          options: {}
         },
         IsParseName:'远程时间暂停回放',
        cameraNum:'',
        camera:[
          {name:'摄像头1',value:0},
          {name:'摄像头2',value:1},
          {name:'摄像头3',value:2},
          {name:'摄像头4',value:3},
          ],
        type:'',
        typeArr:[
          {name:'时间',value:"0x1"},
          {name:'移动侦测',value:"0x2"},
          {name:'报警',value:"0x4"},
          {name:'手动',value:"0x8"},
          {name:'全部',value:"0x10"},
          ],
        operation: {
          time: '',
          startTime: "",
          endTime: "",
        },
        videoAccount:'',
        videoMess:'',
        timeArr:[],
        defaultR:'',
        choseStime:'',
        choseEtime:'',
        fileNm:'',
        szServerIP:'',
        nSeverPort:'',
        szUserName:'',
        szPassWord:'',
        deviceID:'',
        playBackFlag:true,
        stopBackFlag:true,
        radioFlag:false,
      }
    },
    methods:{
       //登陆的方法
      videoLogin(){
        // $("#TLMDvrAx").LoginStyle = 0;
        let szServerIP = this.szServerIP;
        let nSeverPort = this.nSeverPort;
        let szUserName = this.szUserName;
        let szPassWord = this.szPassWord;
        let nRet = this.getVideoDom('replayObject').LoginServer(szServerIP, nSeverPort, szUserName, szPassWord);
        console.log("这里是视频回放登陆返回"+nRet);
        if(nRet){
          this.getVideoDom('replayObject').ShowWndStyle=1;
           console.log("视频回放登陆成功");
        }else{
          this.$message.error('登陆失败！');
        }
      },
       //得到视频对象的DOM对象
      getVideoDom(item) {
            return document.getElementById(item)
      },
      //获得选择的时间段
      getChosetime(event){
         let paramsArr=event.split("~");
         this.choseStime = paramsArr[1];
         this.choseEtime =  paramsArr[2];
         this.fileNm = paramsArr[0];
      },
      //开始回放方法
      StartRemoteRecTimePlay(){
        this.radioFlag=true;
        let  DevId= this.deviceID;
        let chn = this.cameraNum;
        let val = this.getVideoDom('replayObject').StartRemoteRecFilePlay(DevId,this.fileNm, 0);
             if(val==0){
                this.getVideoDom('replayObject').SetDrawText(13,'回放成功');
             }else{
               this.$message.error({ message: this.$t("videoErrorCode."+val) });
             }
     },
      //求距离1/1/1970 00:00:00时间相差的秒数
      show_date_time(v_time){
        let BirthDay=new Date("1/1/1970 00:00:00");//起始日期
        let today=new Date(v_time);
        let timeold=(today.getTime()-BirthDay.getTime());
        let sectimeold=timeold/1000
        // let secondsold=Math.floor(sectimeold);
        // let msPerDay=24*60*60*1000
        // let  e_daysold=timeold/msPerDay
        // let daysold=Math.floor(e_daysold);
        // let e_hrsold=(daysold-e_daysold)*-24;
        // let hrsold=Math.floor(e_hrsold);
        // let e_minsold=(hrsold-e_hrsold)*-60;
        // let minsold=Math.floor((hrsold-e_hrsold)*-60);
        // let seconds=Math.floor((minsold-e_minsold)*-60);
        //  console.log(sectimeold,daysold*24*3600 + hrsold*3600 + minsold*60 + seconds);
         // return daysold*24*3600 + hrsold*3600 + minsold*60 + seconds;

         return sectimeold;
       },
        //停止回放
      StopRemoteRecPlay(){
        this.radioFlag=false;
         this.getVideoDom('replayObject').StopRemoteRecPlay();
      },
       //暂停/恢复回放   long 成功返回0，其余失败值见错误码
      RemoteRecPlayPause(){
         let val = 100;
         if(this.IsParseName=='远程时间暂停回放')
         {
             val =  this.getVideoDom('replayObject').RemoteRecPlayPause(1);
             if(val==0) //执行成功
                this.IsParseName=="远程时间恢复回放";
             else
                alert("执行失败，失败码："+val);
         }
         else
         {
             val =  this.getVideoDom('replayObject').RemoteRecPlayPause(0);
             if(val==0) //执行成功
                this.IsParseName=="远程时间暂停回放";
             else
                alert("执行失败，失败码："+val);
         }
     },
     //播放进度条的播放与暂停
     playVideo(){
      console.log("play");
     },
      //在当前激活窗口获取播放位置百分比
     RemoteRecPlayGetPos(){
           let val =  this.getVideoDom('replayObject').RemoteRecPlayGetPos();
           let str = (val*100).toString().split(".");
           let rel = str[0] +"%";
           this.getVideoPos = rel;//(val*100).toString().substring(0,3)+"%";
           console.log(val);
     },
      //在当前激活窗口设置播放位置百分比  long 成功返回0，其余失败值见错误码
     RemoteRecPlaySetPos(){
           let val = 1;
           let wz = document.getElementById("txtwz").value;
           if(wz!="")
           {
              if(wz.indexOf("%")>0)
                 wz = wz.substr(0,wz.length-1);
              let wzint = parseFloat(wz)/100;
              val =  document.getElementById("TLMDvrAx").RemoteRecPlaySetPos(wzint);

           }
           if(val!=0)
              alert("执行失败，失败码："+val);
     },
     //将通道数转换从二进制转换成十进制，如3相当于二进制”100“也就是2的3次方 十进制8
     translatenChnComb(cameraNum){
      let nChnComb=0;
      switch(cameraNum){
        case 0:return nChnComb=1;
        case 1:return nChnComb=2;
        case 2:return nChnComb=4;
        case 3:return nChnComb=8;
      }
      return nChnComb;
     },
     //搜索可以回放的文件
      SearchTodayRec(){
        let  DevId= this.deviceID;
         let chn = this.cameraNum;
         let type = "0x1";
        let nChnNum = parseInt(this.cameraNum);
        let StartTime = this.$filter.format(this.operation.startTime,'yyyy/MM/dd HH:mm:ss');
        let EndTime = this.$filter.format(this.operation.endTime,'yyyy/MM/dd HH:mm:ss');
        //这里查询回放文件的时间参数处理
        let stime = this.show_date_time(StartTime);
        let etime = this.show_date_time(EndTime);
        this.timeArr=[];
         if( chn==='' ){
          this.$message.error({ message: '请选择摄像头！' });
          return false;
        }
        if(this.operation.startTime>this.operation.endTime){
          this.$message.error({ message: '开始时间不能大于结束时间！' });
          return false;
        }
        if( this.operation.startTime ===''|| this.operation.endTime==='' ){
          this.$message.error({ message: '请先选择回放时间段！' });
          return false;
        }
        let nChnComb=this.translatenChnComb(nChnNum);
        let nRet = this.getVideoDom('replayObject').StartRemoteFileSearch(DevId,nChnComb, 0x10, stime, etime);
        this.videoAccount = "\n录像总数为" + nRet.toString();
        if(nRet.toString()=='0'){
          this.$message.error("暂无回放视频可以播放！");
          return false;
        }
        for (let i = 0; i < nRet; i++){
            let RecInfo = this.getVideoDom('replayObject').GetNextRemoteFileInfo(DevId);
            let recArr=RecInfo.split(" ");
            //开始时间结束时间的处理
            let startTime=parseInt(recArr[3].slice(10))-28800;
            let endTime=parseInt(recArr[4].slice(8))-28800;
            //文件名
            let filename=recArr[9].slice(9);
            //utc时间，用来当回放的参数
            let doDataS=new Date(parseInt(startTime*1000));
            let doDataE=new Date(parseInt(endTime*1000));
            //正常时间，用来显示的时间
            let CMstartTime = doDataS.toLocaleString();
            let CMendTime = doDataE.toLocaleString();
            this.timeArr.push({
              fileName:filename,
              sT:startTime,
              eT:endTime,
              cms:CMstartTime,
              cme:CMendTime});
          }
         this.playBackFlag=false;
         this.stopBackFlag=false;
     }
    },
    watch: {
    },
    mounted(){
      let loginData=JSON.parse(localStorage.getItem("VideologinData"));
      this.deviceID=loginData.dvrId;
      this.szServerIP=loginData.ip;
      this.nSeverPort=loginData.port;
      this.szUserName=loginData.username;
      this.szPassWord=loginData.password;
      this.videoLogin();
      this.operation.startTime='';
      this.operation.endTime='';
      this.cameraNum='';

    }
}
</script>
<style lang="scss">

  .videoBACK{
    input::-ms-clear{display: none;}

  .el-form-item__content{
    margin-left: 0;
  }
 .nav{
  margin:5px 0;
  button{
    width:100%;
  }
 }
 .el-date-editor.el-input{
  width:130px;
 }
 .showTime{
  height:300px;
  border-top:1px solid #000;
 }
 .playOperate{
  height:120px;
  border-top:1px solid #000;
 }
 .radioStyle{
  height:25px;
  line-height: 25px;
 }
 .showBox{
  width:380px;
  height:300px;
  border:1px solid #eee;
}
 .operateleftw{
  width:400px;
  float: left;
 }
 .el-radio-group .el-radio{
  margin-left: 15px;
 }
 .el-select-dropdown__wrap{
  max-height: 315px;
 }
}
</style>
