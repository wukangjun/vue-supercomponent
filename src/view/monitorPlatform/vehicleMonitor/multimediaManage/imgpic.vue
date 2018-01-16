<template>
	<div style="text-align:center">
		<img :src="picture" class='defaultImg'>
	</div>
</template>

<script type="text/javascript">
	import picture from '@/assets/img/loading.gif'
	export default {
		props:{
			options:{}
		},
		data(){
			return{
				picture:picture
			}
		},
		//监听弹框，每次弹框消失后重置弹框(仅限弹框内容绑定的是弹框内部数据，而不是options传入的)
        watch:{
            'options.flag'(newVal){
                if(!newVal){
                    this.options.name = "";
                }
            }
        },
		mounted(){
			var newImg = new Image()
            newImg.src = this.options.imgurl;
            newImg.onload = () => { // 图片加载成功后把地址给原来的img
                this.picture = newImg.src
            }
		}
	}
</script>
<style>
	.defaultImg{
		background: '@/assets/img/loading.gif';
		max-width: 360px;
		max-height: 360px;
	}
</style>

