<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增机构"
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
      <el-form-item label="机构名称：" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="所属区域：" prop="name">
        <el-select
          v-model="ruleForm.address"
          placeholder="请选择"
          style="width: 300px"
        >
          <el-option
            v-for="item in addresslist"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="管理员名称：" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入管理员名称" />
      </el-form-item>
      <el-form-item label="联系电话：" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="管理员账号" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入管理员账号" />
      </el-form-item>
      <el-form-item label="管理员密码" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入管理员密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="close(true)"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { defineEmits, reactive, ref } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<any>({});
const rules = reactive<FormRules<any>>({});
const dialogVisible = ref(true);
const addresslist = ref([]);
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
