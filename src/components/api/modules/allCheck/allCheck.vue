<template>
  <div class="cv-allCheck">
   <h1>CheckBox多选框</h1>
  <!-- 全选绑定全选阀值 -->
  <h3>单个多选框</h3>
  <allCheck  :data='checkData'  @checked="GetCheck"></allCheck>
  <h3 class="mart">多个多选框</h3>
  <allCheck v-for="checkedData in checkedArr" :key='checkedData.title' :data='checkedData'  @checked="GetCheckedVal"></allCheck>

    <pre class="describe">
    <span class='paramStyle'> 单个多选框页面引入标签 :</span>
     < allCheck  :data='checkData'  @checked="checkedVal"></ allCheck>(<cv-span type="danger">局部组件</cv-span>):
    <span class='paramStyle'> 多个多选框页面引入标签 :</span>
     < allCheck v-for="checkedData in checkedArr" :key='checkedData.title' :data='checkedData'  @checked="GetCheckedVal"></ allCheck> (<cv-span type="danger">局部组件</cv-span>):
     <span class="paramStyle">参数说明:</span>
     :data传入模板菜单的数据（ 传入的数据格式如下所示）:
     “checkData:{
                  title:'全选', （选择项的标题）
                  menuId:10000,  (选择项的id)
                  Items:[ {name:'选择一',id:10001},（子选择项的name以及id）
                          {name:'选择二',id:10002}......
                          ],
                  checked:[10001,10002,10003](默认选中的数组，没有可以不传)
                  }”
     
     @checked="checkedVal"和 @checked="GetCheckedVal"： 勾选发生变化返回的勾选数据id的函数方法
    
    </pre>
  </div>
</template>

<script>
  import allCheck from '../../../all-check/all.check.vue'
  export default{
  	components: {allCheck},
    props: {
        options: {}
    },
    data(){
      return{
         allChecked:[],
         checkedObj:{},
         menuId:[],
         checkedArr:[
         {title:'菜单一',
          menuId:10000,
          Items:[ {name:'选择一',id:10001},
                  {name:'选择二',id:10002},
                  {name:'选择三',id:10003},
                  {name:'选择四',id:10004},
                  {name:'选择五',id:10005},
                  {name:'选择六',id:10006},
                  {name:'选择七',id:10007},
                  {name:'选择八',id:10008},
                  {name:'选择九',id:10009}
                 ],
          // checked:[10001,10002,10003,10004,10005,10006,10007,10008,10009]
          // checked:[10001,10002,10003,10004]
             },
             {title:'菜单二',
              menuId:20000,
              Items:[ {name:'选择一',id:20001},
                      {name:'选择二',id:20002},
                      {name:'选择三',id:20003},
                      {name:'选择四',id:20004},
                      {name:'选择五',id:20005},
                      {name:'选择六',id:20006},
                      {name:'选择七',id:20007},
                      {name:'选择八',id:20008},
                      {name:'选择九',id:20009}
                     ],
              // checked:[10001,10002,10003,10004,10005,10006,10007,10008,10009]
              // checked:[20001,20002,20003,20004]
             },
             {title:'菜单三',
              menuId:30000,
              Items:[ {name:'选择一',id:30001},
                      {name:'选择二',id:30002},
                      {name:'选择三',id:30003},
                      {name:'选择四',id:30004},
                      {name:'选择五',id:30005},
                      {name:'选择六',id:30006},
                      {name:'选择七',id:30007},
                      {name:'选择八',id:30008},
                      {name:'选择九',id:30009}
                     ],
              // checked:[10001,10002,10003,10004,10005,10006,10007,10008,10009]
              // checked:[30001,30002,30003,30004]
             }
         ],
         checkData:{title:'全选',
                    menuId:10000,
                    Items:[ {name:'选择一',id:10001},
                            {name:'选择二',id:10002},
                            {name:'选择三',id:10003},
                            {name:'选择四',id:10004},
                            {name:'选择五',id:10005},
                            {name:'选择六',id:10006},
                            {name:'选择七',id:10007},
                            {name:'选择八',id:10008},
                            {name:'选择九',id:10009}
                           ],
                    // checked:[10001,10002,10003,10004,10005,10006,10007,10008,10009]
                    checked:[10001,10002,10003,10004]
             },
         optionData:  [ 
             {name:'选择一',id:10001},
             {name:'选择二',id:10002},
             {name:'选择三',id:10003},
             {name:'选择四',id:10004},
             {name:'选择五',id:10005},
             {name:'选择六',id:10006},
             {name:'选择七',id:10007},
             {name:'选择八',id:10008},
             {name:'选择九',id:10009}]
        }
    },
    methods: {
        GetCheck(val){
          console.log('勾选的id---'+val.checked);
        },
        GetCheckedVal(val) {
          if (val.checked.length > 0) {
                if (this.allChecked.length > 0) {
                    let obj = this.findMenuID(val.id);
                    if (obj.flag)
                        this.allChecked[obj.index].checkedIds = val.checked.join(',');
                    else {
                        this.allChecked.push({ menuId: val.id, checkedIds: val.checked.join(',') });
                    }
                } else {

                    this.allChecked.push({ menuId: val.id, checkedIds: val.checked.join(',')});
                }
            }else{
              let obj = this.findMenuID(val.id);
                    if (obj.flag)
                        this.allChecked[obj.index].checkedIds = val.checked.join(',');
                    else {
                        this.allChecked.push({ menuId: val.id, checkedIds: val.checked.join(',') });
                    }
            }
            console.log(this.allChecked);
        },
         findMenuID(id) {                                           
            let arr = this.allChecked, flag = false, index = -1;
            for (let i = 0; i < arr.length; i++) {
                if (parseInt(arr[i].menuId) == parseInt(id)) {
                    flag = true; index = i;  
                    break;
                }
            }
            return { flag: flag, index: index };
        },
      },
  }
</script>

<style lang="scss">
h1{
  height:55px;
  font-size: 24px!important;
}
h3{
  height:30px;

}
.paramStyle{
  font-size: 20px;
}
.mart{
  margin-top: 50px;
}
  .cv-allCheck{
    .allCheck{
      clear: left;
      padding-right: 10px
    }
    .allCheck, .checkGroup{
      float: left
    }
  }
 .describe{
    float: left;
    background:#f7f7f7;
  }
 .el-checkbox-group{
  height:50px;
 }
</style>