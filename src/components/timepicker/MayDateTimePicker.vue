<template>
  <el-date-picker
    v-model="time"
    type="datetimerange"
    :range-separator="rangeSeparator"
    :start-placeholder="startplaceholder"
    :end-placeholder="endplaceholder"
    :format="format"
    :value-format="valueformat"
    @change="handleChange"
  />
</template>
<script lang="ts" setup>
import { ref, defineEmits, defineProps, watch } from "vue";
const params = defineProps({
  statetime: {
    type: String,
    default: "",
  },
  endtime: {
    type: String,
    default: "",
  },
  startplaceholder: {
    type: String,
    default: "开始时间",
  },
  endplaceholder: {
    type: String,
    default: "结束时间",
  },
  rangeSeparator: {
    type: String,
    default: "-",
  },
  format: {
    type: String,
    default: "YYYY-MM-DD HH:mm:ss",
  },
  valueformat: {
    type: String,
    default: "YYYY-MM-DD HH:mm:ss",
  },
});
const emits = defineEmits(["change"]);
const time = ref<any>([]);
console.log(1231, params);
watch(
  params,
  (val) => {
    console.log("回显日期", val);
    if (params.statetime == "" && params.endtime == "") {
      time.value = "";
    } else {
      time.value = [params.statetime, params.endtime];
    }
  },
  { immediate: true, deep: true }
);
// 选择日期时间
const handleChange = (value: string) => {
  console.log(6666, value);
  emits("change", value);
};
</script>
<style lang="less" scoped>
.block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.block:last-child {
  border-right: none;
}
</style>
