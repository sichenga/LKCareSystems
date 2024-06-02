<template>
  <!-- 收货验收 -->
  <div class="app-container">
    <el-card style="margin-top: 15px">
      <div class="body-top">
        <div class="body-size">
          <div>
            <div>创建时间：</div>
            <div>{{ data.TatleData.addTime }}</div>
          </div>
          <div>
            <div>申请人：</div>
            <div>{{ data.TatleData.addAccountName }}</div>
          </div>
          <div>
            <div>品种数：</div>
            <div>{{ data.TatleData.counts }}</div>
          </div>
          <div>
            <div>实际采购成本：</div>
            <div>{{ data.TatleData.addAccountId }}</div>
          </div>
        </div>
        <div class="size-ok">
          {{ data.TatleData.state }}
        </div>
      </div>

      <!-- 表格 -->
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        :isoperate="isshou"
      />

      <div class="title-image">
        <div>到货凭证</div>
        <div class="image">
          <el-image
            style="width: 100px; height: 100px"
            :src="
              data.TatleData.picture ? ImageUrls + data.TatleData.picture : ''
            "
            fit="cover"
          />
        </div>
      </div>
    </el-card>
    <div class="button-body">
      <el-button class="btn-body" @click="router.push('/logistics/purchase')"
        >返回</el-button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getPurchase, getpurchaseFoods } from "@/service/purchase/PurchaseApi";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const router = useRouter();
const route = useRoute();
//图片后缀路径
const ImageUrls = import.meta.env.VITE_BASE_URL + "/" || "";

const data = reactive({
  tableData: [] as any,
  TatleData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "foodname",
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
      prop: "sellPrice",
      label: "零售价",
    },
    {
      prop: "purchasePrice",
      label: "采购价",
    },
    {
      prop: "purchaseCounts",
      label: "采购数量",
    },
    {
      prop: "receiveCounts",
      label: "采购实际数量",
    },
  ],
});

//根据id获取单条采购申请信息
const isshou = ref(false);
const getlist = async () => {
  let id = Number(route.query.id);
  let res: any = await getPurchase(id);

  if (res.code == 10000) {
    data.TatleData = res.data;
  }
};
// 根据采购id获取采购物品列表
const getData = async () => {
  let id = Number(route.query.id);
  let res: any = await getpurchaseFoods(id);
  console.log(res);

  if (res.code == 10000) {
    data.tableData = res.data.list;
  }
};
onMounted(() => {
  getlist(); //根据id获取单条采购申请信息
  getData(); // 根据采购id获取采购物品列表
});
</script>
<style lang="less" scoped>
.el-input {
  height: 40px;
}

.el-button {
  height: 40px;
  line-height: 40px;
}
.body-top {
  display: flex;
  justify-content: space-between;
  .size-ok {
    margin: 20px;
    font-size: 32px;
  }
}
.body-size {
  font-size: 14px;
  margin: 20px 0 20px 10px;
  div {
    width: 300px;
    display: flex;

    justify-content: space-between;
  }
}
.title-image {
  margin-top: 40px;
  .image {
    margin-top: 20px;
  }
  .el-image {
    width: 55px !important;
    height: 55px !important;
  }
}
.button-body {
  margin: 70px 760px;
  .btn-body {
    width: 160px;
    height: 40px;
  }
}
</style>
