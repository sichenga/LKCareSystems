<template>
  <el-dialog
    v-model="dialogVisible"
    :title="!props.data.id ? '增加血压记录' : '编辑血压记录'"
    width="500"
    @close="close"
  >
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      label-position="left"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="选择老人：" prop="elderlyId">
        <div v-if="OldName" @click="select">
          {{ OldName }}
        </div>
        <el-button v-else type="primary" @click="select">选择老人</el-button>
        <OldSelectDialog v-if="idOld" @id="oldid" @close="oldclose" />
      </el-form-item>
      <el-form-item label="血压：" prop="bloodPressure">
        <el-input v-model="ruleForm.bloodPressure" placeholder="请输入血压" />
      </el-form-item>
      <el-form-item label="脉搏：" prop="pulse">
        <el-input v-model="ruleForm.pulse" placeholder="请输入脉搏" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, defineEmits, defineProps, onMounted } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";

import { ElMessage } from "element-plus";
import OldSelectDialog from "@/components/dialog/OldSelect/OldSelectDialog.vue";
import {
  BloodPressureAdd,
  BloodPressureUpdate,
} from "@/service/medicalcare/MedicalcareApi";
import { getElderly } from "@/service/old/OldApi";
import type { BloodPressureAddParams } from "@/service/medicalcare/MedicalcareType";

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<BloodPressureAddParams>({
  id: null,
  elderlyId: null,
  bloodPressure: "",
  pulse: "",
});
const rules = reactive<FormRules<BloodPressureAddParams>>({
  elderlyId: [
    {
      required: true,
      message: "请选择老人",
      trigger: "change",
    },
  ],
  bloodPressure: [
    {
      required: true,
      message: "请输入血压",
      trigger: "blur",
    },
  ],
  pulse: [
    {
      required: true,
      message: "请输入脉搏",
      trigger: "blur",
    },
  ],
});
const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
// 关闭弹窗
const close = (close: boolean = false) => {
  emit("close", close);
};
// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const valid = await formEl.validate().catch(() => {});
  if (valid) {
    let res: any;
    if (!ruleForm.id) {
      res = await BloodPressureAdd(ruleForm);
    } else {
      res = await BloodPressureUpdate(ruleForm);
    }
    if (res?.code === 10000) {
      ElMessage.success(ruleForm.id ? "修改成功" : "添加成功");
      close(true);
    }
  }
};
// 选择老人
const idOld = ref(false);
const select = () => {
  idOld.value = true;
};
const OldName = ref("");
const oldid = async (id: number) => {
  console.log(id);
  if (id) {
    let res: any = await getElderly(id);
    if (res?.code == 10000) {
      OldName.value = res.data.name;
    }
    ruleForm.elderlyId = id;
    ElMessage.success("选择老人成功");
  }
};
// 关闭老人弹窗
const oldclose = () => {
  idOld.value = false;
};
// 数据回显
const Editold = async () => {
  if (props.data) {
    OldName.value = props.data.elderlyName;
    Object.assign(ruleForm, props.data);
  }
};
// 生命周期
onMounted(() => {
  Editold();
});
// onMounted
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}
</style>
