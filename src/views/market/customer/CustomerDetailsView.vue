<template>
  <!-- dialog写在market文件夹下 -->
  <!-- 潜在客户详情 -->
  <div class="app-container">
    <el-card>
    <div class="title">
      <div><i>▋</i> 老人信息</div>
      <div>
        <h2 v-show="data.list.state == 1">未签约</h2>
        <h2 v-show="data.list.state == 2">预定中</h2>
        <h2 v-show="data.list.state == 3">已入院</h2>
      </div>
    </div>
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="老人姓名：">
        {{ data.list.name }}
      </el-form-item>
      <el-form-item label="老人性别：">
        {{ data.list.gender == 1 ? "男" : "女" }}
      </el-form-item>
      <el-form-item label="身份证号：">
        {{ data.list.idCard }}
      </el-form-item>
      <el-form-item label="老人状况：">
        {{ data.list.source }}
      </el-form-item>
    </el-form>
    <div class="title">
      <div><i>▋</i> 家属信息</div>
    </div>
    <!-- 表格 -->
    <MayTable
      :tableData="data.tableData"
      :tableItem="data.tableItem"
      :isoperate="false"
    />
    <div class="title" style="margin-top: 30px">
      <div><i>▋</i> 需求信息</div>
    </div>
    <el-form-item label="房间需求">
      {{ data.list.roomRequire }}
    </el-form-item>
    <el-form-item label="意向需求">
      {{ data.list.content }}
    </el-form-item>
  </el-card>
  <!-- 返回 -->
  <div class="back">
    <el-button @click="back">返回</el-button>
  </div>
  </div>
  
</template>

<script lang="ts" setup>
import { reactive, onMounted, defineAsyncComponent } from "vue";
import { Customerget } from "@/service/market/CustomerApi";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const data = reactive({
  list: [] as any,
  id: null as any,
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "name",
      label: "姓名",
    },
    {
      prop: "gender",
      label: "性别",
    },
    {
      prop: "idCard",
      label: "身份证号码",
    },
    {
      prop: "mobile",
      label: "联系电话",
    },
    {
      prop: "address",
      label: "联系地址",
    },
    {
      prop: "relation",
      label: "与老人关系",
    },
  ],
});
const form = reactive({
  name: "",
});

// 单条数据
const getData = async () => {
  data.id = route.params.id;
  const res: any = await Customerget(data.id);
  console.log("单挑数据", res);
  if (res.code == 10000) {
    data.tableData = res.data.family;
    data.list = res.data;
  }
};
// 返回
const back = () => {
  router.push("/market/customer");
};
onMounted(() => {
  getData();
});
</script>

<style scoped lang="less">
.title {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;

  i {
    font-style: normal;
    color: #409eff;
  }
}

.back {
  margin-top: 40px;
  text-align: center;
}
</style>
