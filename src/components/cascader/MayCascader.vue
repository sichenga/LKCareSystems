<template>
  <el-cascader
    v-model="value"
    :options="props.options as any"
    :props="CascaderProps"
    clearable
    @change="change"
    @close="close"
  />
</template>
<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref, watch } from "vue";

const props = defineProps({
  // 数据
  options: {
    type: Array,
    default: () => [],
  },
  // 配置项
  defprops: {
    type: Object,
    default: () => {},
  },
  emitid: {
    type: Number,
    default: undefined,
  },
});
const value = ref();
// 数据回显
watch(
  () => props.emitid,
  (newval) => {
    console.log(1111, newval);

    if (newval) {
      value.value = newval;
      console.log(value.value);
    } else {
      value.value = null;
    }
  },
  { immediate: true }
);
const emit = defineEmits(["change"]);
const CascaderProps = reactive({
  expandTrigger: props.defprops?.expandTrigger || "click",
  checkStrictly: props.defprops?.checkStrictly || false,
  emitPath: props.defprops?.emitPath || false,
  multiple: props.defprops?.multiple || false,
  value: props.defprops?.value || "id",
  label: props.defprops?.label || "name",
  children: props.defprops?.children || "children",
  disabled: props.defprops?.disabled || "disabled",
  leaf: props.defprops?.leaf || "leaf",
  lazy: props.defprops?.lazy || false,
});

const change = (val: any) => {
  console.log(val);
  emit("change", val);
};
const close = (val: any) => {
  console.log(val);
};
</script>
<style lang="less" scoped></style>
