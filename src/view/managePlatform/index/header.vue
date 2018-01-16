<template>
	<div class="my-header">
		<!--<div class='managerMenus'>{{$store.getters.manageMenuTitle}}</div>-->
		<el-dropdown class="user-drop" @command="userEvent">
			<div class="userBtn">
				<span>{{$store.getters.user.enterpriseName}}</span><img :src="Avatar" height="40" width="40" class="userImg">
			</div>
			<el-dropdown-menu slot="dropdown" class="user-drop-item">
				<el-dropdown-item @click.native="userSetting">设置</el-dropdown-item>
				<el-dropdown-item command="switch">切换平台</el-dropdown-item>
				<el-dropdown-item command="exit">退出登录</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
		<el-dialog :close-on-click-modal="false" :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<userSetting  :options="dialog" ></userSetting>
		</el-dialog>
	</div>
</template>
    
<script>
	import Avatar from '@/assets/img/admin.png'
  import userSetting from './setting/userSetting.vue'
	export default{
			components: {userSetting},
		data(){
			return{
				Avatar: Avatar,
				dialog:{
					flag: false,
				  title: '',
				  size: 'full',
				  name: '',
				  elTabPanes:[
          {name:'用户安全',component:'modifyPass'},
          ]
				},

				
			}
		},
		methods: {
			 //设置的窗口
		  userSetting(){
		  	this.dialog.flag = true;
		  	this.dialog.title = "设置";
		  	this.dialog.name = "userSetting";
		    this.dialog.size = 'dialog-small';
		  },
			userEvent(command){
				switch(command){
					case 'switch':
						this.$router.push('/monitor/home')
					break;
					case 'exit': 
						this.$router.push('/login');
						this.$store.dispatch('exit');
						localStorage.removeItem('token');
						localStorage.removeItem('user');
						localStorage.removeItem('mapType');
				
					break;
				}
			}
		
		 
		},

		mounted(){
			console.log('%c 基友，加入我们和我们一起干吧！', 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:28px;');
		}
	}
</script>

<style lang="scss">
	$height: 60px;
	$background: #20a0ff;
	.my-header{
		height: $height;
		background: $background;
		.user-drop{
			float: right;
			.userBtn{
				text-align: center;
				height: $height;
				line-height: $height;
				background: #20a0ff;
				color: #fff;
				padding-right: 10px;
				cursor: pointer;
				span{
					font-size: 12px;
					float: left;
				}
				.userImg{
					float: right;
					border-radius: 20px;
					margin: 10px;
				}
			}
		}
		.managerMenus{
			display: inline-block;
			position: relative;
			width: auto;
			height: 60px;
			line-height: 60px;
			left: 300px;
			font-size:12px;
			color:#fff;
		}
		.menusTextLeft{
			left:50px !important;
		}	
	}
</style>