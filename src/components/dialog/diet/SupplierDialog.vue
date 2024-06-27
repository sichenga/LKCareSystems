<template>
  <el-dialog
    v-model="dialogVisible"
    :title="ruleForm.id == 0 ? '新增供应商' : '修改供应商'"
    width="500"
    @close="close"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      :size="formSize"
      class="demo-ruleForm"
      label-width="auto"
      status-icon
      style="max-width: 600px"
    >
      <el-form-item label="供应商名称:" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入供应商名称" />
      </el-form-item>
      <el-form-item label="联系人:" prop="linkMan">
        <el-input v-model="ruleForm.linkMan" placeholder="请输入联系人" />
      </el-form-item>
      <el-form-item label="联系电话:" prop="mobile">
        <el-input v-model="ruleForm.mobile" placeholder="请输入联系电话" />
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
import {
  SupplierAdd,
  Supplierget,
  SupplierUpdate,
} from "@/service/food/FoodApi";
import type { Supplieradd } from "@/service/food/FoodType";

const props = defineProps(["id"]);
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<Supplieradd>({
  id: props.id,
  name: "",
  linkMan: "",
  mobile: "",
});
const rules = reactive<FormRules<Supplieradd>>({
  name: [{ required: true, message: "请输入供应商名称", trigger: "blur" }],
  linkMan: [{ required: true, message: "请输入联系人", trigger: "blur" }],
  mobile: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (ruleForm.id == 0) {
        const res: any = await SupplierAdd(ruleForm).catch(() => {});
        console.log(res);
        if (res.code === 10000) {
          ruleFormRef.value && ruleFormRef.value.resetFields();
          ElMessage({
            message: res.msg,
            type: "success",
          });
          emit("close", true);
        } else {
          ElMessage({
            message: "添加失败",
            type: "error",
          });
        }
      } else {
        const res: any = await SupplierUpdate(ruleForm).catch(() => {});
        console.log("修改", res);
        if (res.code === 10000) {
          ruleFormRef.value && ruleFormRef.value.resetFields();
          ElMessage({
            message: res.msg,
            type: "success",
          });
          emit("close", true);
        } else {
          ElMessage({
            message: "添加失败",
            type: "error",
          });
        }
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 单条数据
const getModel = async () => {
  if (ruleForm.id) {
    const res: any = await Supplierget(ruleForm.id);
    console.log("单条数据", res);
    Object.assign(ruleForm, res.data);
  }
};

onMounted(() => {
  getModel();
});

const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}
</style>
