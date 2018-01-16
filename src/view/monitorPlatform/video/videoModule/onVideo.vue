<template>
  <div class="cv-multimedia-manage">
              <cv-scrollbar class="cvs">
              <div class="operateleft">
                <el-form  label-width="60px">
                <el-form-item label="摄像头:">
                  <el-select  v-model="cameraV" size="small" style="width:100%">
                        <el-option
                          v-for="item in camera"
                          :key='item.name'
                          :label="item.name"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </el-form-item>
                   <el-form-item label="清晰度:">
                  <el-select  v-model="definitionV" size="small" style="width:100%">
                        <el-option
                          v-for="item in definition"
                          :key='item.name'
                          :label="item.name"
                          :value="item.name">
                        </el-option>
                      </el-select>
                  </el-form-item>
                  <div class="operate" >
                    <el-col :span="12" class="btnStyle">
                      <el-button >抓图</el-button>
                  </el-col>
                   <el-col :span="12" class="btnStyle">
                      <el-button >打开声音</el-button>
                  </el-col>
                  <el-col :span="12" class="btnStyle">
                      <el-button >打开视频</el-button>
                  </el-col>
                   <el-col :span="12" class="btnStyle">
                      <el-button type="primary">关闭视频</el-button>
                  </el-col>
                  </div>
                   </el-form>
              </div>
              <div class="videoFour">
                <el-row>
                  <el-col :span="12">
                     <div class="videoStyle">
                     <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">
                         <param name="movie" value="../images/bn1.swf">
                         <param name="wmode" value="transparent">
                         <param name="quality" value="high">
                       </object>
                     </div>
                  </el-col>
                  <el-col :span="12"><div class="videoStyle">2</div></el-col>
                </el-row>
                <el-row>
                  <el-col :span="12"><div class="videoStyle">3</div></el-col>
                  <el-col :span="12"><div class="videoStyle">4</div></el-col>
                </el-row>
               </div>
                  </cv-scrollbar>
  </div>
</template>

<script type="text/javascript">
  import prot from './index.js'
export default {
  components: {},
    data(){
      return{
         props: {
            options: {}
         },
        cameraV:'',
        definitionV:'',
        activeName2:'first',
        choseCar:{},
        camera:[
          {name:'全部',value:0},
          {name:'摄像头1',value:1},
          {name:'摄像头2',value:2},
          {name:'摄像头3',value:3},
          {name:'摄像头4',value:4},
        ],
        definition:[
        {name:'高清',value:0},
        {name:'清晰',value:1},
        ],
        operation: {
          time: '',
          startTime: null,
          endTime: null,
        },
      }
    },
    methods:{
      
    },
    watch: {
    }
}
</script>
<style lang="scss">
  .cv-multimedia-manage{
    .el-tabs{
      .el-tabs__content{
        position: absolute;
        top: 55px;
        left: 10px;
        right: 10px;
        bottom: 0px;
          .cvs{
            position: absolute;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            padding:0 10px 0 0;
        }
      }
    }
    .card{
      width:320px;
      height:304px;
      float:left;
      margin-right:10px;
      margin-bottom:10px;
      .time {
          font-size: 13px;
          color: #999;
      }
        .bottom {
          margin-top: 13px;
          line-height: 12px;
      }
        .button {
          padding: 0;
          float: right;
      }
        .image {
          width: 320px;
          height:240px;
          display: block;
      }
        .clearfix:before,
        .clearfix:after {
            display: table;
            content: "";
      }
        .clearfix:after {
            clear: both
      }
    }
  }
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
 .operate{
  margin-top: 290px;
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
 .viewBox{
  width:800px;
  float: left;
 margin-left: 25px;
  .videoStyle{
    height: 280px;
    margin:0 10px 10px 0;
     background:yellow;
  }
 }
 .operateleft{
  width:350px;
  float: left;
 }
 .videoFour{
  width:800px;
  float: left;
 margin-left: 25px;
  .videoStyle{
    height: 280px;
    margin:0 10px 10px 0;
     background:pink;
  }
 }
 .onlyOne{
  float: left;
    width:800px;
    height:500px;
  .onlyOneVideo{

  background:pink;
  height:500px;
  margin-left: 25px;

 }
 }
 

}
</style>