<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增/编辑家属"
    width="500"
    @close="close"
  >
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
      <el-form-item label="姓名：" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入管理员名称" />
      </el-form-item>
      <el-form-item label="联系电话：" prop="mobile">
        <el-input v-model="ruleForm.mobile" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="身份证号:">
        <el-input v-model="ruleForm.idCard" placeholder="请输入身份证号" />
      </el-form-item>
      <el-form-item label="与老人关系:" prop="relation">
        <el-select
          v-model="ruleForm.relation"
          placeholder="请选择"
          style="width: 300px"
        >
          <el-option
            v-for="item in relationdata"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="性别:">
        <el-radio-group v-model="ruleForm.gender">
          <el-radio :value="1">男</el-radio>
          <el-radio :value="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="联系地址">
        <el-input v-model="ruleForm.address" placeholder="请输入联系地址" />
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
import { ref, reactive, defineEmits, inject, watch, defineProps } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import type { FamilyItem, AddElderlyRequest } from "@/service/old/OldType";
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<FamilyItem>({
  name: "",
  mobile: "",
  idCard: "",
  relation: "",
  gender: 1,
  address: "",
});
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
let edimtindex = ref(0);
// 数据回显
watch(
  () => props.data,
  (newval) => {
    if (newval) {
      Object.assign(ruleForm, newval?.data);
      edimtindex.value = newval?.index;
      console.log(ruleForm);
    }
  },
  {
    // deep: true,
    immediate: true,
  }
);

const relationdata = [
  "父子",
  "母子",
  "父女",
  "母女",
  "兄弟",
  "姐妹",
  "朋友",
  "其他",
  "本人",
];
const dialogVisible = ref(true);
const form = inject<AddElderlyRequest>("ruleForm")!;
const emit = defineEmits(["close"]);
const rules = reactive<FormRules<any>>({
  name: [{ required: true, message: "请输入", trigger: "blur" }],
  mobile: [
    {
      required: true,
      message: "请输入联系电话",
      trigger: "blur",
    },
  ],
  region: [
    {
      required: true,
      message: "请选择与老人关系",
      trigger: "change",
    },
  ],
});
// 关闭弹窗
const close = (close: boolean = false) => {
  emit("close", close);
};
// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const valid = await formEl.validate();
  if (valid) {
    if (!ruleForm.id) {
      form.family.push({
        id: form.family.length + 1,
        ...ruleForm,
      });
    } else {
      form.family.splice(edimtindex.value, 1, ruleForm);
    }
    console.log(ruleForm);

    close(true);
  }
};
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}
</style>
