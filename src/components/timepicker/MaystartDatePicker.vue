<template>
  <!-- <div>
        开始日期:
    </div> -->
  <el-date-picker
    v-model="times"
    type="datetime"
    placeholder="请选择"
    :format="props.format"
    :value-format="valueFormat"
    editable
    :size="props.size"
    @change="handleChange"
  />
</template>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch } from "vue";
// 父传子 传递参数
const props = defineProps({
  size: {
    type: String,
    default: "large",
  },
  remtime: {
    type: String,
    default: "",
  },
  // 展示的日期格式
  format: {
    type: String,
    default: "YYYY-MM-DD",
  },
  // 绑定值的日期格式
  valueFormat: {
    type: String,
    default: "YYYY-MM-DD",
  },
});

//时间回显
const times = ref("2024-05-10 12:00");
watch(
  () => props.remtime,
  (newValue) => {
    console.log("时间回显", newValue);
    if (newValue) {
      times.value = newValue;
      // console.log('时间回显', times.value)
    }
  },
  { immediate: true }
);

const emit = defineEmits(["change"]);

const handleChange = (val: any) => {
  console.log("年月日", val);
  emit("change", val);
};
</script>
<style lang="less" scoped>
.demo-datetime-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-datetime-picker .block:last-child {
  border-right: none;
}
</style>
