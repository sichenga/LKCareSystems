<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isinfo ? '设置服药时间' : '停止用药'"
    width="30%"
    @close="close"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      :size="formSize"
      class="demo-ruleForm"
      label-position="left"
      label-width="auto"
      status-icon
      style="max-width: 600px"
    >
      <template v-if="props.isinfo">
        <MayTable
          :auto-width="'100px'"
          :identifier="'planset'"
          :tableData="ruleForm.plans"
          :tableItem="data.tableItem"
          ><template #header>
            <el-button type="primary" @click="add">
              <el-icon><Plus /></el-icon>
            </el-button>
          </template>
          <template #operate="{ index }">
            <el-button type="primary" @click="del(index)">
              <el-icon><Minus /></el-icon>
            </el-button>
          </template>
        </MayTable>
      </template>
      <el-form-item
        :label="isinfo ? '开始时间' : '停止服药时间'"
        prop="name"
        style="margin-top: 15px"
      >
        <TimePicker style="width: 100%" @change="tiemSelect" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  defineAsyncComponent,
  defineEmits,
  defineProps,
  reactive,
  ref,
} from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { Minus, Plus } from "@element-plus/icons-vue";
import {
  DrugPlanAdd,
  DrugPlanUpdateEndDate,
} from "@/service/medicalcare/MedicalcareApi";
import type { DrugsPlanAddParams } from "@/service/medicalcare/MedicalcareType";

const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const TimePicker = defineAsyncComponent(
  () => import("@/components/timepicker/MayTimePicker.vue")
);
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();

const rules = reactive<FormRules<any>>({});
const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
const props = defineProps({
  isinfo: {
    type: Boolean,
    default: true,
  },
  drugId: {
    type: Number,
    default: 0,
  },
});
const ruleForm = reactive<DrugsPlanAddParams>({
  drugId: props.drugId,
  startDate: "",
  plans: [],
});
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "time",
      label: "时间",
    },
    {
      prop: "content",
      label: "服用说明",
    },
  ],
});

// 添加
const add = () => {
  ruleForm.plans.push({
    time: "",
    content: "",
  });
};
// 删除
const del = (index: number) => {
  ruleForm.plans.splice(index, 1);
};

// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const valid = await formEl.validate().catch(() => {});
  if (valid) {
    let res: any;
    if (props.isinfo) {
      res = await DrugPlanAdd(ruleForm).catch(() => {});
    } else {
      res = await DrugPlanUpdateEndDate({
        id: ruleForm.drugId,
        endDate: ruleForm.startDate,
      });
    }
    if (res?.code === 10000) {
      ElMessage.success("添加成功");
      close(true);
    }
  }
};

// 关闭弹窗
const close = (close: boolean = false) => {
  emit("close", close);
};
// 选择时间
const tiemSelect = (val: any) => {
  ruleForm.startDate = val;
};
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}
</style>
