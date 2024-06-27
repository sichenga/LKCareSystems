<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增/编辑药品"
    width="500"
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
      style="max-width: 368px"
    >
      <el-form-item label="药品名称:" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item class="Special_line" label="数量:" prop="counts">
        <el-input v-model="ruleForm.counts" />
        <el-select v-model="ruleForm.unit" placeholder="请选择">
          <el-option
            v-for="item in dosage"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="有效期:">
        <TimePicker
          :format="format"
          :remtime="ruleForm.expTime"
          :value-format="format"
          style="width: 287px"
          @change="timeSelect"
        />
      </el-form-item>
      <el-form-item class="Special_line" label="剂量:">
        <el-input v-model="ruleForm.sum" />
        <el-select v-model="ruleForm.norms" placeholder="请选择">
          <el-option
            v-for="item in nums"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="服法:">
        <el-input
          v-model="ruleForm.remarks"
          :rows="2"
          placeholder="Please input"
          style="width: 300px"
          type="textarea"
        />
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
  onMounted,
  reactive,
  ref,
} from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import type { DrugsAddDrugsParams } from "@/service/medicalcare/MedicalcareType";
// 日期格式
const format = "YYYY-MM-DD";
const TimePicker = defineAsyncComponent(
  () => import("@/components/timepicker/MayTimePicker.vue")
);
const props = defineProps({
  remdata: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(["close", "regdata"]);
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const nums = [{ value: "盒", label: "盒" }];
const dosage = [{ value: "粒", label: "粒" }];
const ruleForm = reactive<DrugsAddDrugsParams>({
  name: "",
  counts: null,
  unit: "盒",
  expTime: "",
  sum: null,
  norms: "粒",
  remarks: "",
});
const rules = reactive<FormRules<DrugsAddDrugsParams>>({
  name: [{ required: true, message: "请输入药品名称", trigger: "blur" }],
  counts: [{ required: true, message: "请输入数量", trigger: "blur" }],
  expTime: [{ required: true, message: "请输入有效期", trigger: "change" }],
});
// 使用 inject 来获取父组件传递的值
// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const valid = await formEl.validate();
  if (valid) {
    emit("regdata", ruleForm);
    close(true);
  }
};
// 关闭弹窗
const dialogVisible = ref(true);
const close = (close: boolean = false) => {
  emit("close", close);
};
// 选择有效期
const timeSelect = (val: any) => {
  ruleForm.expTime = val;
};
// 数据回显
const Echodata = () => {
  if (props.remdata) {
    Object.assign(ruleForm, props.remdata);
  }
};
onMounted(() => {
  Echodata();
});
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}
.Special_line {
}
</style>
