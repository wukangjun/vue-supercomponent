<template>
  <el-row>
    <el-col :span="24">
      <el-form :model="options.bing" ref="bingItem">
        <el-form-item >
       	<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">绑定关系</el-checkbox>
				<el-checkbox-group v-model="checkedCities" @change="handleCheckedPowerChange">
					<el-checkbox v-for="power in cities" :label="power.id" :key="power.id">{{power.name}}</el-checkbox>
				</el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class='dialog-footer'>
        <el-button :loading="loading" type="primary" @click="confirm">{{ $t('action.confirm') }}</el-button>
        <el-button @click='options.flag=false'>{{ $t('action.cancel') }}</el-button>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import port from './index.js'
export default {
  mixins: [port],
  props: {
    options: {}
  },
  data() {
    return {
      art:[],
			checkAll: true,
			checkedCities:[],
			cities: [],
			isIndeterminate: true,
      loading: false

    };
  },
  methods: {
    //显示默认被勾选中的能力项
    save() {
      let params = {
        id: this.options.bing.id
      }
      this.findBindedAbilityList(params).then(data => {
        if (!data.flag && !!data.errorCode) {
          this.$message.error({ message: this.$t("error." + data.errorCode) });
        } else {
        for (let i = 0; i < data.data.length; i++) {
            this.checkedCities.push(data.data[i].id)
          }
           
        }

      });
    },

    //查询所有的能力项，并显示出来
    unSave() {
      let params = {
        id: this.options.bing.id
      }
      this.findTerminalAbilityList(params).then(data => {
        if (!data.flag && !!data.errorCode) {
          this.$message.error({ message: this.$t("error." + data.errorCode) });
        } else {
        
          this.art = data.data;
          this.cities=this.art;
        }
      });

    },
    confirm() {
   
      this.$refs['bingItem'].validate(valid => {
        if (valid) {
          let params = {
            id: this.options.bing.id,
            ids: this.checkedCities.join(',')
          }
          this.loading = true
          this.insertProtocolAndAbility(params).then(data => {
            this.loading = false;
            if (!data.flag && !!data.errorCode) {
              this.$message.error({ message: this.$t("error." + data.errorCode) });

            } else {
              this.$message.success(this.$t('vgPower.bindSuccess'));
            }
          }).catch(()=>{
							this.loading = false;

          })
        } else {
          return false
        }
      });
      this.options.flag = false;
    },
    handleCheckAllChange(event) {
    	let arr = [];
      this.cities.forEach((data) => {
          arr.push(parseInt(data.id));
      });
	  this.checkedCities = event.target.checked ? arr : [];
    this.isIndeterminate = false;
    },
    handleCheckedPowerChange(value) {
  	  let checkedCount = value.length;
			this.checkAll = checkedCount === this.cities.length;
			this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },
  },
  mounted() {
    this.save();
    this.unSave();

  },
  watch:{
    	'options.flag'(newVal) {
			if (!newVal) {
				this.options.name = ""

			}
		},

  }

}


</script>
