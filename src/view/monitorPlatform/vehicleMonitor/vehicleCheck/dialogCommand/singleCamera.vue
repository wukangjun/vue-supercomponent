<template>
	<el-form 
	class="cv-single-camera" 
	ref="form" 
	:model="form" 
	:rules="rules"
	label-width="90px">
		<el-form-item label="摄像头:" prop="channel">
			<el-checkbox-group v-model="form.channel" size="small">
				<el-checkbox label="1" name="type">1号</el-checkbox>
				<el-checkbox label="2" name="type">2号</el-checkbox>
				<el-checkbox label="3" name="type">3号</el-checkbox>
				<el-checkbox label="4" name="type">4号</el-checkbox>
			</el-checkbox-group>
		</el-form-item>
		<el-form-item label="图片张数:" prop="photoNum">
			<el-select size="small" v-model="form.photoNum">
				<el-option label="0张" value="0"></el-option>
				<el-option label="1张" value="1"></el-option>
				<el-option label="2张" value="2"></el-option>
				<el-option label="3张" value="3"></el-option>
				<el-option label="4张" value="4"></el-option>
				<el-option label="5张" value="5"></el-option>
				<el-option label="6张" value="6"></el-option>
				<el-option label="7张" value="7"></el-option>
				<el-option label="8张" value="8"></el-option>
				<el-option label="9张" value="9"></el-option>
				<el-option label="10张" value="10"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="上传模式:" prop="sendtoServer">
			<el-radio-group v-model="form.sendtoServer">
			    <el-radio label="1">保存</el-radio>
			    <el-radio label="0">实时上传</el-radio>
			</el-radio-group>
		</el-form-item>
		<div class='dialog-footer'>
			<el-button type="primary" :loading='submitFalg'  @click="save">{{ $t('action.confirm') }}</el-button>
			<el-button @click='options.flag=false'>{{ $t('action.cancel') }}</el-button>
		</div>
	</el-form>
</template>

<script>
	export default{
		props: {
			options: {}
		},
		data(){
			return{
				camera: '0',
				form:{
					channel: ["1"],					
					interval: '1',
					photoNum: 1,
					resolution: 1,
					quality: 1,
					lightness: 1,
					contrast: 0,
					saturation: 0,
					color: 0,
					sendtoServer: '0'
				},
				submitFalg: false,
				rules: {
					interval: [
						{pattern:/^[0-9]/,message:this.$t("filter.type2"),trigger:'blur,change'},
						{min:1,max:5, message:'长度1-5之间'}						
					],
					quality: {pattern: /^([1-9]{1}|10)$/, message:'1-10的数字', trigger: 'blur, change'},
					lightness: {pattern: /^([1-9]{1}|10)$/, message:'1-10的数字', trigger: 'blur, change'},
					contrast: {pattern: /^(\d{1}|[1-9]\d{1}|1\d{2}|2[0-4]\d{1}|25[0-5])$/, message:'0-255的数字', trigger: 'blur, change'},
					saturation: {pattern: /^(\d{1}|[1-9]\d{1}|1[0-2]{1}[0-7]{1})$/, message:'0-127的数字', trigger: 'blur, change'},
					color: {pattern: /^(\d{1}|[1-9]\d{1}|1\d{2}|2[0-4]\d{1}|25[0-5])$/, message:'0-255的数字', trigger: 'blur, change'}
				}
			}
		},
		methods:{
			save(){
				this.$refs['form'].validate(valid => {
				
					if(valid){
							this.submitFalg=true;
						let params = {
							channel: "",
							color: Number(this.form.color),
							contrast: Number(this.form.contrast),
							enterpriseId: this.$store.getters.carCurrent.enterpriseId,
							interval: Number(this.form.photoNum),
							lightness: Number(this.form.lightness),
							photoNum: this.camera === '1' ? 0 : Number(this.form.photoNum),
							quality: Number(this.form.quality),
							resolution: Number(this.form.resolution),
							saturation: Number(this.form.saturation),
							sendtoServer: Number(this.form.sendtoServer),
							vehicleId: Number(this.$store.getters.carCurrent.vehicleId)
						}						
						if(this.form.channel.length > 0){		
							let _self = this;			
							(function loop(i){
								if(i >= _self.form.channel.length){
									_self.submitFalg = false;
									_self.options.flag = false;
									_self.$message.success('指令下发成功');
									return;
								}
								params.channel = _self.form.channel[i];
								_self.cameraQuest(params).then(data => {
									++i;
									loop(i);
								})
							})(0)
						}else{
							this.submitFalg=false;
							this.$message.error('请先选中摄像头');
							
						}
					}else{
						return false
					}
				})
			},
			cameraQuest(params){
				return this.$http({
					url: this.$COMMON.baseUrl + '/sendOrder/photo',
					params: params
				})
			}
		}
	}
</script>

<style lang="scss">
	.cv-single-camera{
		font-size: 12px;
		.el-input,.el-select{
			width: 173px;
		}
		.el-form-item{
			margin-bottom: 15px;
		}
	}
</style>