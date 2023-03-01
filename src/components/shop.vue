<template>
  <h2>computed计算属性</h2>
  <div>
    <table border style="width: 800px">
      <thead>
        <tr>
          <th>名称</th>
          <th>数量</th>
          <th>单价</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="index" v-for="(item, index) in data">
          <td align="center">{{ item.name }}</td>
          <td align="center">
            <button @click="addShopNum(item, false)">-</button>
            {{ item.num }}
            <button @click="addShopNum(item, true)">+</button>
          </td>
          <td align="center">{{ item.price * item.num }}</td>
          <td align="center">
            <button @click="delShop(index)">删除</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <td></td>
        <td></td>
        <td></td>
        <td align="center">总价：{{ $total }}</td>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";

type Shop = {
  name: string;
  num: number;
  price: number;
};
const data = reactive<Shop[]>([
  {
    name: "裤子",
    num: 1,
    price: 100,
  },
  {
    name: "鞋子",
    num: 1,
    price: 200,
  },
  {
    name: "羽绒服",
    num: 1,
    price: 300,
  },
])

let $total = ref(0);

const addShopNum = (item: Shop, type: boolean): void => {
  if (type) {
    item.num ++
  } else {
    item.num -= item.num > 0 ? 1 : 0;
  }
};

const delShop = (index: number) => {
  data.splice(index, 1);
};

$total = computed<number>(() => {
  return data.reduce((pret, next) => {
    return pret + next.num * next.price;
  }, 0);
});
</script>
<style scoped></style>
