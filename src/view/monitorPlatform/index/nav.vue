<template>
	<div class="leftSide">
		<div class="side-logo">		
			<img :src="logo" height="38" width="156" style="margin: 10px">
			<i class="el-icon-menu toggleBtn" @click="transfer()"></i>
		</div> 
		<div class="scrollbar">
			<el-scrollbar class="accordion_area" wrap-class="scrollbar">
				<div class="big_menu">
					<el-select class="side-select" v-model="select" filterable clearable placeholder="快速搜索页面">
						<el-option
							v-for="item in search"
							:key="item.url"
							:label="item.title"
							:value="item.url">
						</el-option>
					</el-select>
					<el-collapse v-model="activeName" accordion class="left-accordion">
						<el-collapse-item v-for="m in menu" :name="m.index" :key="m.index">
							<template slot="title">
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
				</div>
			</el-scrollbar>		
		</div>
	</div>
</template>

<script>
	import logo from '@/assets/img/logo.png'
	export default{
		props: {
			menu: {},
			search: {}
		},
		data(){
			return {
				select: "",
				toggleFlag: true,
				logo: logo
			}
		},
		methods: {
			transfer(){
				this.toggleFlag = !this.toggleFlag;
				this.$emit('toggle', this.toggleFlag)
			}
		},
		computed: {
			activeName:{
				get(){
					return localStorage.getItem('active') ? localStorage.getItem('active') : '1'
				},
				set(val){
					localStorage.setItem('active', val);
				}
			}
		},
		watch: {
			select(newVal, oldVal){
				console.log(this.$router)
				this.$router.push(newVal)
			}
		}
	}
</script>

<style lang="scss">
	$accHeight: 44px;
	$height: 60px;
	$lightBlue: #20a0ff;
	$sideBg: #eef1f6;
	$sideHover: #d1dbe5;
	.router-link-active{
		background: #d1dbe5;
		color: #fff;
	}
	.leftSide{
		.accordion_area{
			position: absolute;
			top: $height;
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
		
		}
	}
</style>