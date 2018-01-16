<template>
    <div class="body">
<h1>filters的使用</h1>
<pre>
vue2.0里，不再有自带的过滤器，需要自己定义过滤器；

<h3>一、定义的方法：</h3>

注册一个自定义过滤器，它接收两个参数：过滤器 ID 和 过滤器函数，其中过滤器函数接收多个参数。
</pre>
<pre class="details">
<div>content | reverseStr</div>
<span>content:</span>被过滤的对象；
<span>reverseStr:</span>过滤器函数；
<b>图1:</b>  
    this.$filters.reverseStr((value)=>{
     return value.split('').reverse().join('')
})


</pre> 
<pre class="right"> 
<h3>二、过滤器操作符 '|'；</h3>
支持多重过滤，前提是这两个过滤器处理的不冲突;
能将上一个过滤器输出内容作为下一个过滤器的输入内容:
</pre>
<pre class="details">
<div>content | reverseStr |  removeNum </div> 
<b>图2:</b>  
  filters.removeNum=function(value){
     return value.replace(/[^0-9]/g, '');
}
</pre> 
<pre>

如在公共文件filter.js中已存在的过滤器，在调用中可直接运用操作符加在需要过滤的对象之后即可：
<h3>三、调用示例：</h3>
 过滤器方法里第一个参数value默认为使用这个过滤器的data值；

<p>1. 时间过滤器（format）: </p>
(1)模版中使用：v-html:data|format(item);
(2)js中使用： this.$filter.format('data', 'item')

<p>2.文字是否有值(isValue)</p>
(1)模版中使用：v-html:data|isValue(item);
(2)js中使用： this.$filter.isValue('item')
<p>车辆数是否在线(isOnline)</p>
在本项目中有多处字段显示需要前端人员给予相应的过滤处理，
示例如下：
<p>3.车牌颜色过滤（plateCodeColor):</p>
(1)模版中使用：v-html:data|plateCodeColor(item);
(2)js中使用： this.$filter.plateCodeColor(data)
<p>4.车辆使用状态(isStuas)</p>
<p>5.油路断开状态(oilWayStatus)</p>
<p>6.电路显示状态(circuitStatus)</p>
<p>7.车门加锁状态(doorLockStatus)</p>
<p>8.车辆定位状态(locateStatus)</p>
<p>9.车辆运营状态(operateStatus )</p>
<p>10.多媒体管理类型(mediaType)</p>
<p>11.方向类型(direction)</p>
<p>12.报警级别类型(alarmLevel)</p>
<p>13.承重(alarmLevel)</p>
参数说明：
item:过滤之后输出时间格式，可以是多个参数；
data:使用这个过滤器的data值；
<h3>五、备注：</h3>
在filter.js文件中未存在的，根据实际需求亦可自行添加至filter.js文件中,实例如图2；
v-text里用过滤器失效，原因是在vue2.0里 管道符‘|’只能用在mousetache和v-bind中

</pre>  
    </div>

</template>
<script>
export default {
    data () {
    return {
      content: 'abcd1234'
    }
  },
  methods:{
      
  }
  
}
</script>
<style scoped lang="scss">

.body{
    p{
        color:red;
    }
    span{
        color:#00f;
    }
    b{
        color:#f0f;
    }
      .details{
    width:100%;
    background:#f7f7f7;
}

}


</style>

