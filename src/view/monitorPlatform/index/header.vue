<template>
	<div class="monitor-header">
		<img :src="headerSwitch[$COMMON.switch]" height="38" width="156" style="margin: 10px;float:left">
		<ul class="cv-nav">
			<router-link 
				tag="li"
				ref="nav"
				:to="{path:menu.url}"
				class="cv-nav-item"
				v-for="(menu, index) in $store.getters.monitorMenu"  
				:key="menu.url"
				@mouseenter.native="showMenu(menu, index)" 
				@mouseleave.native="hideMenu(menu, index)">
				<el-tooltip :content="menu.title" placement="right" effect="light" 
				:enterable="false"
				v-if='menu.title.length > 4'>
					<div class="title">
						<cv-icon class="icon" :name="menu.icon" color="#fff" size="20"></cv-icon>
						<span>{{menu.title.substring(0,4)+"..."}}</span>
					</div>
				</el-tooltip>
				<div class="title" v-if='menu.title.length < 5'>
					<cv-icon class="icon" :name="menu.icon" color="#fff" size="20"></cv-icon>
					<span >{{menu.title}}</span>
				</div>
				<ul class="cv-dropdown" ref="menu" 
					v-show="menu.child.length==0?false:true" 
					:style="menu.child.length > 0 && menu.child[0].child.length>0 ?{width: menu.child.length*130+'px'}:{width: 130+'px'}">
					<router-link tag="li" :to="{path: child.url==''?'404':child.url}" :key="child.url" v-for="child in menu.child"  v-if='child.child.length > 0 ? false : true' class="second-child" active-class="childUrl">
						<div class="child">{{child.title}}</div>
					</router-link>
					<li v-for="child in menu.child"  :key="child.title" class="secondTitle"  v-if='child.child.length > 0 ? true : false'>
						<div class="titles">{{child.title}}</div>
						<cv-scrollbar style="max-height:400px">
							<router-link tag="li" :to="{path: item.url==''?'404':item.url}" :key="item.url" v-for="item in child.child" class="last-child" active-class="childUrl">
								<div class="child">{{item.title}}</div>
							</router-link>
						</cv-scrollbar>
					</li>
				</ul>
			</router-link>
		</ul>
          
  <div class="slider"  v-show="isShow" v-clickoutside='hideSearch'>
    <i class="el-icon-search searchIcon" ></i>	
    <el-select v-model="selectTo" filterable clearable  placeholder="请点击搜索" >
        <el-option       
        v-for="(menu,index) in $store.state.mtindex.searchList"  
        :key="menu.index"
        :label="menu.title"
        :value="menu.url">
        </el-option>
    </el-select>
  </div> 
  	<i class="el-icon-search searchTp" @click="showSearch"  v-show="!isShow"></i>	
  	<div v-clickoutside='hidenCard'>
		<div style='position:absolute;right:0;top:0px;'>
			<div class="userBtn" @click="toogleCard">
				<el-badge is-dot :hidden="orderNum > 0 ? false : true">
					<img :src="user1" class="userImg">
				</el-badge>
				<i :class="cardFlag ? 'el-icon-arrow-up' :'el-icon-arrow-down'" style="float: right;height: 60px;line-height: 60px; width: 25px;" ></i>
			</div>
		</div>
		<div class="user-drop" v-show='cardFlag' >
			<el-card class="user-drop-item" style='position: relative;z-index: 9999;'>
				<div slot="header" class="clearfix header">
					<img :src="user1" class='cardImg'>
					<div class="companyName">
						<span>{{$store.getters.user.enterpriseName}}</span>
					</div>
				</div>
				<div class="text item" @click="userSetting"><span>设置</span></div>
				<div class="text item" v-show="(this.$store.getters.user.accountType == 4 ||this.$store.getters.user.accountType == 5)" @click="inspectAnswer"><span>查岗应答</span></div>
				<div class="text item" @click="commands"><el-badge :value="orderNum" :max="99"><span>指令追踪</span></el-badge></div>
				<div class="text item" @click="userEvent('switch')"><span>切换平台</span></div>
				<div class="text item" @click="userEvent('exit')"><span>退出登录</span></div>
			</el-card>
		</div>
	</div>
	<el-dialog :close-on-click-modal="false" :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
		<component :is="dialog.name" :options="dialog" :dataList="dataList"></component>
	</el-dialog>
  <!-- 查岗应答回复二级弹框 -->
	<el-dialog :close-on-click-modal="false" :visible.sync="dialog.dialog1.flag" :title="dialog.dialog1.title" :custom-class="dialog.dialog1.size">
		<component :is="dialog.dialog1.name" :options="dialog.dialog1"></component>
	</el-dialog>

</div>
</template>
<script>
import user1 from "@/assets/img/user3.png";
import user2 from "@/assets/img/user2.png";
import alarms from "./alarms.vue";
import commands from "./commands.vue";
import inspectAnswer from './inspectAnswer.vue'
import answer from './answer.vue'
import userSetting from "./setting/userSetting.vue";
export default {
  components: { alarms, commands, userSetting, inspectAnswer,answer},
  data() {
    return {
      selectTo: "",
      isShow: false,
      orderNum: 0,
      // 登陆图片切换
      headerSwitch: {
          shihang: require('@/assets/img/logo.png'),
          gonganju: require('@/assets/img/gonganlogo.png'),
          zhatuche: require('@/assets/img/logo.png')
      },
      dataList: [],
      cardFlag: false,
      user1: user1,
      user2: user2,
      activeIndex: "1",
      dialog: {
        flag: false,
        title: "",
        size: "full",
        name: "",
        dialog1: {
          flag: false,
          title: "回复",
          size: "tiny",
          name: "answer",
          params:{
            rowId:'',
            ownersId:'',
            context:'',
            refresh1:false,
            refresh2:false,
          }
        }
      },
    };
  },
  methods: {
    inspectAnswer(){
      this.cardFlag = false;
      this.dialog.flag = true;
      this.dialog.title = '查岗应答';
      this.dialog.size = 'dialog-large'
      this.dialog.name = 'inspectAnswer'
    },
    commands() {
      this.cardFlag = false;
      this.dialog.flag = true;
      this.dialog.title = this.$t("common.order.orderWacth");
      this.dialog.name = "commands";
    },
    alarms() {
      this.dialog.flag = true;
      this.dialog.title = this.$t("common.alarm.alarmWacth");
      this.dataList = this.$store.getters.onlineList;
      this.dialog.name = "alarms";
    },
    //设置的窗口
    userSetting() {
      this.cardFlag = false;
      this.dialog.flag = true;
      this.dialog.title = "设置";
      this.dialog.name = "userSetting";
      this.dialog.size = "dialog-middle";
    },
    // 显示下拉菜单
    showMenu(menu, index) {
      if (this.$service.isArray(menu.child) && menu.child.length > 0) {
        this.$myJq.show(this.$refs["menu"][index]);
      }
    },
    toogleCard() {
      if (this.cardFlag) {
        this.cardFlag = false;
      } else {
        this.cardFlag = true;
      }
    },
    // 隐藏下拉菜单
    hideMenu(menu, index) {
      this.$myJq.hide(this.$refs["menu"][index]);
    },
    menuClick(index) {
      this.$refs["nav"].forEach(val => {
        this.$myJq.removeClass(val.$el, "faterUrl");
      });
      setTimeout(_ => {
        this.$myJq.addClass(this.$refs["nav"][index].$el, "faterUrl");
      }, 10);
    },
    userEvent(command) {
      this.cardFlag = false;
      switch (command) {
        case "switch":
          return this.$router.push("/index");
        case "exit":
          this.$router.push("/login");
          this.$store.dispatch("exit");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("mapType");
          break;
      }
    },
    hidenCard() {
      if (this.cardFlag) {
        this.cardFlag = false;
      }
    },
    hideSearch() {
      this.isShow = false;
    },
    showSearch() {
      this.isShow = true;
    },
    // 显示相应的路由菜单高亮
    showCurrentNav(routerName) {
      let fistTitle = this.$store.getters.monitorMenu;
      let secondTitle = this.$store.getters.getSecondMenus;
      let lastTitle = this.$store.state.mtindex.searchList;
      lastTitle.length &&
        lastTitle.forEach(val => {
          if (val.url == routerName) {
            if (fistTitle[val.fistCount].child.length > 0) {
              if (secondTitle[val.num].child.length > 0) {
                let title =
                  fistTitle[val.fistCount].title +
                  " / " +
                  secondTitle[val.num].title +
                  " / " +
                  val.title;
                this.$store.dispatch("upMenuTitle", title);
              } else {
                let title = fistTitle[val.fistCount].title + " / " + val.title;
                this.$store.dispatch("upMenuTitle", title);
              }
            }
            return this.menuClick(val.fistCount);
          }
        });
    }
  },
  mounted() {
    this.userEvent();
    console.log(
      "%c 基友，加入我们和我们一起干吧！",
      "background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:28px;"
    );
  },
  watch: {
    "$store.getters.sendDirective"(newval) {
      this.orderNum = this.$store.getters.sendDirective.length;
    },
    "dialog.flag"(newval) {
      if (!newval) {
        this.dialog.name = "";
        this.dialog.title = "";
      }
    },
    "$store.state.mtindex.searchList"(newVal) {
      // 头部数据结构加载完毕延迟1s进行dom渲染
      setTimeout(_ => {
        this.showCurrentNav(this.$route.path);
        this.$emit('menu-loaded');
      }, 50);
    },
    "$route"(newVal) {
      this.showCurrentNav(newVal.path);
    },
    "selectTo"(newVal, oldVal) {  
      if (newVal != "") {
        this.$router.push(newVal);
      } else {
        this.$router.push("/monitor/404");
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../../assets/css/common.scss";
.el-select-dropdown__item.selected {
  color: #000;
  opacity: 0.2;
  background: #ffffff;
}
.el-select-dropdown__item.selected.hover {
  background-color: #e4e8f1;
}
// .circle-close .is-show-close{
//   position: relative;
//   z-index:99999;
// }
$height: 60px;
$menuH: 32px;
$background: #191718;
$hover: #1284d8;
.monitor-header {
  height: $height;
  background: $background;

  .searchIcon {
    font-family: anticon;
    font-size: 20px;
    position: absolute;
    left: 8px;
    z-index: 99999;
    top: -10px;
    color: #fff;
    text-align: left;
    line-height: 60px;
  }
  .searchTp {
    color: #fff;
    font-size: 24px;
    line-height: 60px;
    position: absolute;
    right: 98px;
    cursor: pointer;
  }

  .slider {
    position: absolute;
    right: 98px;
    top: 12px;
    width: 214px;
    .el-input .el-input__inner {
      padding-left: 30px;
      opacity: 0.5;
      background: #ffffff;
      border-radius: 2px;
    }
    animation: mymove 0.5s;
    -webkit-animation: mymove 0.5s; /*Safari and Chrome*/
  }
  @keyframes mymove {
    from {
      width: 0;
    }
    to {
      width: 214px;
    }
  }
  @-webkit-keyframes mymove {
    from {
      width: 0;
    }
    to {
      width: 214px;
    }
  }
  .cv-nav {
    margin-left: 25px;
    float: left;

    .faterUrl {
      margin-bottom: -2px;
      border-bottom: 2px solid #eba239;
    }
    .cv-nav-item {
      display: inline-block;
      width: $height;
      height: $height;
      position: relative;
      cursor: pointer;
      box-sizing: border-box;
      &:hover {
      }
      .title {
        height: 100%;
        text-align: center;
        color: #fff;
        .icon {
          display: block;
          font-size: 24px;
          padding: 8px 0 3px 0;
          height: 22px;
        }
      }
      .cv-dropdown {
        position: absolute;
        top: 100%;
        z-index: 9999;
        background: #fff;
        border: 1px solid #d1dbe5;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12),
          0 0 6px 0 rgba(0, 0, 0, 0.04);
        margin-top: 0;
        display: none;
        .secondTitle {
          float: left;
          width: 130px;
          text-align: center;
          box-sizing: border-box;
          border-right: 1px solid #fff;
          &:last-child {
            border-right: 0;
          }
          .titles {
            height: $menuH;
            line-height: $menuH;
            color: #97a8be;
          }
          .last-child {
            height: $menuH - 6;
            line-height: $menuH - 6;
            &:hover {
              background: #eaeeef;
            }
          }
          .childUrl {
            color: #20a0ff;
          }
          li > ul > li:hover {
            // background: #d1dbe5;
            // color: #fff;
          }
        }
        .cv-dropdown-item {
          height: 36px;
          line-height: 36px;
          cursor: pointer;
          &:hover {
            background: #d1dbe5;
          }
          .child {
            padding-left: 10px;
          }
        }
      }
    }
  }
  .order-alarm {
    float: right;
    margin: 16px 20px 0 0;
    .el-badge {
      margin-right: 25px;
    }
    i {
      width: 32px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border-radius: 50%;
      background: #eff2f7;
      font-size: 12px;
      color: black;
    }
    i:hover {
      color: white;
      background: #1d8ce0;
    }
    .glyphicon {
      position: relative;
      top: 1px;
      display: inline-block;
      font-family: "Glyphicons Halflings";
      font-style: normal;
      font-weight: 400;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      line-height: 2;
    }
  }
  .second-child {
    float: left;
    width: 130px;
    text-align: center;
    box-sizing: border-box;
    border-right: 1px solid #fff;
    height: 26px;
    line-height: 26px;
    &:hover {
      background: #eaeeef;
    }
  }
  .userBtn {
    text-align: center;
    height: $height;
    line-height: $height;
    color: #fff;
    cursor: pointer;
    span {
      font-size: $font;
      float: left;
    }
    .userImg {
      background: #d8d8d8;
      width: 60px;
      height: 60px;
    }
    .el-badge {
      .el-badge__content.is-fixed {
        top: 10px;
      }
      .el-badge__content.is-dot {
        width: 10px;
        height: 10px;
      }
    }
  }
  .user-drop {
    position: absolute;
    top: 60px;
    right: 0px;
    .el-card {
      border: 0px !important;
      border-radius: 0px !important;
      margin-top: 1px;
      .el-card__header {
        background: #2c3239;
        text-align: center;
        padding: 0px;
        border-bottom: 0px;
        .cardImg {
          margin-top: 22px;
          border: 4px solid rgba(255, 255, 255, 0.27);
          width: 80px;
          height: 80px;
          border-radius: 100%;
        }
        .companyName {
          height: 28px;
          line-height: 28px;
          margin-top: 7px;
          font-family: ArialMT;
          font-size: 20px;
          color: #ffffff;
          letter-spacing: 0;
          text-align: center;
        }
      }
      .el-card__body {
        background: #1d222d;
        width: 284px;
        // height: 190px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #919499;
        letter-spacing: 0;
        line-height: 37px;
        text-align: center;
        padding: 0px;
        .item {
          height: 38px;
          line-height: 38px;
          cursor: pointer;
          &:hover {
            background: #3f454c;
            color: #fff;
          }
        }
		.el-badge {
			.el-badge__content.is-fixed {
				top: 15px;
				right: -10px;
			}
			.el-badge__content{
				border:none;
			}
		}
      }
    }
    .header {
      background: #2c3239;
      width: 284px;
      height: 160px;
    }
  }
}
</style>
