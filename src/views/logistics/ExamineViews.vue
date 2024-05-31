<template>
  <el-card style="margin-top: 15px">
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
    <!-- 表格 -->

    <MayTable
      :tableData="data.tableData"
      :tableItem="data.tableItem"
      :label="'采购实际数量'"
      :isoperate="isshou"
    >
      <template #custom="data">
        <el-input v-model="data.data.creators" style="width: 130px" />
      </template>
    </MayTable>
    <div class="title-image">
      <div>到货凭证</div>
      <div class="image">
        <el-image
          style="width: 100px; height: 100px"
          :src="data.TatleData.picture"
          fit="cover"
        />
      </div>
    </div>
  </el-card>

  <div class="button-body">
    <el-button class="btn-body" @click="goback">返回</el-button>
    <el-button type="primary" class="primary" @click="confirm"
      >确定验收</el-button
    >
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getPurchase,
  getpurchaseFoods,
  putInspection,
} from "@/service/purchase/PurchaseApi";
import { ElMessage } from "element-plus";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const route = useRoute();
const router = useRouter();
const data = reactive({
  tableData: [] as any,
  TatleData: [] as any,
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
  ],
});
const isshou = ref(false);
const getlist = async () => {
  let id = Number(route.query.id);
  let res: any = await getPurchase(id);
  if (res.code == 10000) {
    data.TatleData = res.data;
  }
};
const getData = async () => {
  let id = Number(route.query.id);
  let res: any = await getpurchaseFoods(id);
  if (res.code == 10000) {
    data.tableData = res.data.list;
  }
};

const confirm = async () => {
  const params = {
    id: data.TatleData.id,
    picture: data.TatleData.picture,
    foods: [],
  };

  params.foods = data.tableData.map((item: any) => ({
    id: item.id,
    receiveCounts: item.receiveCounts,
  }));

  let res: any = await putInspection(params);
  if (res.code == 10000) {
    ElMessage({
      message: res.data.state,
      type: "success",
    });
    router.push("/Logistics");
  }
};
const goback = () => {
  router.push("/dashboard/apply");
};
onMounted(() => {
  getlist();
  getData();
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

.body-size {
  font-size: 14px;
  margin: 20px 0 20px 10px;

  div {
    width: 240px;
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
  margin: 70px 740px;
  display: flex;

  .btn-body {
    width: 160px;
    height: 40px;
  }

  .primary {
    width: 220px;
    height: 40px;
  }
}
</style>
