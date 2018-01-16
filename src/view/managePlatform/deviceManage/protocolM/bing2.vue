
<template>
  <el-row>
    <el-col :span="24">
      <el-form :model="options.bing" ref="bingItem">
        <el-form-item porp="unBing">
          <el-transfer v-model="unBing"
              filterable 
              :props="{
              label:'name',
              key:'id'
              }" 
              :footer-format="{
                                    noChecked: '${total}项',
                                    hasChecked: '${checked}/${total}项'
                                    }" @change="handleChange"
              :render-content="renderFunc" 
              :titles="['未绑定能力项', '已绑定能力项']"
              :data="bing">
          </el-transfer>
        </el-form-item>
      </el-form>
      <div class='dialog-footer'>
        <el-button type="primary" @click="confirm">{{ $t('msg.confirm') }}</el-button>
        <el-button @click='options.flag=false'>{{ $t('msg.cancel') }}</el-button>
      </div>
    </el-col>
  </el-row>
</template>
<script>
// 此文件为实现交互的第二套方案，仍需完善，请勿删除
import port from './index.js'
export default {
  mixins: [port],
  props: {
    options: {}
  },
  data() {
    return {
      bing:[],
      unBing:[],
      renderFunc(h,option) {
        return <span>{option.name}</span>;
      },
    };
  },
  methods: {
    handleChange(value, direction, movedKeys) {
      
          
            console.log(value, direction, movedKeys);
    },
    unSave() {
          let params = {
          }
          this.findUnBindAbilityList(params).then(data => {
            console.log("ret",data);
            if (data.flag) {
              console.log("data",data);
              data.data.forEach((data)=>{
                this.bing.push({id:data.id,name:data.name});
              });
              console.log("bing",this.bing);
            } else {
              this.$notify.error(this.$t('msg.unBing'));
            }
          });

    },
    fuck() {
          let params = {
            id:this.options.bing.id
          }
          console.log(params)
          this.findBindedAbilityList(params).then(data => {
          if (data.flag) {
            let arr=[];
            let id="";
            for(let i=0;i<data.data.length;i++){
                  arr=[];
                arr.push(data.data[i].id)
            }
              this.unBing=arr;
              console.log("bing",this.unBing);
            } else {
              this.$notify.error(this.$t('msg.unBing'));
            }
          });

    },
    confirm(){
       this.$refs['bingItem'].validate(valid => {
        if (valid) {
          let params = {
            id: this.options.bing.id,
            ids:this.unBing.join(',')
          }
          console.log(params)
          this.insertProtocolAndAbility(params).then(data => {
            if (data.flag) {
               this.$notify.success(this.$t('msg.bingFind'));
            } else {
              this.$notify.error(this.$t('msg.addFail'));
            }
          })
        } else {
          return false
        }
      });
    this.options.flag = false;
    }
  },
  mounted() {
    this.unSave();
    this.fuck();

  },

  watch: {//监听弹框是否打开
    "options.flag"(newVal) {
      if (newVal) {
       
          console.log(newVal)
      }
    },
    "unBing"(newVal) {  
      console.log(newVal) 
       
    }
  }

}


</script>
