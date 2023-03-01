<template>
  <h2>生命周期</h2>
</template>

<script setup lang="ts">
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured,
  onRenderTracked,
  onRenderTriggered,
  onActivated,
  onDeactivated
} from "vue";

/* setup 取代 beforeCreate, created
 * vue的组合式api中, setup中的函数执行相当于在选项api中的beforeCreate和created中执行
 * */

/*
 *创建阶段
 * */
onBeforeMount(() => {
  console.log("挂载DOM节点之前, 此时无法访问DoM ----- onBeforeMount");
});
onMounted(() => {
  console.log("DOM节点挂载完成后执行，此时可以正常访问页面DOM ---- onMounted");
});

/*
 *更新阶段
 * */
 onBeforeUpdate(() => {
  console.log("数据更新时调用，发生在虚拟 DOM 打补丁之前。此时内存中的数据已经被修改，但还没有更新到页面上，可以访问到旧的DOM ---------- onBeforeUpdate");
});
onUpdated(() => {
  console.log("数据更新后调用，此时内存数据已经修改，页面数据也已经更新，可以访问到新的DOM ------------ onUpdated");
});

/*
 *卸载阶段
 * */
 onBeforeUnmount(() => {
  console.log("组件卸载前调用 ------------ onBeforeUnmount");
});
onUnmounted(() => {
  console.log("卸载组件实例后调用 ------------ onUnmounted");
});

/*
 * 其它场景触发
 **/
// 生命周期钩子抛出错误时调用
onErrorCaptured(() => {
    console.log('每当事件处理程序或生命周期钩子抛出错误时调用 --- onErrorCaptured')
}),
// 状态跟踪
onRenderTracked(() => {
    console.log('onRenderTracked---vue3新引入的钩子函数，只有在开发环境有用，用于跟踪所有响应式变量和方法，一旦页面有 update ，就会跟踪他们并返回一个 event 对象')
})
// 状态触发
onRenderTriggered(() => {
   console.log('onRenderTriggered--同样是vue3新引入的钩子函数，只有在开发环境有效，与 onRenderTracked 的效果类似，但不会跟踪所有的响应式变量方法，只会定点追踪发生改变的数据，同样返回一个 event 对象') 
}),
// keep-alive 包裹的组件激活时调用
onActivated(() => {
    console.log('与 keep-alive 一起使用，当 keep-alive 包裹的组件激活时调用')
})
// keep-alive 包裹的组件停用时调用
onDeactivated(() => {
    console.log('与 keep-alive 一起使用，当 keep-alive 包裹的组件停用时调用')
})
</script>
<style scoped></style>
