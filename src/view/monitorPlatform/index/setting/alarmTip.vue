<template>
<div class='alarmTip' >
  <el-row class="pleft" v-loading="loadFlag">
      <el-col :span="10">
        <div class="grid-content bg-purple">
          所有报警：
          <div class="table">
          <el-scrollbar
            class="scroll-area"
            tag="ul"
            wrap-class="el-select-dropdown__wrap scrollSpecial"
            view-class="el-select-dropdown__list">
              <el-tree
                show-checkbox
                :data='alarmData'
                node-key="id"
                :default-checked-keys="dChecked"
                :props="defaultProps"
                @check-change="checkEvent"
                ref="alarmtree"
                style="border:none;">
              </el-tree>
          </el-scrollbar>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="midS">
          <el-button @click="add" class='mart' style='width:106px;margin-left:10px;' :disabled="addFlag">
          添加
          <i class="el-icon-arrow-right arrowStyle"></i>
          </el-button>
          <el-button @click="deleteData" class='mart' style='width:106px;' :disabled="deleteFlag">
          删除
          <!-- <i class="el-icon-arrow-left arrowStyle"></i> -->
          </el-button>
          <el-button @click="addAll" class='mart' :disabled="addAllFlag">
          添加所有
          <i class="el-icon-arrow-right arrowStyle"></i>
          </el-button>
          <el-button @click="deleteAll" class='mart' style='width:106px;' :disabled="deleteAllFlag">
          删除所有
          <!-- <i class="el-icon-arrow-left arrowStyle"></i> -->
          </el-button>
        </div>
      </el-col>
      <el-col :span="10">
         <div class="grid-content bg-purple-light">
           已选报警：
           <div class="table">
           <el-scrollbar
            class="scroll-area"
            tag="ul"
            wrap-class="el-select-dropdown__wrap scrollSpecial"
            view-class="el-select-dropdown__list">
             <div v-for="checkedItem in showCheckText" 
             :key="checkedItem"
             class="selectedStyle"
             :class="{active: checkedName == checkedItem}"
             @click="deleteItem(checkedItem)">{{checkedItem}}</div>
             </el-scrollbar>
           </div>
         </div>
      </el-col>
     </el-row>
<el-row>
  <!-- <el-col :span="24" style="text-align: center;"><el-button  @click="saveAlarm" type="primary" >保存</el-button></el-col> -->
</el-row>
</div>
</template>
  
<script>
import { COMMON, http , service} from "@/utils"
import common from '@/utils/mixins/common'
  export default{
    mixins: [common],
    props: {
      options: {}
    },
    data(){
      return{
        alarmData:[],
        checkIds: [],     //报警树选中的所有选项
        checkText: [],   //报警树选中的所有文字
        showCheckText:[], //右侧已选报警的显示文字数组
        allCheckIds:[],   //所有报警的id数组
        checkedName:'',   //右侧选中的报警
        rightCheckedIds:[], //右侧选中的id
        deleteIds:[],
        dChecked:[], //默认选中的id
        //添加，删除，添加所有，删除所有的禁用阀值
        addFlag:false,
        deleteFlag:false,
        addAllFlag:false,
        deleteAllFlag:false,
        allDataLength:0,//全部数据的长度
        loadFlag:false,//表格刷新的
        leftIds:[],
        defaultProps: {
            children: 'children',
            label: 'text'
         }
        }
    },
    watch:{ 
      showCheckText(newVal){
        var length=0;
        if(this.alarmData.length>0){
          for(let i=0;i<this.alarmData.length;i++){
           length+=this.alarmData[i].children.length;
          }
        }
        
       //已选全部，添加按钮禁止
        // newVal.length===length?this.addFlag=true:this.addFlag=false;
        // newVal.length===length?this.addAllFlag=true:this.addAllFlag=false;
        //如果是空，删除按钮禁止
        newVal.length===0?this.deleteFlag=true:this.deleteFlag=false;
        newVal.length===0?this.deleteAllFlag=true:this.deleteAllFlag=false;
        //匹配左侧勾选,拿到所有的id数组,进行左边树的勾选
        if(this.showCheckText.length>0){
          let checkedIds=[];
          for(let i=0;i<this.showCheckText.length;i++){
            let id=this.RegIds(this.showCheckText[i]);
            checkedIds.push(id);
          }
          this.rightCheckedIds=checkedIds;
          this.$refs['alarmtree'].setCheckedKeys(this.rightCheckedIds); 
        }else{
          this.$refs['alarmtree'].setCheckedKeys([]);
        }
         
      },

      checkIds(newVal){
        let arr = [];
        this.checkText = [];
        if(newVal.length > 0){
          if((newVal.length-3)==this.getAllDataLength(this.alarmData)){
            this.addFlag=false;
            this.addAllFlag=true
          }else{
            this.addAllFlag=false
            this.addFlag=false
          }
          newVal.forEach(val => {
            //子选择项
            if(parseInt(val.type) === 3){
              arr.push(val.id);
              this.checkText.push(val.text)
            }
          })
          this.$emit('checked', arr)
        }else{
          this.$emit('checked', []);
          this.checkText = [];
          if(newVal==0){
            this.addFlag=true;
            // this.addAllFlag=true;
          } 
        }
      }
    },
    computed: {
      contents: {
        get(){
            return this.checkText.join(',')       
        },
        set(val){
          this.$emit('input', val);
        }
      }
    }, 
    methods:{
      //获取树的数据
      getTreeData(){
        http({
                url: COMMON.baseUrl + '/alarmInfo/frinAlarmTypeInfoList.do',
                params: { enterpriseId: this.$store.getters.user.enterpriseId }
            }).then((data) => {
              
              if(data.flag){

              if(service.isArray(data.data)){
                this.alarmData = data.data;
              }else{
                service.isArray(data.data.children) ? 
                this.alarmData = data.data.children : this.alarmData = [];  
                // 报警下拉树专用
                service.isArray(data.data.AlarmType) ? 
                this.$emit('allAlarmType', data.data.AlarmType): null;
              }             
            }else{
              this.alarmData = [];
            } 
             //得到用户报警的数据
                this.getCheckedData();
                //默认按钮样式问题
               this.defaultButtonStyle();
            })
        
      },
      //拿到所有数据长度的方法
      getAllDataLength(alarmData){
         var length=0;
             if(alarmData.length>0){
               for(let i=0;i<alarmData.length;i++){
                length+=alarmData[i].children.length;
               }
             }

          return length;
      },
      //获得用户设置的报警提醒列表
      getCheckedData(){
        this.showCheckText=[];
        this.$store.dispatch("getUserRemindAlarmList", { userId: this.$store.getters.user.id }).then((data) => {
          if(data.flag){
            if(service.isArray(data.data)){
              for(let i=0;i<data.data.length;i++){
                  this.showCheckText.push(data.data[i].alarmName)
                  this.dChecked.push(data.data[i].alarmId)
                  this.checkText.push(data.data[i].alarmName)
                  this.rightCheckedIds.push(data.data[i].alarmId)
                }
              } 
          }
        })
       
      },
      //选中的id
      checkEvent(){
        this.checkIds = [];
        this.checkIds = this.$refs['alarmtree'].getCheckedNodes();
      },
      //清空选中树的清空
      cleanCheckEvent(){
        this.$refs['alarmtree'].setCheckedKeys([]);  
        // 清空文字组
        this.checkText = [];
        this.$emit('checked', []);      
      },
     //匹配文字，拿到id
      RegIds(name){
        if(this.alarmData.length>0){
            for(let i=0;i<this.alarmData.length;i++){
            for(let j=0;j<this.alarmData[i].children.length;j++){
              if(name == this.alarmData[i].children[j].text){
                return parseInt(this.alarmData[i].children[j].id)
              }
            }
          }
        }
      },
      //添加的方法
      add(){
        //判断是否有重复
        this.checkedName='';
        this.showCheckText=[];
        this.leftIds=[];
        if(this.checkIds.length>0){
          //拿到勾选的id数组
          for(let i=0;i<this.checkIds.length;i++){
            if(this.checkIds[i].type==3){
              this.leftIds.push(this.checkIds[i].id);
            }
          }
         this.saveAlarm(this.leftIds.join(","));
        }
        this.checkIds.length==0 ? this.$message.error({ message: "请勾选报警类型！" }) :null;
        
      },
      //添加所有的方法
      addAll(){
        this.checkedName='';
        this.showCheckText=[];
        this.allCheckIds=[];
        // 拿到所有的id数组
        if(this.alarmData.length>0){
          for(let i=0;i<this.alarmData.length;i++){
            for(let j=0;j<this.alarmData[i].children.length;j++){
              this.allCheckIds.push(this.alarmData[i].children[j].id);
            }
          }
          //保存所有的ids
          this.saveAlarm(this.allCheckIds.join(","));
        }
      },
      // 删除
      deleteData(){
        if(this.checkedName!=''){
          for(let i=0;i<this.showCheckText.length;i++){
            if(this.showCheckText[i]===this.checkedName){
              this.showCheckText.splice(i,1);
              this.checkedName=""
            
            }
          }
          //保存所有的ids

          this.saveAlarm(this.getAlarmIds());
          if(this.showCheckText.length>0){
              // let checkedIds=[];
              for(let i=0;i<this.showCheckText.length;i++){
                let id=this.RegIds(this.showCheckText[i]);
                this.deleteIds.push(id);
              }
             // this.$refs['alarmtree'].setCheckedKeys(this.deleteIds); 
         }
        }else{
          this.$message.error({ message: "请选择右侧已选报警类型！" });
        }     
      },
      //已选报警的点击
      deleteItem(checkedItem){
        //获得已选的报警类型
        this.checkedName=checkedItem;
      },
      //删除所有
      deleteAll(){   
        //清空
        this.showCheckText=[];
        this.checkedName='';
        this.saveAlarm("");
      } ,
       //拿到所有保存的报警id数据处理
      getAlarmIds(){
        var saveAlarmIds=[];         
        if(this.showCheckText.length>0){
          let checkedIds=[];
          for(let i=0;i<this.showCheckText.length;i++){
            let id=this.RegIds(this.showCheckText[i]);
            checkedIds.push(id);
          }
         return checkedIds.join(",");
        }else{
          return "";
        }        
      },
      //保存用户报警信息
      saveAlarm(alarmIds){
        this.loadFlag=true;
        this.$store.dispatch("saveUserRemindAlarm", {userId : this.$store.getters.user.id , alarmIds:  alarmIds }).then((data) => {
          this.loadFlag=false;
           if(data.flag){
            //保存成功则要显示已选报警
                this.getCheckedData()
              }else{
                this.$message.error({ message: this.$t("error."+data.errorCode) });
              }
        })
      },
      defaultButtonStyle(){
        let len=this.showCheckText.length;
        if(len==0){
            this.deleteFlag=true;
            this.deleteAllFlag=true;
        }else{
            this.deleteFlag=false;
            this.deleteAllFlag=false;
        }
        if(len==this.getAllDataLength(this.alarmData)){
            this.addFlag=true;
            this.addAllFlag=true;
        }else{
            this.addFlag=false;
            this.addAllFlag=false;
        }
        // if(this.dChecked.length==0){
        //   this.addFlag=true;
        // }else{
        //   this.addFlag=false;
        // }
      },
    },
    mounted(){
      //得到报警树的数据
      this.getTreeData()
      
      // console.log(this.dChecked);
    }
  }
</script>
<style lang='scss'>
.alarmTip {
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
 .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .table{
    border: 1px solid #ccc;
    height:300px;
    // width:100%;
    margin-left: 10px;
    margin-top: 10px;
    overflow: auto;
  }
  .pleft{
    // padding-left: 15px;
  }
  .midS{
    padding-top: 90px;
    text-align: center;
  }
  .mart{
    margin-top: 10px;
  }
  .selectedStyle{
    height:30px;
    line-height: 30px;
    padding-left: 10px;
    cursor:pointer;
  }
  .active{
    background:#ccc;
  }
  .arrowStyle{
    font-size: 12px
  }
  .scrollSpecial{
    max-height: 315px;
    height:315px
  }
  .el-loading-mask{
    right:0;
    left:0;
        z-index: 2000;
        bottom: 0
  }
 
}
</style>