<template>
  <!-- dialog写在market文件夹下 -->
  <div class="app-container">
    <el-card>
      <el-steps
        style="max-width: 200px; margin: 20px auto"
        :active="isShou"
        finish-status="success"
      >
        <el-step title="选择服务" />
        <el-step title="订单确定" />
      </el-steps>
      <div class="body-size-is">
        <!-- 选择服务 -->
        <Hospitalized v-if="isShou == 0" @isshou="houseShou" />
        <!-- 订单确定 -->
        <OrderList v-else @isshou="houseShou" />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, provide } from "vue";
import Hospitalized from "@/components/hospitalized/hospitalizedList.vue";
import type { orderAdds } from "@/service/market/marketType";
import { useRoute } from "vue-router";
import OrderList from "@/components/hospitalized/orderList.vue";
const route = useRoute();
const isShou = ref(0);

const houseShou = (val: any) => {
  isShou.value = val;
};
let ruleForm = reactive<orderAdds>({
  elderlyId: Number(route.query.oldId), //老人Id
  begId: null, //床位ID
  begPrice: null, //床位单价
  days: null, //入住天数
  startDate: "", //入住日期
  foodPrice: null, // 套餐单价
  servicePrice: null, //护理费
  cashPledge: null, //押金
  livingPrice: null, // 一次性生活费
  payDays: null, //入院费用核定天数  分几期付款
  state: null, // 保存暂不提交 0  保存并提交1
  services: [], //选择服务ID
  files: [], //合同协议 证书
});
// 向子组件提供数据
provide("ruleForm", ruleForm);
</script>

<style lang="less" scoped>
.body-size-is {
  margin-left: 80px;
  margin-right: 150px;
}
</style>
