<template>
  <div @click="toEmits">{{ props.title }}</div>
</template>

<script setup lang="ts">
/*
 * 父子组件通信
 * 子组件通过 defineProps 接收父组件传过来的数据，子组件通过 defineEmits 定义事件发送信息给父组件
 **/

// // defineEmits,defineProps无需导入，直接使用也行
const props = defineProps({
    title: {
        type: String,
        required: true,
        default: '李某热'
    }
})
// 获取父组件传递过来的数据
console.log(props.title)

const emits = defineEmits(['getClid'])

// 子组件向父组件传递数据
const toEmits = () => {
    emits('getClid', '子组件向父组件传递数据')
}

</script>
<style scoped>
</style>