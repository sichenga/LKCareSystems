<template>
  <!-- 采购详情 -->
  <el-card>
    <!-- 详情 -->
    <div class="details">
      <el-form label-width="auto">
        <el-form-item label="创建时间：">
          {{ data.Dataget?.receiveTime }}
        </el-form-item>
        <el-form-item label="申请人：">
          {{ data.Dataget?.addAccountName }}
        </el-form-item>
        <el-form-item label="品种数：">
          {{ data.Dataget?.counts }}
        </el-form-item>
        <el-form-item label="实际采购成本：">
          {{ data.Dataget?.receiveTime }}
        </el-form-item>
      </el-form>
      <div class="right">
        <h2>{{ data.Dataget?.state }}</h2>
      </div>
    </div>
    <!-- 表格 -->
    <MayTable
      :isoperate="false"
      :tableData="data.tableData"
      :tableItem="data.tableItem"
    />
    <div class="goods">到货凭证</div>
    <div class="demo-image" style="margin-top: 20px">
      <div v-for="fit in fits" :key="fit" class="block">
        <el-image
          :src="url + data.Dataget?.picture"
          fit="fill"
          style="width: 50px; height: 50px"
        />
      </div>
    </div>
  </el-card>
  <!-- 返回 -->'
  <div class="back">
    <el-button @click="back">返回</el-button>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive } from "vue";
import { purchaseFoodslist, Purchaseget } from "@/service/food/FoodApi";
import type { ImageProps } from "element-plus";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

const route = useRoute();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const fits = ["fill"] as ImageProps["fit"][];
const url = import.meta.env.VITE_APP_API_URL + "/";
const data = reactive({
  id: route.params?.id || 0,
  tableData: [] as any,
  Dataget: {} as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "foodName",
      label: "物料名称",
    },
    {
      prop: "unit",
      label: "单位",
    },
    {
      prop: "supplierName",
      label: "供应商",
    },
    {
      prop: "wholePrice",
      label: "批发价",
    },
    {
      prop: "purchasePrice",
      label: "零售价",
    },
    {
      prop: "sellPrice",
      label: "采购价",
    },
    {
      prop: "purchaseCounts",
      label: "采购数量",
    },
    {
      prop: "receiveCounts",
      label: "实际到货数量",
    },
  ],
});

// // 获取采购物品列表
const getlist = async () => {
  const res: any = await purchaseFoodslist(Number(data.id));
  console.log("获取采购物品列表", res);
  if (res.code == 10000) {
    data.tableData = res.data.list;
  }
};
// 单条采购申请信息
const getData = async () => {
  const res: any = await Purchaseget(<number>data.id);
  console.log("单条采购申请信息", res);
  if (res.code == 10000) {
    data.Dataget = res.data;
  }
};

// // 收货验收
// const getlist = (async () => {
//     const res = await purchase()
//     console.log('收货验收', res);
//
// })
onMounted(() => {
  getData();
  getlist();
});

// 返回
const back = () => {
  router.go(-1);
};
</script>

<style lang="less" scoped>
.details {
  height: 160px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;

  .right {
    line-height: 100px;
  }
}

.goods {
  margin-top: 30px;
}

.back {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>
