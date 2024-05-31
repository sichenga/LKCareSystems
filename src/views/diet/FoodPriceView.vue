<template>
  <!-- 价格分析 -->
  <!-- 详情 -->
  <PriceDialog @close="close" v-if="isdialog" :pricedata="pricedata" />
  <div class="details">
    <div class="left">
      <div class="l">
        <div>食材名称：</div>
        <div>供应商：</div>
        <div>当前批发价：</div>
        <div>当前零售价：</div>
        <div>当前采购价：</div>
      </div>
      <div class="r">
        <div>{{ state.foodinfo.name }}</div>
        <div>{{ state.foodinfo.supplierName }}</div>
        <div>{{ state.foodinfo.wholePrice }}</div>
        <div>{{ state.foodinfo.sellPrice }}</div>
        <div>{{ state.foodinfo.purchasePrice }}</div>
      </div>
    </div>
    <div class="right">
      <span
        >价格更新于：{{
          moment(state.foodinfo.updateTime).format("YYYY-MM-DD HH:mm")
        }}</span
      >
    </div>
  </div>
  <!-- 图表 -->
  <div class="chart">
    <div>价格趋势</div>
    <ECharts
      :timelist="state.timelist"
      :sellPricelist="state.sellPricelist"
      :wholePricelist="state.wholePricelist"
      :purchasePricelist="state.purchasePricelist"
    />
  </div>
  <div class="table">
    <!-- 查询 -->
    <div class="demand">
      <div class="l">价格更新记录</div>
      <div class="r">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-select
              v-model="formInline.region"
              placeholder="请选择"
              clearable
            >
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
      <template #operate="{ data }">
        <el-button type="primary" size="small" link @click="priceUpdate(data)"
          >编辑</el-button
        >
      </template>
    </MayTable>
  </div>
  <!-- 返回 -->
  <div class="back">
    <el-button @click="back">返回</el-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, defineAsyncComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Foodget, foodpricelist } from "@/service/food/FoodApi";
import PriceDialog from "@/components/dialog/diet/PriceDialog.vue";
import type { FoodDetail } from "@/service/food/FoodType";
import moment from "moment";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const ECharts = defineAsyncComponent(
  () => import("@/components/food/ECharts.vue")
);
const isdialog = ref(false);
const pricedata = ref({});
const route = useRoute();
const router = useRouter();
const state = reactive({
  foodinfo: {} as FoodDetail,
  timelist: [],
  // 批发价
  sellPricelist: [],
  // 零售价
  wholePricelist: [],
  // 采购价
  purchasePricelist: [],
});
const id = ref<string>(route.query?.id as string);

const formInline = reactive({
  region: "",
});
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "updateTime",
      label: "价格更新日期",
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
      prop: "addAccountName",
      label: "更新人",
    },
  ],
});

// 详情数据
const getfond = async () => {
  if (!id.value) return false;
  const res: any = await Foodget(Number(id.value));
  console.log("食材详情", res);
  if (res?.code === 10000) {
    state.foodinfo = res.data;
  }
};
// 价格列表
const getpricelist = async () => {
  const res: any = await foodpricelist(Number(id.value));
  console.log("价格列表", res);
  if (res?.code === 10000) {
    // 表格数据
    data.tableData = res.data.list;
    // 获取时间
    state.timelist = res.data.list.map((item: any) =>
      moment(item.updateTime).format("MM-DD")
    );
    // 批发价
    state.sellPricelist = res.data.list.map((item: any) => item.sellPrice);

    state.wholePricelist = res.data.list.map((item: any) => item.wholePrice);
    state.purchasePricelist = res.data.list.map(
      (item: any) => item.purchasePrice
    );
    console.log(state);
  }
};
// 编辑
const priceUpdate = (data: any) => {
  console.log("价格更新", data);
  pricedata.value = data;
  isdialog.value = true;
};

// 网络请求
const Api = () => {
  getfond();
  getpricelist();
};

onMounted(() => {
  // getlist()
  Api();
});
const back = () => {
  router.go(-1);
};

// 关闭弹窗
const close = (isrefresh: boolean) => {
  if (isrefresh == true) {
    getpricelist();
  }
  isdialog.value = false;
};
</script>

<style scoped lang="less">
.details {
  height: 200px;
  display: flex;
  background-color: #fff;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 20px;

  .left {
    display: flex;

    .l {
      margin-right: 30px;
      line-height: 30px;
    }

    .r {
      line-height: 30px;
    }
  }
}

.chart {
  height: 505px;
  padding: 20px;
  background-color: #fff;
  margin-bottom: 10px;
}

.table {
  padding: 20px;
  background-color: #fff;

  .demand {
    height: 100px;
    display: flex;
    justify-content: space-between;

    .l {
      line-height: 100px;
    }

    .r {
      line-height: 115px;
    }
  }
}

.back {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 50px;
}
</style>

<style>
.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
