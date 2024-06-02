<template>
  <div class="app-container">
    <div class="content-sizes">
      <div class="font-sizes">
        <span class="color-size">▋</span>
        <span class="option">申请信息</span>
      </div>

      <div class="content-size">
        <div class="size-cont">
          <div class="size-con">
            <div>申请人：</div>
            <div>{{ states.name }}</div>
          </div>
          <div class="size-con">
            <div>申请时间：</div>
            <div>{{ states.addTime }}</div>
          </div>
          <div class="size-con">
            <div>申请状态：</div>
            <div>{{ states.state ? "已提交入院" : "待提交入院" }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-sizes">
      <div class="font-sizes">
        <span class="color-size">▋</span>
        <span class="option">老人信息</span>
      </div>

      <div class="content-size">
        <div class="size-cont">
          <div class="size-con">
            <div>老人姓名：</div>
            <div>{{ DataElder.name }}</div>
          </div>
          <div class="size-con">
            <div>身份证号：</div>
            <div>{{ DataElder.idCard }}</div>
          </div>
          <div class="size-con">
            <div>护理等级：</div>
            <div>{{ DataElder.eduLevel }}</div>
          </div>
          <div class="size-con" style="width: 530px">
            <div>家属信息：</div>
            <div>
              <MayTable
                :tableData="data.tableData"
                :tableItem="data.tableItem"
                :isoperate="false"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-sizes">
      <div class="font-sizes">
        <span class="color-size">▋</span>
        <span class="option">订单信息</span>
      </div>

      <div class="content-size">
        <div class="size-cont">
          <div class="size-con">
            <div>下单人：</div>
            <div>{{ states.name }}</div>
          </div>

          <div class="size-con">
            <div>入住床位：</div>
            <div>{{ states.begName }}</div>
          </div>
          <div class="size-con">
            <div>下单时间：</div>
            <div>{{ states.startDate }}</div>
          </div>
          <div class="size-con">
            <div>入住时段：</div>
            <div>{{ states.addTime }} 至 {{ states.startDate }}</div>
          </div>
          <div class="size-con" style="width: 530px">
            <div>护理服务：</div>
            <div>
              <MayTable
                :tableData="data.tableDatas"
                :tableItem="data.tableItems"
                :isoperate="false"
              />
            </div>
          </div>
          <div class="size-con" style="width: 580px">
            <div>订单合同：</div>
            <div v-for="item in states.files" :key="item">
              <el-image
                style="width: 120px; height: 170px"
                :src="Image + item.file"
                fit="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-sizes">
      <div class="font-sizes">
        <span class="color-size">▋</span>
        <span class="option">财务信息</span>
      </div>

      <div class="content-size">
        <div class="size-cont">
          <div class="size-con">
            <div>床位费:</div>
            <div>{{ states.begPrice * states.days }}</div>
          </div>
          <div class="size-con">
            <div>护理费:</div>
            <div>{{ states.servicePrice * states.days }}</div>
          </div>
          <div class="size-con">
            <div>膳食费:</div>
            <div>{{ states.foodPrice * states.days }}</div>
          </div>
          <div class="size-con">
            <div>押金:</div>
            <div>{{ states.cashPledge }}</div>
          </div>
          <div class="size-con">
            <div>一次性生活费:</div>
            <div>{{ states.livingPrice }}</div>
          </div>
          <div class="size-con">
            <div>合计:</div>
            <div>{{ totle }}</div>
          </div>
        </div>
      </div>
    </div>
    <el-button class="bot">返回</el-button>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import { orderGet } from "@/service/market/marketApi";
import { useRoute } from "vue-router";
import { getElderly } from "@/service/old/OldApi";
const Image = import.meta.env.VITE_BASE_URL + "/";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const route = useRoute();
//获取单挑入院信息
const states = ref<any>([]);
const totle = ref<number>(0);
const orderGetList = async () => {
  let id = Number(route.params.id);
  let res: any = await orderGet(id).catch(() => {});
  console.log(1, res);
  if (res?.code == 10000) {
    states.value = res.data;
    data.tableDatas = res.data.services;
    totle.value =
      Number(res.data.begPrice) * Number(res.data.days) +
      Number(res.data.servicePrice) * Number(res.data.days) +
      Number(res.data.foodPrice) * Number(res.data.days) +
      Number(res.data.cashPledge) +
      Number(res.data.livingPrice);
  }
};
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "name",
      label: "家属姓名",
      width: "150px",
    },
    {
      prop: "relation",
      label: "与老人关系",
      width: "150px",
    },
    {
      prop: "mobile",
      label: "联系方式",
      width: "150px",
    },
  ],
  tableDatas: [] as any,
  tableItems: [
    {
      prop: "serviceName",
      label: "服务目的",
      width: "150px",
    },
    {
      prop: "serviceContent",
      label: "服务内容",
      width: "150px",
    },
    {
      prop: "mobile",
      label: "合计",
      width: "150px",
    },
  ],
});
// 获取老人信息
const DataElder = ref<any>([]);
const getElderlyList = async () => {
  let id = Number(states.value.begId);
  let res: any = await getElderly(id);
  console.log(res);
  if (res?.code == 10000) {
    DataElder.value = res.data;
    data.tableData = res.data.family;
  }
};

onMounted(async () => {
  await orderGetList(); //获取单挑入院信息
  await getElderlyList(); //获取老人信息
});
</script>
<style lang="less" scoped>
.content-size {
  display: flex;
  width: 400px;

  .size-con {
    display: flex;
    margin-top: 40px;
    color: #000;
    font-size: 14px;
    margin-bottom: 40px;
    div:nth-child(2) {
      margin-left: 10px;
    }
  }
}

.content-sizes {
  margin: 20px;

  .font-sizes {
    font-size: 14px;

    .color-size {
      color: #409eff;
    }

    .option {
      font-weight: 650;
      color: #666666;
      margin-left: 6px;
      margin-right: 30px;
    }
  }
}

.bot {
  position: relative;
  bottom: 0;
  left: 720px;
  width: 100px;
  height: 40px;
}
</style>
