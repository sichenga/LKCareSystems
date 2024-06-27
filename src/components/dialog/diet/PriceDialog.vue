<template>
  <el-dialog
    v-model="dialogVisible"
    title="价格更新"
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
      <el-form-item label="更新日期:"> {{ ruleForm.updateTime }} </el-form-item>
      <el-form-item label="批发价:" prop="wholePrice">
        <el-input v-model="ruleForm.wholePrice" placeholder="请输入批发价" />
      </el-form-item>
      <el-form-item label="零售价:" prop="sellPrice">
        <el-input v-model="ruleForm.sellPrice" placeholder="请输入零售价" />
      </el-form-item>
      <el-form-item label="采购价:" prop="purchasePrice">
        <el-input v-model="ruleForm.purchasePrice" placeholder="请输入采购价" />
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
import { defineEmits, defineProps, reactive, ref, watch } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { foodpriceadd, foodpriceupdate } from "@/service/food/FoodApi";
import type { AddFoodPrice } from "@/service/food/FoodType";
import moment from "moment";

const mons = moment;
const props = defineProps({
  priceid: {
    type: Number,
    default: 0,
  },
  pricedata: {
    type: Object,
    default: () => {},
  },
});

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<AddFoodPrice>({
  id: 0,
  foodId: props.priceid,
  wholePrice: undefined,
  sellPrice: undefined,
  purchasePrice: undefined,
  updateTime: moment(new Date()).format("YYYY-MM-DD"),
});
const rules = reactive<FormRules<AddFoodPrice>>({
  wholePrice: [
    {
      required: true,
      message: "请输入批发价",
      trigger: "blur",
    },
  ],
  sellPrice: [
    {
      required: true,
      message: "请输入零售价",
      trigger: "blur",
    },
  ],
  purchasePrice: [
    {
      required: true,
      message: "请输入采购价",
      trigger: "blur",
    },
  ],
});

const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const valid = await formEl.validate();
  if (valid) {
    let res: any;
    if (!props.pricedata) {
      res = await foodpriceadd(ruleForm);
    } else {
      res = await foodpriceupdate(ruleForm);
    }

    console.log(res);
    if (res?.code === 10000) {
      ElMessage.success("添加成功");
      close(true);
    }
  }
};

// 数据回显
watch(
  () => props.pricedata,
  (newval) => {
    if (newval) {
      Object.assign(ruleForm, newval);
    }
  },
  { deep: true, immediate: true }
);
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}
</style>
