<template>
  <!-- 编辑采购申请 -->
  <el-card style="margin-top: 15px">
    <div style="margin: 10px 0">
      <el-button type="primary" @click="ingredient">选择食材</el-button>
      <div class="quantity">1</div>
    </div>
    <!-- 表格 -->
    <MayTable
      :tableData="data.AddData.foods"
      :tableItem="data.tableItem"
      :label="'采购数量'"
      v-if="isProxy"
    >
      <template #custom="data">
        <el-input v-model="data.data.creators" style="width: 130px" />
      </template>
      <template #operate="{ data }">
        <el-button type="primary" text @click="del(data.id)">删除</el-button>
      </template>
    </MayTable>
    <div class="title-image">
      <div>
        合计：采购品种数{{ data.print }}，采购总成本：{{ data.totalPrices }} 元
      </div>
      <div class="image">
        <el-form :model="data.AddData" label-width="auto">
          <el-form-item
            class="item-form"
            label="请输入备注："
            style="width: 400px; height: 100px"
          >
            <el-input
              v-model="data.AddData.remarks"
              type="textarea"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="期望到货日期" style="width: 300px; height: 80px">
            <MayTimePicker @change="hoaldChange" />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-card>
  <AddIngredient
    v-if="dialogVisible"
    @close="haoldclose"
    @ingredient="hoaldIngredient"
  />
  <div class="button-body">
    <el-button class="btn-body" @click="back">返回</el-button>
    <el-button type="primary" class="btn-body" @click="confirm">保存</el-button>
    <el-button type="primary" class="primary" @click="save"
      >保存并提交</el-button
    >
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { postInspection } from "@/service/purchase/PurchaseApi";
import type { IUserList } from "@/service/purchase/PurchaseType";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const AddIngredient = defineAsyncComponent(
  () => import("@/components/dialog/logistics/AddIngredientDialog.vue")
);
const MayTimePicker = defineAsyncComponent(
  () => import("@/components/timepicker/MayTimePicker.vue")
);
const router = useRouter();

const data = reactive({
  tableData: [] as any,
  print: 0,
  totalPrices: 0,
  AddData: {
    receiveTime: null,
    remarks: null,
    foods: [],
  } as IUserList,
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
  ],
});
// 删除选择食材
const del = async (id: any) => {
  let res = await getMessageBox("是否确认删除该采购申请", "删除后将不可恢复");
  if (res) {
    data.AddData.foods = data.AddData.foods.filter(
      (item: any) => item.id !== id
    );
    if (data.AddData.foods.length === 0) {
      isProxy.value = false;
    }
    countsprice(data.AddData.foods);
    ElMessage.success("删除成功");
  } else {
    ElMessage.info("取消删除");
  }
};
// 返回
const back = () => {
  router.push("/logistics/purchase");
};
// 保存
const confirm = () => {
  router.push("/logistics/purchase");
};

const dialogVisible = ref(false);
//选择食材
const ingredient = () => {
  dialogVisible.value = true;
};
const haoldclose = (val: boolean) => {
  dialogVisible.value = val;
  if (val == true) {
    dialogVisible.value = false;
  }
};
const isProxy = ref(false);
// 选择食材
const hoaldIngredient = (val: any) => {
  if (val) {
    console.log(1111, val);

    isProxy.value = true;

    data.AddData.foods = val.map((item: any) => {
      let obj = {
        foodName: item.name,
        ...item,
      };
      delete item.name;
      return obj;
    });

    countsprice(val);
  }
};

// 选择时间
const hoaldChange = (val: any) => {
  data.AddData.receiveTime = val;
};
// 结算总数量和价格
const countsprice = (fooddata: any) => {
  data.print = fooddata?.length;
  data.totalPrices = fooddata.reduce(
    (counts: any, item: any) => counts + item.purchasePrice,
    0
  );
};

//采购申请 保存并提交
const save = async () => {
  if (data.AddData.foods.length >= 1) {
    let res: any = await postInspection(data.AddData);
    if (res.code == 10000) {
      router.push("/logistics/details/" + res.data.id);
    }
  } else {
    ElMessage.error({
      message: "请选择食材",
    });
  }
};

onMounted(() => {});
</script>
<style lang="less" scoped>
.el-button {
  height: 40px;
  line-height: 40px;
}

.quantity {
  position: relative;
  width: 14px;
  height: 14px;
  top: -50px;
  left: 65px;
  line-height: 14px;
  text-align: center;
  font-size: 10px;
  background-color: #fff849;
}

.title-image {
  margin-top: 20px;

  .image {
    margin: 50px 0;

    .el-form-item {
      width: 230px;
      height: 20px;
    }
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
