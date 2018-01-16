<template>
	<div class="leftSide">
		<div class="side-logo">		
			<img :src="headerSwitch[$COMMON.switch]" height="38" width="156" style="margin: 10px">
			<i class="el-icon-menu toggleBtn" @click="transfer()"></i>
		</div> 		
			<div class="big_menu">
				<el-select class="side-select" v-model="select" filterable clearable placeholder="快速搜索页面" >
					<el-option
						v-for="item in search"
						:key="item.child.url"
						:label="item.child.title"
						:value="item.child.url"
						>
					</el-option>
				</el-select>
			<cv-scrollbar class="accordion_area">
				<el-collapse v-model="activeName" accordion class="left-accordion">
					<el-collapse-item v-for="m in menu" :name="m.index+''" :key="m.index">
						<template slot="title">
							<cv-icon name="order"></cv-icon>
							{{m.title}}
						</template>
						<router-link 
						tag="li"
						v-for="child in m.child" 
						:to="{path: child.url}" 
						:key="child.url"
						class="link">{{child.title}}</router-link>
					</el-collapse-item>
				</el-collapse>
			</cv-scrollbar>		
		</div>
	</div>
</template>

<script>
	import logo from '@/assets/img/logo.png'
	export default{
		props: {
			menu: {},
			search: {},
		},
		data(){
			return {
				select: "",
				toggleFlag: true,
				logoImg: logo,
				activeName:'',
				// 登陆图片切换
				headerSwitch: {
					shihang: require('@/assets/img/logo.png'),
					gonganju: require('@/assets/img/gonganlogo.png'),
					zhatuche: require('@/assets/img/logo.png')
				}
			}
		},
		methods: {
			transfer() {
				this.toggleFlag = !this.toggleFlag;
				this.$emit('toggle', this.toggleFlag)
			},
			getRoute() {			
				let dataList = this.$store.state.index.searchList;
				let menusList=this.$store.state.index.menus;
				for (var i = 0; i < dataList.length; i++) {
					if (this.$route.path === dataList[i].child.url) {
						this.activeName = dataList[i].index.toString();
						for(let k=0;k<menusList.length;k++){
							if(menusList[k].index==dataList[i].index){
								let mainMenu=menusList[k].title;
								let lastMenu=dataList[i].child.title;
								this.$store.dispatch('getMenuTitle',mainMenu+">"+lastMenu);
								break;
							}
						}
					}
				}
			}

		},
		watch: {
			'select'(newVal, oldVal) {
				this.$router.push(newVal)
			},
			'$route'(newVal) {
				this.getRoute();
			},
			'$store.state.index.searchList'(){
				this.getRoute();
			}

		},
		mounted(){
			console.log(this.search)
		}
}
</script>

<style lang="scss">
	$accHeight: 44px;
	$height: 60px;
	$lightBlue: #20a0ff;
	$sideBg: #eef1f6;
	$sideHover: #d1dbe5;
	.leftSide{
		.router-link-active{
			background: #d1dbe5;
			color: #fff;
		}
		.accordion_area{
			position: absolute !important;
			top: 120px;
			bottom: 0;
			width: 100%;
		}
		.scrollbar{
			position: absolute;
			top: 0;
			bottom: 0;
			width: 100%;	
		}
	}
	.side-logo{
		height: $height;
		line-height: $height;
		background: $lightBlue;
		text-align: center;
		.toggleBtn{
			position: absolute;
			left: 100%;
			padding: 22px 10px;
			font-size: 16px;
			color: #fff;
		}
	}
	.side-select{
		width: 92%;
		margin: 10px 4%;
	}
	.left-accordion{
		width: 250px;
		.el-icon-arrow-right{
			float: right;
			line-height: $accHeight
		}
		.el-collapse-item__content{
			padding: 0;
		}
		.el-collapse-item__header{
			background: $sideBg
		}
		.el-collapse-item__wrap{
			background: #e4e8f1
		}
		.link{
			display: block;
			height: $accHeight;
			line-height: $accHeight;
			text-decoration: none;
			padding-left: 36px;
			cursor: pointer;
		}
	}
</style>