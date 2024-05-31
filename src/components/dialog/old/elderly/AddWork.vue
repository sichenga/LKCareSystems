<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增护工"
    width="40%"
    @close="close"
  >
    <el-form
      ref="ruleFormRef"
      style="max-width: 100%"
      :model="ruleForm"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="姓名：" prop="name" class="reset">
        <el-input v-model="params.name" placeholder="请输入姓名" />
        <div class="query">
          <el-button type="primary" @click="querywork">查询</el-button>
          <el-button @click="resetwork">重置</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <MayTable
          :tableData="data.tableData"
          :tableItem="data.tableItem"
          :autoWidth="'100px'"
          :identifier="'addword'"
        >
          <template #operate="{ data }">
            <el-button type="primary" @click="selectstaff(data)"
              >选择</el-button
            >
          </template>
        </MayTable>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  ref,
  reactive,
  defineEmits,
  onMounted,
  defineProps,
  defineAsyncComponent,
  inject,
} from "vue";
import type { ComponentSize, FormInstance } from "element-plus";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { staffList } from "@/service/staff/StaffApi";
import { addSchedule } from "@/service/old/schedule/ScheduleApi";
import type { ScheduleAdd } from "@/service/old/schedule/ScheduleType";
const route = useRoute();
const props = defineProps({
  editid: {
    type: Number,
    default: 0,
  },
  worddata: {
    type: Object,
    default: () => ({}),
  },
});
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const data = reactive({
  tableData: [],
  tableItem: [
    {
      prop: "photo",
      label: "头像",
    },
    {
      prop: "name",
      label: "姓名",
    },
    {
      prop: "mobile",
      label: "手机号",
    },
    {
      prop: "departmentName",
      label: "部门",
    },
  ],
});
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<ScheduleAdd>({
  elderlyId: 0,
  day: "",
  week: "",
  staffId: 0,
  staffName: "",
  staffPhoto: "",
});
const params = reactive({
  page: 1,
  pageSize: 5,
  carer: 1,
  name: "",
});
const dialogVisible = ref(true);

// 获取护工列表
const getstalist = async () => {
  const res: any = await staffList(params);
  if (res?.code === 10000) {
    data.tableData = res.data.list;
  }
};

// 查询列表
const querywork = () => {
  getstalist();
};
// 重置
const resetwork = () => {
  params.name = "";
  getstalist();
};
const emit = defineEmits(["close"]);
// 关闭弹框
const close = (close: boolean = false) => {
  emit("close", close);
};
// 选择护工
const selectstaff = (data: any) => {
  ruleForm.elderlyId = Number(route.query?.id);
  ruleForm.day = props.worddata.type;
  ruleForm.week = props.worddata.com;
  ruleForm.staffId = data.id;
  ruleForm.staffName = data.name;
  ruleForm.staffPhoto = data.photo;
  submitForm();
  console.log(ruleForm);
};
const getwork = inject<Function>("getwork")!;
// 提交表单
const submitForm = async () => {
  let res: any = await addSchedule(ruleForm);
  if (res?.code === 10000) {
    ElMessage.success("添加成功");
    close(true);
    getwork();
  }
};

onMounted(() => {
  getstalist();
});
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}
.reset {
  .el-input {
    width: 230px;
  }
}
.query {
  margin-left: 15px;
}
</style>
