<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑物料"
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
      <el-form-item label="物料名称:" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入物料名称" />
      </el-form-item>
      <el-form-item label="单位:" prop="unit">
        <el-select v-model="ruleForm.unit" placeholder="请选择">
          <el-option
            v-for="item in unitlist"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商:" prop="supplierId">
        <el-select v-model="ruleForm.supplierId" placeholder="请选择">
          <el-option
            v-for="item in supplierlist"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
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
import { ref, reactive, defineEmits, onMounted, defineProps, watch } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import {
  Foodadd,
  Foodupdate,
  Foodget,
  SupplierList,
} from "@/service/food/FoodApi";
import type { AddFood, SelectSupplier } from "@/service/food/FoodType";
const props = defineProps({
  foodid: {
    type: Number,
    default: 0,
  },
});

// 数据回显
watch(
  () => props.foodid,
  async (newval) => {
    console.log(newval);
    if (newval) {
      let res: any = await Foodget(newval);
      console.log("编辑", res);
      if (res?.code === 10000) {
        Object.assign(ruleForm, res.data);
        // ruleForm.supplierId = res.oldName.supplier.i
      }
    }
  },
  { immediate: true }
);
// 供应商列表
const supplierlist = ref<Array<SelectSupplier>>([]);
// 单位
const unitlist = ref(["斤", "吨", "个", "克"]);
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<AddFood>({
  id: props.foodid,
  name: "",
  unit: "",
  supplierId: undefined,
});
const rules = reactive<FormRules<AddFood>>({
  name: [
    {
      required: true,
      message: "请输入物料名称",
      trigger: "blur",
    },
  ],
  unit: [
    {
      required: true,
      message: "请选择单位",
      trigger: "change",
    },
  ],
  supplierId: [
    {
      required: true,
      message: "请选择供应商",
      trigger: "change",
    },
  ],
});

const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};
// 供应商列表
const getSupplierList = async () => {
  const res: any = await SupplierList().catch(() => {});
  console.log("供应商列表", res);
  if (res?.code === 10000) {
    supplierlist.value = res.data.list.map((item: any) => ({
      id: item.id,
      name: item.name,
    }));
  }
};
// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const valid = await formEl.validate();
  if (valid) {
    let res: any;
    if (!ruleForm.id) {
      res = await Foodadd(ruleForm);
    } else {
      res = await Foodupdate(ruleForm);
    }
    console.log(res);
    if (res?.code === 10000) {
      ElMessage.success("添加成功");
      close(true);
    }
  }
};

onMounted(() => {
  getSupplierList();
});
</script>
<style lang="less" scoped>
.el-form-item {
  width: 400px;
}
</style>
