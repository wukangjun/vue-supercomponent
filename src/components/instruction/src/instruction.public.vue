<template>
	<el-dialog 
	:visible.sync="dialog.flag" 
	:title="dialog.title" 
	:custom-class="dialog.size">
		<component :is="dialog.name" :options="dialog"></component>
	</el-dialog>
</template>

<script>
	export default {
		components: {
			// 监听
			monitor: require('../model/monitor-instruction/monitor'),
			// 录音
			record: require('../model/record-instruction/record'),
			// 事件追加
			eventAdd: require('../model/event-add-instruction/event.add'),
			// 事件更新
			eventUpdate: require('../model/event-update-instruction/event.update'),
			// 行驶速度记录
			driverRecord: require('../model/driver-record-instruction/driver.record'),
			// 位置信息记录
			locationMessage: require('../model/location-message-instruction/location.message'),
			// 事件疑点记录
			eventDoubtful: require('../model/event-doubtful-instruction/event.doubtful'),
			// 超时驾驶记录
			overtimeDrive: require('../model/overtime-drive-instruction/overtimer.drive'),
			// 驾驶人身份证
			driverIdentity: require('../model/driver-identify-instruction/driver.identify'),
			// 外部供电记录
			externalPower: require('../model/external-power-instruction/external.power'),
			// 参数修改记录
			paramsModify: require('../model/params-modify-instruction/params.modify'),
			// 速度状态日志
			speedStatus: require('../model/speed-status-instruction/speed.status'),
			// 设置车辆信息
			setVehiclemessage: require('../model/set-vehiclemessage-instruction/set.vehiclemessage'),
			// 设置安装日期
			setInstalldate: require('../model/set-installdate-instruction/set.installdate'),
			// 配置状态量
			configStatus: require('../model/config-status-instruction/config.status'),
			// 设置时间
			setTimer: require('../model/set-timer-instruction/set.timer'),
			// 设置脉冲系数
			setPulse: require('../model/set-pulse-instruction/set.pulse'),
			// 设置初始里程
			setInitmileage: require('../model/set-initmileage-instruction/set.initmileage'),
			// 拍照
			photo: require('../model/photo-instruction/photo'),
			// 视频
			videos: require('../model/video-instruction/video'),
			// 文本下发
			textIssue: require('../model/text-issue-instruction/text.issue'),
			// 锁车
			lockcar: require('../model/lockcar-instruction/lockcar'),
			// 媒体上传
			mediaUpload: require('../model/media-upload-instruction/media.upload'),
			// 媒体检索
			mediaSearch: require('../model/media-search-instruction/media.search'),
			// 查询终端参数
			queryTerminal: require('../model/query-terminal-instruction/query.terminal'),
			// 平台协议分组
			protocolGroup: require('../model/protocol-group-instruction/protocol.group'),
			// 车辆点播追加
			vehicleInfoAdd: require('../model/vehicleinfo-add-instruction/vehicleinfo.add'),
			// 车辆点播更新
			vehicleInfoUpdate: require('../model/vehicleinfo-update-instruction/vehicleinfo.update'),
			//无线升级
			remoteUpdata: require('../model/remoteUpdata/setting'),
			//切换服务器
			serverSet: require('../model/serverSet/server-setting'),
			//提示是否发送指令
			sendMes: require('../model/sendMessage/send-message'),
		},
		data(){
			return {
				dialog: {
					flag: false,
					title: '--',
					size: 'dialog-small',
					name: '',
					id: '',
					callback: "",
					enterpriseId: '',
					url:'',
					type:''
				}
			}
		},
		methods: {
			setOptions(name, title, id, enterpriseId, size, callback,url,type){
				this.dialog.name = name;
				this.dialog.url=url,
				this.dialog.type=type,
				this.dialog.title = title;
				this.dialog.id = id;
				this.dialog.enterpriseId = enterpriseId;	
				this.dialog.size = size;
				this.dialog.callback = callback;
			}
		},
		watch: {
			'dialog.flag'(newVal){
				if(!newVal){
					this.dialog.name = "";
					document.body.removeChild(this.$el);
				}	
			}
		}
	}
</script>