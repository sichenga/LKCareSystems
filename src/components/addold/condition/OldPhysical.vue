<template>
  <div>
    <div class="size"><span>▋</span> 老人自理情况</div>
    {{ state.tableData }}
    <!-- {{ ruleForm.checkups }} -->
    <MatTable
      :tableData="state.tableData"
      :tableItem="state.tableItem"
      :identifier="'oldphysical'"
    >
      <template #operate="{ data, index }">
        <UploadPictures
          :title="'上传资料'"
          :showfile="false"
          :istip="false"
          :limit="3"
          @upload="(file: any) => OldPhysical(file, data, index)"
        />
      </template>
    </MatTable>
  </div>
</template>
<script lang="ts" setup>
import { reactive, onMounted, defineAsyncComponent, inject } from "vue";

import { getCheckupItemsList } from "@/service/old/OldApi";
import type { AddElderlyRequest } from "@/service/old/OldType";
const MatTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
import UploadPictures from "@/components/upload/UploadPictures.vue";
const ruleForm = inject<AddElderlyRequest>("ruleForm")!;
const state: any = reactive({
  tableData: [],
  tableItem: [
    {
      label: "体检项目",
      prop: "name",
    },
    {
      label: "资料",
      prop: "picture",
    },
  ],
});
// 体检项目列表
const getlist = async () => {
  let res: any = await getCheckupItemsList();
  if (res?.code === 10000) {
    state.tableData = res.data.list;
  }
  if (ruleForm.id) {
    state.tableData = state.tableData.map((item: any) => ({
      ...item,
      picture: ruleForm.checkups
        .filter((val: any) => val.name === item.name)
        .map((val: any) => val.picture),
    }));
  }
};
// 处理老人自理情况数据
const OldPhysical = (val: any, data: any, index: number) => {
  console.log(val, data, index);
  data.picture = [...(data.picture || ""), val?.url];

  console.log(111, data.picture, data.name);

  ruleForm.checkups.push({
    name: data.name,
    picture: val?.url,
  });
};
onMounted(() => {
  getlist();
});
</script>
<style lang="less" scoped>
.size {
  color: #666666;
  font-size: 14px;
  margin-top: 50px;

  span {
    color: #409eff;
  }
}

:deep(.el-table--border .el-table__inner-wrapper) {
  margin-top: 30px;
}
:deep(.el-checkbox__input) {
  border-radius: 50%;
  .el-checkbox__inner {
    border-radius: 50%;
  }
}
</style>
