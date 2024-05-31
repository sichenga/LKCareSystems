<template>
  <!-- 档案管理 -->
  <el-card>
    <!-- dialog写在market文件夹下 -->
    <div class="body-top">
      <div>
        <el-image
          style="width: 50px; height: 50px; margin-top: 11px"
          :src="upload + data.oldinfo?.photo"
          fit="cover"
        />
      </div>
      <div class="size-I-right">
        <div class="size-right">
          <div>老人姓名:</div>
          <div>{{ data.oldinfo?.name }}</div>
        </div>
        <div class="size-right">
          <div>身份证/护照号:</div>
          <div>{{ data.oldinfo?.idCard }}</div>
        </div>
        <div class="size-right">
          <div>床位号:</div>
          <div>{{ data.oldinfo?.begName }}</div>
        </div>
      </div>
    </div>
  </el-card>
  <el-card style="margin-top: 15px">
    <!-- 表格 -->
    <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
      <template #operate>
        <el-button type="primary" text>上传文件</el-button>
        <el-button type="primary" text>下载</el-button>
      </template>
    </MayTable>
    <Pagination :total="50" />
  </el-card>
</template>
<script lang="ts" setup>
import { reactive, onMounted, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
import { getFileItemsList, getElderly } from "@/service/old/OldApi";
import type { ElderlyItem } from "@/service/old/OldType";
// import type {} from '@/service/old/OldType'
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const upload = import.meta.env.VITE_BASE_URL + "/";
const route = useRoute();
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "name",
      label: "文件名",
    },
    {
      prop: "address",
      label: "文件",
    },
  ],
  oldinfo: {} as ElderlyItem,
});

// 老人信息
const getoldinfo = async () => {
  let id = route.query?.id;
  let res: any = await getElderly(Number(id));
  if (res?.code === 10000) {
    data.oldinfo = res?.data;
  }
};

// 文件列表
const getlist = async () => {
  let res: any = await getFileItemsList();
  console.log("文件列表", res);

  if (res?.code === 10000) {
    data.tableData = res?.data.list;
  }
};

onMounted(() => {
  getoldinfo();
  getlist();
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

.el-form--inline .el-form-item {
  width: 270px;
}
.body-top {
  display: flex;
  .size-I-right {
    margin-left: 55px;
    .size-right {
      display: flex;
      div {
        margin: 7px 0;
      }
      div:nth-child(1) {
        width: 160px;
      }
    }
  }
}
</style>
