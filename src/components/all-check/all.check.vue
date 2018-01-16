<template>
  <div class="cv-allCheck">
  <!-- 全选绑定全选阀值 -->
    <el-checkbox 
    ref="allCheck"
    class="allCheck"
    v-model="checkAll" 
    :label="data.title"
    @change="handleCheckAll"                                                    
    :indeterminate="isIndeterminate">{{data.title}}</el-checkbox>
    <!-- 子选择项的绑定 -->
    <el-checkbox-group  v-model="checked" @change="handleChecked" class="checkGroup"
    :disabled="checkDisabled" >
      <el-checkbox v-for="menuItem in data.Items" :label="menuItem.id" :key="menuItem.name"
      :disabled="checkDisabled" >{{menuItem.name}}</el-checkbox>
    </el-checkbox-group>
   
  </div>
</template>

<script>
  import emitter from '@/utils/mixins/emitter.js';
  export default{
    name:'allCheck',
    mixins: [emitter.default],
    props: {
       data: {},
       allChecked: {},
       checkDisabled: false
    },
    data(){
      return{
        checked: [],
        checkAll: false,
        isIndeterminate: false
      }
    },
    methods: {
      handleCheckAll(event){
        let arr = [];
        this.data.Items.forEach((data) => {
          arr.push(parseInt(data.id));
        });
        //全选选中，所有的子选项被选中
        this.checked = event.target.checked ? arr : [];
        this.isIndeterminate = false; 
        this.$emit('checked', { id: this.data.menuId, checked: this.checked });
      },
      handleChecked(value){
        this.$emit('checked', { id: this.data.menuId, checked: this.checked });
        //记录子选项的个数
        let length = value.length;
        //当全部子选项选中时，全选阀值开启
        this.checkAll = length === this.data.Items.length;
        //全选默认值
        this.isIndeterminate = length > 0 && length < this.data.Items.length;
      }
    },
    mounted() {
      //如果有默认选中项
      if(this.data.checked){
       this.checked=this.data.checked; 
       this.data.checked.length==this.data.Items.length ? this.isIndeterminate=false:this.isIndeterminate=true;
      }
    },
    // watch: {
    //  'checked'(newVal){
    //    if(newVal){
    //     //每次勾选发生变化时传递id  
    //     this.$emit('checked', { id: this.data.menuId, checked: this.checked});
    //    }
    //  }
    // }
  }
</script>

<style lang="scss">

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
    line-height: 30px;
  }
</style>