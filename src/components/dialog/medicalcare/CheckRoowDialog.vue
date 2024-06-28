<template>
  <el-dialog
    v-model="dialogVisible"
    :title="!props.data.id ? '增加查房记录' : '编辑查房记录'"
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
      style="max-width: 600px"
    >
      <el-form-item label="选择老人：" prop="elderlyId">
        <el-button :type="!OldName ? 'primary' : ''" @click="select" text bg>{{
          !OldName ? "选择老人" : OldName
        }}</el-button>
        <OldSelectDialog v-if="idOld" @id="oldid" />
      </el-form-item>
      <el-form-item label="精神：" prop="spirit">
        <el-input v-model="ruleForm.spirit" placeholder="请输入精神" />
      </el-form-item>
      <el-form-item label="饮食：" prop="diet">
        <el-input v-model="ruleForm.diet" placeholder="请输入饮食" />
      </el-form-item>
      <el-form-item label="睡眠：" prop="sleep">
        <el-input v-model="ruleForm.sleep" placeholder="请输入睡眠" />
      </el-form-item>
      <el-form-item label="大便：" prop="shit">
        <el-input v-model="ruleForm.shit" placeholder="请输入大便" />
      </el-form-item>
      <el-form-item label="小便：" prop="urinate">
        <el-input v-model="ruleForm.urinate" placeholder="请输入小便" />
      </el-form-item>
      <el-form-item label="交流：" prop="communicate">
        <el-input v-model="ruleForm.communicate" placeholder="请输入交流" />
      </el-form-item>
      <el-form-item label="记忆：" prop="memory">
        <el-input v-model="ruleForm.memory" placeholder="请输入记忆" />
      </el-form-item>
      <el-form-item label="体温：" prop="temperature">
        <el-input v-model="ruleForm.temperature" placeholder="请输入体温" />
      </el-form-item>
      <el-form-item label="脉搏：" prop="pulse">
        <el-input v-model="ruleForm.pulse" placeholder="请输入脉搏" />
      </el-form-item>
      <el-form-item label="呼吸：" prop="breathe">
        <el-input v-model="ruleForm.breathe" placeholder="请输入呼吸" />
      </el-form-item>
      <el-form-item label="血压：" prop="blood">
        <el-input v-model="ruleForm.blood" placeholder="请输入血压" />
      </el-form-item>
      <el-form-item label="医生建议：" prop="suggest">
        <el-input v-model="ruleForm.suggest" placeholder="医生建议" />
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
import { defineEmits, defineProps, onMounted, reactive, ref } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { getElderly } from "@/service/old/OldApi";
import {
  CheckRoomAdd,
  CheckRoomUpdate,
} from "@/service/medicalcare/MedicalcareApi";
import type { CheckRoomAddParams } from "@/service/medicalcare/MedicalcareType";
import OldSelectDialog from "@/components/dialog/OldSelect/OldSelectDialog.vue";

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<CheckRoomAddParams>({
  elderlyId: null,
  spirit: "",
  diet: "",
  sleep: "",
  shit: "",
  urinate: "",
  communicate: "",
  memory: "",
  temperature: "",
  pulse: "",
  breathe: "",
  blood: "",
  suggest: "",
});
const rules = reactive<FormRules<CheckRoomAddParams>>({
  elderlyId: [
    {
      required: true,
      message: "请选择老人",
      trigger: "change",
    },
  ],
  spirit: [
    {
      required: true,
      message: "请输入精神",
      trigger: "blur",
    },
  ],
  diet: [
    {
      required: true,
      message: "请输入饮食",
      trigger: "blur",
    },
  ],
  sleep: [
    {
      required: true,
      message: "请输入睡眠",
      trigger: "blur",
    },
  ],
  shit: [
    {
      required: true,
      message: "请输入大便",
      trigger: "blur",
    },
  ],
  urinate: [
    {
      required: true,
      message: "请输入小便",
      trigger: "blur",
    },
  ],
  communicate: [
    {
      required: true,
      message: "请输入交流",
      trigger: "blur",
    },
  ],
  memory: [
    {
      required: true,
      message: "请输入记忆",
      trigger: "blur",
    },
  ],
  temperature: [
    {
      required: true,
      message: "请输入体温",
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
  breathe: [
    {
      required: true,
      message: "请输入呼吸",
      trigger: "blur",
    },
  ],
  blood: [
    {
      required: true,
      message: "请输入血压",
      trigger: "blur",
    },
  ],
  suggest: [
    {
      required: true,
      message: "请输入医生建议",
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
      res = await CheckRoomAdd(ruleForm);
    } else {
      res = await CheckRoomUpdate(ruleForm);
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
      idOld.value = false;
      OldName.value = res.data.name;
    }
    ruleForm.elderlyId = id;
    ElMessage.success("选择老人成功");
  }
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
