<template>
  <!-- 选择老人 -->
  <el-dialog
    v-model="dialogVisible"
    title="选择老人"
    width="700"
    @close="close"
  >
    <el-form :inline="true" :model="states" class="demo-form-inline">
      <div class="form-size">
        <el-form-item label="姓名:">
          <el-input v-model="states.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="身份证号码:">
          <el-input v-model="states.idCard" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="
              () => {
                states.page = 1;
                getlist();
              }
            "
            >查询</el-button
          >
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <MayTable
      :tableData="data.tableData"
      :autoWidth="'120px'"
      :tableItem="data.tableItem"
      :identifier="identifier"
    >
      <template #operate="{ data }">
        <el-button type="primary" @click="select(data.id)">选择</el-button>
      </template>
    </MayTable>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  ref,
  reactive,
  onMounted,
  defineEmits,
  defineAsyncComponent,
} from "vue";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
import { getElderlyList } from "@/service/old/OldApi";
import type { ListElderlyRequest } from "@/service/old/OldType";
const dialogVisible = ref(true);

//唯一标识
const identifier = "ToHospitalDialog";
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "photo",
      label: "头像",
      width: "100px",
    },
    {
      prop: "name",
      label: "姓名",
      width: "100px",
    },
    {
      prop: "gender",
      label: "性别",
    },
    {
      prop: "idCard",
      label: "身份证号",
      width: "200px",
    },
  ],
});

const emit = defineEmits(["closes", "id"]);
const close = (close: boolean = false) => {
  emit("closes", close);
};
const states = reactive<ListElderlyRequest>({
  page: 1,
  pageSize: 10,
  begId: undefined,
  state: undefined,
  name: "", //老人姓名
  idCard: undefined, //身份证号
});
// 老人列表
const getlist = async () => {
  let res: any = await getElderlyList(states);
  if (res.code == 10000) {
    data.tableData = res.data.list;
  }
};
//选择老人
const select = (id: number) => {
  close(false);
  emit("id", id);
};

// 重置
const resetForm = () => {
  states.name = "";
  states.idCard = undefined;
};

onMounted(() => {
  getlist(); //老人列表
});
</script>
<style lang="less" scoped>
.el-input {
  width: 140px;
}

.form-size {
  display: flex;
}
</style>
