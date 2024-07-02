<template>
  <div class="app-container">
    <el-card style="margin-top: 15px">
      <div class="body-size">
        <div>
          <div>创建时间：</div>
          <div>{{ data.titleData.addTime }}</div>
        </div>
        <div>
          <div>申请人：</div>
          <div>{{ data.titleData.addAccountName }}</div>
        </div>
        <div>
          <div>品种数：</div>
          <div>{{ data.titleData.counts }}</div>
        </div>
        <div>
          <div>实际采购成本：</div>
          <div>{{ data.titleData.addAccountId }}</div>
        </div>
      </div>
      <!-- 表格 -->
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        :label="'采购实际数量'"
        :isoperate="isshou"
      >
        <!-- eslint-disable-next-line vue/no-template-shadow -->
        <template #custom="{ data }">
          <el-input v-model="data.receiveCounts" style="width: 130px" />
        </template>
      </MayTable>
      <div class="title-image">
        <div>到货凭证</div>
        <div class="image">
          <AvatarUpload @upload="uploadImage" />
        </div>
      </div>
    </el-card>
    <div class="button-body">
      <el-button class="btn-body" @click="goback">返回</el-button>
      <el-button type="primary" class="primary" @click="confirm"
        >确定验收</el-button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import { useRouter, useRoute } from "vue-router";

import {
  getPurchase,
  getpurchaseFoods,
  putInspection,
} from "@/service/purchase/PurchaseApi";

const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const AvatarUpload = defineAsyncComponent(
  () => import("@/components/upload/AvatarUpload.vue")
);
const router = useRouter();
const route = useRoute();

const data = reactive({
  tableData: [] as any,
  titleData: [] as any,
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
  let ids = Number(route.params.id);
  let res: any = await getpurchaseFoods(ids);

  if (res.code == 10000) {
    data.tableData = res.data.list;
  }
};

const getPur = async () => {
  let ids = Number(route.params.id);
  let res: any = await getPurchase(ids);
  if (res.code == 10000) {
    data.titleData = res.data;
  }
};

let ids = Number(route.params.id);
const params = reactive({
  id: ids,
  picture: "",
  foods: [],
});

const uploadImage = (val: any) => {
  params.picture = val;
};

const confirm = async () => {
  params.foods = data.tableData.map((item: any) => ({
    id: item.id,
    receiveCounts: item.receiveCounts,
  }));
  // params.state
  let res: any = await putInspection(params);
  console.log(res);

  if (res.code == 10000) {
    router.push("/logistics/purchase");
  }
};

const goback = () => {
  router.push("/logistics/purchase");
};
onMounted(() => {
  getPur(); //根据id获取单条采购申请信息
  getlist(); //根据采购id获取采购物品列表
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
