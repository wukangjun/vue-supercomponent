<template>
  <div class="cv-multimedia-manage">
            <cv-scrollbar class="cvs">
              <el-form  class="operateleft" label-width="90px">
                <!-- <el-form-item label="窗口模式:">
                      <el-select  v-model="WindNum" size="small" style="width:150px">
                        <el-option
                          v-for="item in WindNumArr"
                          :key='item.name'
                          :label="item.name"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </el-form-item> -->
                   <el-form-item label="摄像头:" style='margin-bottom:350px;'>
                      <el-select  :disabled="cameraFlag" v-model='cameraV' size="small" style="width:200px">
                        <el-option
                          v-for="item in camera"
                          :key='item.name'
                          :label="item.name"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <!-- <el-button @click='setWindNum()'>设置</el-button> -->
                  </el-form-item>
                    <!--  <el-form-item label="文件路径:">
                         <el-input v-model="fileName" placeholder="只支持“.bmp”和“.jpg”后缀"></el-input>
                     </el-form-item> -->
                    <!--  <el-form-item label="录像文件路径:">
                         <el-input v-model="recordfileName" placeholder="只支持“.avi”和“.wmv,.asf,.ifv”后缀"></el-input>
                     </el-form-item> -->
                    <!--  <el-form-item label="通道数:">
                        <el-input v-model="recordcnm"></el-input>
                    </el-form-item> -->

                  <div class="operate" >
                    <el-col :span="12" class="btnStyle">
                       <el-tooltip class="item" effect="dark" content="请先选中需要抓拍的窗口" placement="top">
                            <el-button @click="snapPicture()" :disabled="snapFlag">抓图</el-button>
                        </el-tooltip>

                    </el-col>
                  <!--  <el-col :span="12" class="btnStyle">
                      <el-button @click='searchVideo()'>查询录像</el-button>
                  </el-col> -->
                  <el-col :span="12" class="btnStyle">
                      <el-button @click='openVideo()'>打开视频</el-button>
                  </el-col>
                   <el-col :span="12" class="btnStyle">
                      <el-button type="primary" @click="closedVideo()">关闭视频</el-button>
                  </el-col>
                  <el-col :span="12" class="btnStyle">

                      <el-button @click='openVoice()' :disabled="voiceOpenFlag">打开声音</el-button>
                  </el-col>
                   <el-col :span="12" class="btnStyle">
                      <el-button type="primary" @click='closedVoice()' :disabled="voiceClosedFlag">关闭声音</el-button>
                  </el-col>
                  </div>
              </el-form>
              <el-row class="onlyOne">
                <el-col :span="12">
                <videoObject id='onVideo'></videoObject>
                </el-col>
                <!-- <el-col :span="12"><div class="videoStyle">2</div></el-col> -->
              </el-row>
             <!--  <el-row class="videoFour">
                  <el-col :span="12"><div class="videoStyle">3</div></el-col>
                  <el-col :span="12"><div class="videoStyle">4</div></el-col>
              </el-row> -->
            </cv-scrollbar>
  </div>
</template>

<script type="text/javascript">
import videoObject from './videoObject.vue'
export default {
    components: {videoObject},
    props: {
        data: {}
     },
    data(){
      return{
        WindNum:'4',
        WindNumArr:[
         {name:'1',value:1},
         {name:'4',value:4},
        ],
        cameraV:'全部',
        camera:[
          {name:'全部',value:4},
          {name:'摄像头1',value:0},
          {name:'摄像头2',value:1},
          {name:'摄像头3',value:2},
          {name:'摄像头4',value:3},
        ],
        fileName:"",//抓图文件名你
        recordfileName:'',//录像文件名
        snapFlag:true,
        voiceOpenFlag:true,
        voiceClosedFlag:true,
        cameraFlag:false,
         szServerIP:'',
        nSeverPort:'',
        szUserName:'',
        szPassWord:'',
        deviceID:'',
      }
    },
    methods:{
      //登陆的方法
      videoLogin(){
        let szServerIP = this.szServerIP;
        let nSeverPort = this.nSeverPort;
        let szUserName = this.szUserName;
        let szPassWord = this.szPassWord;
        let nRet = this.getVideoDom('onVideo').LoginServer(szServerIP, nSeverPort, szUserName, szPassWord);
        // console.log("这里是登陆返回"+nRet);
        if(nRet){
          // this.getVideoDom('onVideo').ShowWndStyle=this.WindNum;
          //默认显示4个窗口
          this.getVideoDom('onVideo').ShowWndStyle=4;
          //设置窗口不显示预览成功文字，防止闪屏
          this.getVideoDom('onVideo').SetDrawText(1,'');
          //  console.log("登陆成功")
        }else{
           this.$message.error({ message: this.$t("videoErrorCode."+nRet) });
        }
      },
      //得到视频对象的DOM对象
      getVideoDom(item) {
            return document.getElementById(item)
      },
      //打开视频
      openVideo(){
        this.cameraFlag=true;
        //设备ID
        let  DevId= this.deviceID;
        let  openWinNum=this.cameraV;
        if(openWinNum=='全部'){
          openWinNum=4
        }
        //记录打开视频的返回值
        let openVideoFlag='';
        //遍历当前的通道窗口数
        if(openWinNum<4){
          openVideoFlag= this.getVideoDom('onVideo').PlayVideoByWnd(DevId, openWinNum,openWinNum);
          if(openVideoFlag==0){
            //视频开启成功后，才能抓图，开启，关闭声音按钮
            this.snapFlag=false;
            this.voiceOpenFlag=false;
            this.voiceClosedFlag=false;
          }
           if(openVideoFlag!=0){
            this.$message.error({ message: this.$t("videoErrorCode."+openVideoFlag) });
           }
           //打开预览成功的窗口信息的去除
          this.getVideoDom('onVideo').SetDrawText(7,'');
        }else{
          for(let i=0;i<openWinNum;i++){
           openVideoFlag= this.getVideoDom('onVideo').PlayVideoByWnd(DevId, i,i);
           //打开预览成功的窗口信息的去除
           this.getVideoDom('onVideo').SetDrawText(7,'');
           if(openVideoFlag==0){
            //视频开启成功后，才能抓图
            this.snapFlag=false;
            this.voiceOpenFlag=false;
            this.voiceClosedFlag=false;
          }
           if(openVideoFlag!=0){
            this.$message.error({ message: this.$t("videoErrorCode."+openVideoFlag) });
           }
          }
        }
      },
      // 关闭视频
      closedVideo(){
        this.cameraFlag=false;
        let closedNum=this.cameraV;
        if(closedNum=='全部'){
          closedNum=4
        }
        if(closedNum<4){
          this.getVideoDom('onVideo').StopVideoByWndNum(closedNum)
        }else{
          for(var i=0;i<closedNum;i++){
            this.getVideoDom('onVideo').StopVideoByWndNum(i)
          }
        }
         //关闭某个指定的视频
        this.snapFlag=true;
        this.voiceOpenFlag=true;
        this.voiceClosedFlag=true;

      },
      // 在当前激活窗口抓图
      snapPicture(){
         let  DevId= this.deviceID;
        let nChnm=this.cameraV;
         if(nChnm=='全部'){
          nChnm=4;
        }
        let savePicPath='';
        let nowTime = this.$filter.format(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
        if(nChnm>3){
           savePicPath="D:\\A-picture\\" + nowTime + ".jpg";
        }else{
           savePicPath="D:\\A-picture\\CH" + nChnm + "-" + nowTime + ".jpg";
        }
        let savePic=this.getVideoDom('onVideo').SnapPicture(savePicPath);
        savePic !=0 ? this.$message.error({ message: this.$t("videoErrorCode."+savePic) }):this.$message.success({ message: '抓拍图片已保存至D:\\A-picture文件夹' });

      },
      //查询录像
      searchVideo(){
        let now = new Date();
        let nMsTime  = now.getTime();
        let nEndTime = (nMsTime + 999) / 1000;
        let nStartTime = 0;
        let  DevId= this.deviceID;
        let searchVideo=this.getVideoDom('onVideo').StartRemoteFileSearch(DevId, 0, 0x10, nStartTime, nEndTime);
        console.log("查询录像"+searchVideo);
      },
      //设置视频的显示个数
      setWindNum(){
        let windNum=this.windNum;
           this.getVideoDom('onVideo').ShowWndStyle = windNum;
      },
      //在当前激活窗口开启声音
      openVoice(){
          let  DevId= this.deviceID;
          let nChnm=this.cameraV;
          if(nChnm=='全部'){
            nChnm=4;
          }
          if(nChnm==4){
            this.$message.error({ message: this.$t("只能在单个摄像头下开启声音！") })
          }else{
            let vOpen=this.getVideoDom('onVideo').PlayAudioDirectly(DevId,nChnm);
            // console.log('声音打开'+vOpen);
            vOpen !=0 ? this.$message.error({ message: this.$t("videoErrorCode."+vOpen) }):this.$message.success({ message: '声音打开！' });
          }

      },
      closedVoice(){
          let  DevId= this.deviceID;
          let nChnm=this.cameraV;
          if(nChnm=='全部'){
            nChnm=4;
          }
          for(let i=0;i<nChnm;i++){
            this.getVideoDom('onVideo').StopAudioDirectly(DevId,nChnm);
          }
      }
    },
    watch: {
    },
    mounted(){
      //进行视频控件的登陆信息的获取
      let loginData=JSON.parse(localStorage.getItem("VideologinData"));
      this.deviceID=loginData.dvrId;
      this.szServerIP=loginData.ip;
      this.nSeverPort=loginData.port;
      this.szUserName=loginData.username;
      this.szPassWord=loginData.password;
      this.videoLogin();
    }

}
</script>
<style lang="scss">

  .cv-multimedia-manage{
 .nav{
  width:350px;
  float: left;
 }
 .btnStyle{
  padding:0 10px;
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
 .operateleft{
  width:400px;
  // float: left;
 }


}
</style>
