<template>
	<div class='askTabs'>
		<el-tabs v-model="activeName">
			<el-tab-pane label="提问下发" name="first" ref='first'>
				<el-form :model="sendDate" label-position="right" label-width='136px' class="first" :inline="true" ref="sendDate" >
                    <el-form-item label="下发问题:"  prop="askInfo" :rules="{required: true, message: '下发问题不能为空', trigger: 'blur'}">
                        <el-input v-model.trim='sendDate.askInfo' :maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="sendDate.isTemplate">加为模版</el-checkbox>
                    </el-form-item>
                    <el-form-item label="显示方式:" prop="sendFlag">
                        <el-select v-model="sendDate.sendFlag">
                          <el-option :value='25' label="全部"></el-option>
                          <el-option :value='1' label="紧急"></el-option>
                          <el-option :value='8' label="终端TTS播读"></el-option>
                          <el-option :value='16' label="广告屏显示"></el-option>
                          <el-option :value='9' label="紧急+终端TTS播读"></el-option>
                          <el-option :value='17' label="紧急+广告屏显示"></el-option>
                          <el-option :value='24' label="终端TTS播读+广告屏显示"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-for="(domain, index) in sendDate.answerLists" :label="'问题答案' + (index+1) +':'" :key="domain.key" :prop="'answerLists.' + index + '.value'"
                        :rules="{required: true, message: '问题答案不能为空', trigger: 'blur'}">
                        <el-input v-model.trim="domain.value" :maxlength="50"></el-input><el-button @click.prevent="addDom()" v-show='(sendDate.answerLists.length > (index+1) || sendDate.answerLists.length==5) ? false : true'>新增</el-button><el-button @click.prevent="removeDom(domain)" v-show='sendDate.answerLists.length ==1 ? false : true'>删除</el-button>
                    </el-form-item>
                </el-form>
			</el-tab-pane>
			<el-tab-pane label="问题模版" name="second" ref='second'>
				<cv-grid :options='grid' @load='answerList(false)'>
                    <el-table border stripe :data='grid.table' v-loading="grid.loading" highlight-current-row
    				@current-change="handleCurrentChange">
                        <el-table-column label="问题" prop='askinfo' min-width="150" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="问题答案" prop='mobileCode' min-width="150" :show-overflow-tooltip="true" :formatter="showAnswer"></el-table-column>
                    </el-table>
                </cv-grid>
			</el-tab-pane>
		</el-tabs>
		<div class="dialog-footer" style='padding:10px;clear:both;'>
			<el-button :loading="loading" type="primary" @click="save">{{$t('action.confirm')}}</el-button>
			<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
		</div>
	</div>
</template>

<script>
	import port from './index.js'
	import {COMMON} from '@/utils'
	import { publicApi, instructCallback } from "../../src/instruction.public.api";
	export default {
		mixins: [port],
		props: {
			options: {}
		},
		data() {
			return {
                activeName:'first',
                sendDate:{
                    isTemplate:true,
                    askInfo:"",
					sendFlag:25,
					vehicleId:this.options.carId.id,
                    answerLists:[{
                        value:""
                    }]
                },
                loading:false,
                grid:{
                    loading:false,
                    total:0,
                    current:1,
                    size:10,
                    table:[]
				}
			}
        },
		methods: {
			removeDom(item){
                var index = this.sendDate.answerLists.indexOf(item)
                if (index !== -1) {
                    this.sendDate.answerLists.splice(index, 1)
                }
            },
			confirm() {
				let _self=this;
				this.$refs['sendDate'].validate(valid => {
					if(valid){
						_self.loading = true;
						let _answerList=[];
						for(let idx in _self.sendDate.answerLists){
							let objs={
								answerId:idx,
								answerContent: _self.sendDate.answerLists[idx].value
							}
							_answerList.push(objs);
						}
						let _par={
							answerList:_answerList,
							isTemplate:_self.sendDate.isTemplate,
							askInfo:_self.sendDate.askInfo,
							sendFlag:_self.sendDate.sendFlag,
							vehicleId:_self.sendDate.vehicleId,
						}
						publicApi({url: "/sendOrder/sendVehicleAskCmd",data: _par}).then(_data => {
									setTimeout(_=>{
										_self.loading = false;
										_self.options.flag=false;
										this.$emit('confirm')
										instructCallback(_data, _self.options);
									},2000)
								});
						// _self.insetAskList(_par).then(item => {
						// 	if(item.flag){
								
						// 	}else{
						// 		_self.loading = false;
						// 		_self.$message.error(_self.$t('error.'+item.errorCode));
						// 	}
						// });
					}else {
						return false;
					}
				});
			},
			save(){
				if(this.activeName=="first"){
					this.confirm();
				}else{
					if(this.currentRow){
						this.loading = true;
						publicApi({url: "/sendOrder/sendVehicleAskCmd",data:{
							vehicleId:this.sendDate.vehicleId,
							askId:this.currentRow.id,
							sendFlag:this.currentRow.flag
						}}).then(_data => {
							setTimeout(_=>{
								this.loading = false;
								this.options.flag=false;
								this.$emit('confirm');
								instructCallback(_data, this.options);
								console.log('timeout')
							},2000)
						});
					}else{
						this.$message.warning("请选择下发模版");
					}
				}
			},
			handleCurrentChange(val) {
				this.currentRow = val;
			},
			showAnswer(row){
				let html=""
				row.vehicleAskTemplateDetails.forEach(el => {
					html+=el.answerinfo+","
				});
				html=html.substring(0,html.length-1);
				return html;
			},
            addDom(){
                if(this.sendDate.answerLists.length < 5){
                    this.sendDate.answerLists.push({
                    value: '',
                    key: Date.now()
                    });
                }else{
                    this.$message.warning("问题答案不能超过5个");
                }
			},
			answerList(flg){
				if (flg) {
					this.grid.flag = true;
					this.grid.current = 1;
				} else {
					this.grid.flag = false;
				}
				this.grid.loading=true;
				this.queryAskList({current:this.grid.current,size:this.grid.size}).then(data => {
					if(data.flag){
						this.grid.table=data.data.records;
						this.grid.total = data.data.total;
					}else{
						this.grid.table =[];
						this.grid.total =0;
					}
					this.grid.loading = false;
				}).catch(_ => {
					this.$message.error('网络异常')
					this.loading = false
				});
			}
			
		},
		//监听事件
		watch: {
			"options.flag" (newVal) {
				if (!newVal) {
					this.options.name = "";
				}
			}
		},
		mounted () {
			this.answerList(true)
		}
	}
</script>

<style lang="scss">
	.first {
		.el-input , .el-select{
            width:230px;
        }
        .el-button{
            margin-left:10px;
        }
	}
</style>