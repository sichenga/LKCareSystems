<template>
  <el-dialog
    v-model="dialogVisible"
    :title="ruleForm.id == 0 ? '新增家属' : '编辑家属'"
    width="500"
    @close="close"
  >
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :rules="rules"
      :model="ruleForm"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile">
        <el-input v-model="ruleForm.mobile" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard">
        <el-input v-model="ruleForm.idCard" placeholder="请输入身份证号" />
      </el-form-item>
      <el-form-item label="与老人关系" prop="relation">
        <el-select v-model="ruleForm.relation" placeholder="请选择与老人关系">
          <el-option label="父子关系" value="父子关系" />
          <el-option label="父女关系" value="父女关系" />
          <el-option label="母子关系" value="母子关系" />
          <el-option label="母女关系" value="母女关系" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="ruleForm.gender">
          <el-radio :value="1">男</el-radio>
          <el-radio :value="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="联系地址" prop="address">
        <el-input v-model="ruleForm.address" />
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
import { ref, reactive, defineEmits, defineProps } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
const formSize = ref<ComponentSize>("default");
const props = defineProps(["formData", "sign"]);
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<any>({
  id: 0,
  name: "",
  mobile: "",
  gender: null,
  idCard: "",
  status: "",
  roomRequire: "",
  content: "",
  state: 1,
  source: "在线咨询",
  family: [
    {
      name: "",
      mobile: "",
      gender: null,
      idCard: "",
      relation: "", // 现在可以安全地使用 relation，因为它在 FamilyMember 接口中定义了
      address: "",
    },
  ],
});

// 回显数据
if (props.sign == 2) {
  Object.assign(ruleForm, props.formData);
} else if (props.sign == 1) {
  Object.keys(ruleForm).forEach((key) => {
    if (key !== "id") {
      // 保留'id'字段，因为它是常量
      ruleForm[key] = "";
    }
  });
}

const rules = reactive<FormRules<any>>({
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  mobile: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
  idCard: [{ required: true, message: "请输入身份证号", trigger: "blur" }],
  relation: [{ required: true, message: "请选择与老人关系", trigger: "blur" }],
  gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
  address: [{ required: true, message: "请输入联系地址", trigger: "blur" }],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (props.sign == 1) {
        console.log("添加", ruleForm);

        emit("addFamilyMember", ruleForm);
      } else if (props.sign == 2) {
        console.log("修改", ruleForm);
        emit("updateFamilyMember", ruleForm);
      }
      dialogVisible.value = false;
    } else {
      console.log("error submit!", fields);
    }
  });
};

const dialogVisible = ref(true);
const emit = defineEmits(["close", "addFamilyMember", "updateFamilyMember"]);
const close = (close: boolean = false) => {
  emit("close", close);
};
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}

.el-select {
  width: 300px;
}
</style>
