<template>
  <el-time-picker
    v-model="value"
    :is-range="props.isrange"
    :range-separator="props.rangeSeparator"
    :start-placeholder="props.startPlaceholder"
    :end-placeholder="props.endPlaceholder"
    :value-format="props.valueformat"
    :format="props.valueformat"
    placeholder="选择时间"
    @change="timeselect"
  />
</template>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch } from "vue";
const emit = defineEmits(["change"]);
const props = defineProps({
  isrange: {
    type: Boolean,
    default: false,
  },
  rangeSeparator: {
    type: String,
    default: "-",
  },
  startPlaceholder: {
    type: String,
    default: "开始时间",
  },
  endPlaceholder: {
    type: String,
    default: "结束时间",
  },
  valueformat: {
    type: String,
    default: "HH:mm",
  },
  startTime: {
    type: String,
    default: "",
  },
  endTime: {
    type: String,
    default: "",
  },
});
const value = ref<string | Array<string>>(
  props.isrange ? [props.startTime, props.endTime] : ""
);
// 选择时间
const timeselect = (val: string) => {
  console.log(val);
  emit("change", val);
};
// 监听时间变化
watch(
  props,
  (newVal) => {
    console.log(newVal);
    if (newVal.startTime == "" && newVal.endTime == "") {
      value.value = "";
    } else {
      value.value = [newVal.startTime, newVal.endTime];
    }
  },
  { deep: true }
);
</script>
<style lang="less" scoped></style>
