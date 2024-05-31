<template>
  <el-dialog
    v-model="dialogVisible"
    :title="ruleForm.id == 0 ? '新增房型' : '编辑房型'"
    width="500"
    @close="close"
  >
    <el-form
      ref="ruleFormRef"
      style="max-width: 400px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="房型名称:" prop="name">
        <!-- {{ props.dataget }} -->
        <el-input v-model="ruleForm.name" placeholder="请输入房型名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >确定</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, defineProps } from "vue";
import { HousetypeAdd, Housetypeupdate } from "@/service/config/ConfigApi";
import type { Housetypeadd } from "@/service/config/ConfigType";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
const props = defineProps(["dataget"]);
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<Housetypeadd>({
  id: 0,
  name: "",
});

const rules = reactive<FormRules<Housetypeadd>>({
  name: [{ required: true, message: "请输入房型名称", trigger: "blur" }],
});
// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res: any;
      if (!ruleForm.id) {
        res = await HousetypeAdd(ruleForm);
      } else {
        res = await Housetypeupdate(ruleForm);
      }
      if (res.code == 10000) {
        ElMessage.success(res.msg);
        close(true);
      } else {
        ElMessage.error(res.msg);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

//弹框
const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};

// 数据回显
if (props.dataget) {
  Object.assign(ruleForm, props.dataget);
}
</script>

<style lang="less" scoped></style>
