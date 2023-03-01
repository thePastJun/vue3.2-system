<template>
  <!-- <shop /> -->
  <lifecycle />
  <delivery @getClid="getCild" :title="msg" />
  <div>
    {{ childs }}
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 计算属性 -- computed  简单案例购物车
// import shop from '@/components/shop.vue'
// 生命周期
import lifecycle from "@/components/lifecycle.vue";
// 组件传值
import delivery from "@/components/delivery.vue";
// 父组件传值给子组件
const msg = ref("父组件传值给子组件");
let childs = ref("");
// 接收子组件传过来的数据
const getCild = (e: any) => {
  console.log(e, "接收子组件传过来的数据");
  childs.value = e;
};
</script>

<style scoped></style>
