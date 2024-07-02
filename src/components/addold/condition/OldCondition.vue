<template>
  <div>
    <div class="size"><span>▋</span> 老人自理情况</div>
    <!-- {{ ruleForm.selfCares }} -->

    <MatTable :tableData="state.tableData" :tableItem="state.tableItem">
      <template #operate="{ data, index }">
        <el-radio-group v-model="data.val" @change="change(data, index)">
          <el-radio
            v-for="item in state.LableData"
            :key="item.id"
            :value="item.lable"
            :label="item.lable"
          />
        </el-radio-group>
      </template>
    </MatTable>
    <div>
      <div class="titles">其他特殊情况说明</div>
      <el-input v-model="ruleForm.health.otherCase" type="textarea" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, onMounted, defineAsyncComponent, inject } from "vue";

const MatTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
import { getSelfcareList } from "@/service/old/OldApi";
import type { AddElderlyRequest } from "@/service/old/OldType";

const ruleForm: any = inject<AddElderlyRequest>("ruleForm")!;
const state: any = reactive({
  LableData: [
    {
      id: 1,
      lable: "正常",
    },
    {
      id: 2,
      lable: "轻度依赖",
    },
    {
      id: 3,
      lable: "重度依赖",
    },
  ],
  tableData: [],
  tableItem: [
    {
      label: "排序",
      prop: "id",
    },
    {
      label: "维度",
      prop: "name",
    },
  ],
});

const getlist = async () => {
  let res: any = await getSelfcareList();
  console.log("自理列表", res);
  if (res?.code == 10000) {
    state.tableData = res.data.list;
  }
  if (ruleForm.id) {
    state.tableData = state.tableData.map((item: any) => ({
      ...item,
      val: ruleForm.selfCares.find((fitem: any) => fitem.name == item.name)
        ?.val,
    }));
  }
};
// 选择老人自理情况
const change = (data: any, index: number) => {
  console.log(data);

  ruleForm.selfCares[index] = { name: data.name, val: data.val };
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

.titles {
  margin-top: 20px;
}
</style>
