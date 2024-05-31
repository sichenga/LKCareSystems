<template>
  <!-- <el-dialog v-model="dialogVisible" title="新增/编辑护理服务" width="500" @close="close">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="服务名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="关联表单">
        <el-select v-model="ruleForm.region" placeholder="请选择">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="服务描述" prop="desc">
        <el-input v-model="ruleForm.desc" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="close(true)">确定</el-button>
      </div>
    </template>
</el-dialog> -->
  <MayDialog
    :title="ruleForm.id == 0 ? '新增护理服务' : '编辑护理服务'"
    @close="close"
  >
    <template #dialog>
      <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <el-form-item label="服务名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="服务描述" prop="content">
          <el-input v-model="ruleForm.content" type="textarea" />
        </el-form-item>
      </el-form>
    </template>
  </MayDialog>
</template>

<script lang="ts" setup>
import { reactive, ref, defineEmits, defineProps, watch } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import MayDialog from "@/components/dialog/maydialog/MayDialog.vue";
import { ElMessage } from "element-plus";
import {
  addNursingService,
  updateNursingService,
} from "@/service/config/ConfigApi";
import type { NursingServiceAdd } from "@/service/config/ConfigType";
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<NursingServiceAdd>({
  id: 0,
  name: "",
  content: "",
});

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

// 回显数据
watch(
  () => props.data,
  (newval) => {
    console.log(111, newval);
    if (newval) {
      Object.assign(ruleForm, newval);
    }
  },
  { immediate: true }
);

const rules = reactive<FormRules<NursingServiceAdd>>({
  name: [
    {
      required: true,
      message: "请选择服务名称",
      trigger: "blur",
    },
  ],
  content: [
    {
      required: true,
      message: "请选择服务描述",
      trigger: "blur",
    },
  ],
});

// 确定提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const valid = await formEl.validate().catch(() => {});
  if (valid) {
    let res: any;
    if (!ruleForm.id) {
      res = await addNursingService(ruleForm).catch(() => {});
    } else {
      res = await updateNursingService(ruleForm).catch(() => {});
    }
    console.log("增加", res);
    if (res?.code == 10000) {
      ElMessage.success(ruleForm.id ? "编辑成功" : "新增成功");
    }
  }
  return valid;
};

//关闭弹框
const emit = defineEmits(["close"]);
const close = async (close: boolean = false) => {
  if (close === true) {
    let submit = await submitForm(ruleFormRef.value);
    if (!submit) return false;
  }
  emit("close", close);
};
</script>

<style lang="less" scoped></style>
