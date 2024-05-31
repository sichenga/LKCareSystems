<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增床位"
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
      <el-form-item label="房间号：">
        <span>{{ props.housedata?.name }}</span>
      </el-form-item>
      <el-form-item label="床位号：" prop="name">
        <el-input
          v-model="ruleForm.name"
          style="width: 300px"
          placeholder="请输入床位号"
        />
      </el-form-item>
      <el-form-item label="床位月价格：" prop="price">
        <el-input
          v-model="ruleForm.price"
          style="width: 300px"
          placeholder="请输入床位月价格"
        />
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
import { ref, reactive, defineEmits, defineProps, watch } from "vue";
import { ElMessage } from "element-plus";
import { addBeds, updateBeds } from "@/service/config/ConfigApi";
import type { BedsAdd } from "@/service/config/ConfigType";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
const props = defineProps({
  housedata: {
    type: Object,
    default: () => {},
  },
  emitdata: {
    type: Object,
    default: () => {},
  },
});
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<BedsAdd>({
  id: 0,
  houseId: props.housedata?.id,
  name: "",
  price: undefined,
  state: 0,
});
const rules = reactive<FormRules<BedsAdd>>({
  name: [{ required: true, message: "请输入床位号", trigger: "blur" }],
  price: [{ required: true, message: "请输入床位月价格", trigger: "blur" }],
});
const dialogVisible = ref(true);

// 数据回显
watch(
  () => props.emitdata,
  (newval) => {
    console.log(111, newval);

    if (newval) {
      Object.assign(ruleForm, newval);
    }
  },
  { immediate: true }
);

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const valid: any = await formEl.validate();
  if (valid) {
    let res: any;
    if (!ruleForm.id) {
      ruleForm.name = props.housedata?.name + "-" + ruleForm.name;
      res = await addBeds(ruleForm);
    } else {
      res = await updateBeds(ruleForm);
    }
    if (res?.code === 10000) {
      ElMessage.success(ruleForm.id ? "修改成功" : "添加成功");
      close(true);
    } else {
      ElMessage.error(res?.msg);
    }
  }
};

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
