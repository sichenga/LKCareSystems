<template>
  <!-- 采购详情 -->
  <el-card>
    <!-- 详情 -->
    <div class="details">
      <el-form label-width="auto">
        <el-form-item label="创建时间：">
          {{ data.Dataget.receiveTime }}
        </el-form-item>
        <el-form-item label="申请人：">
          {{ data.Dataget.addAccountName }}
        </el-form-item>
        <el-form-item label="品种数：">
          {{ data.Dataget.counts }}
        </el-form-item>
        <el-form-item label="实际采购成本：">
          <!-- {{ oldName.Dataget.receiveTime }} -->
        </el-form-item>
      </el-form>
      <div class="right">
        <h2>{{ data.Dataget.state }}</h2>
      </div>
    </div>
    <!-- 表格 -->
    <MayTable
      :tableData="data.tableData"
      :tableItem="data.tableItem"
      :isoperate="false"
    />
    <div class="goods">到货凭证</div>
    <div class="demo-image" style="margin-top: 20px">
      <div v-for="fit in fits" :key="fit" class="block">
        <el-image style="width: 50px; height: 50px" :src="url" fit="fill" />
      </div>
    </div>
  </el-card>
  <!-- 返回 -->'
  <div class="back">
    <el-button @click="back">返回</el-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, defineAsyncComponent } from "vue";
import { purchase } from "@/service/food/FoodApi";
import type { ImageProps } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
import { useRoute } from "vue-router";
const route = useRoute();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const fits = ["fill"] as ImageProps["fit"][];
const url =
  "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";
const data = reactive({
  id: "" as any,
  tableData: [] as any,
  Dataget: [] as any,
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

// 获取采购物品列表
// const getlist = (async () => {
//     oldName.id = route.query.id
//     const res: any = await purchaseFoodslist(oldName.id)
//     console.log("获取采购物品列表", res);
//     if (res.code == 10000) {
//         oldName.tableData = res.oldName.list
//     }
// })
// // 单条采购申请信息
// const getData = (async () => {
//     const res: any = await Purchaseget(oldName.id)
//     console.log("单条采购申请信息", res);
//     if (res.code == 10000) {
//         oldName.Dataget = res.oldName
//     }
// })

// 收货验收
const getlist = async () => {
  const res = await purchase();
  console.log("收货验收", res);
};
onMounted(() => {
  getlist();
});

// 返回
const back = () => {
  router.go(-1);
};
</script>

<style scoped lang="less">
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
