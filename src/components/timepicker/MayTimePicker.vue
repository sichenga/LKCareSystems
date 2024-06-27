<template>
  <!-- <div>
    {{ time }}
  </div> -->
  <el-date-picker
    v-model="times"
    :format="props.format"
    :size="props.size as any"
    :value-format="valueFormat"
    editable
    placeholder="请选择"
    type="datetime"
    @change="handleChange"
  />
</template>
<script lang="ts" setup>
import { defineEmits, defineProps, ref, watch } from "vue";

const props = defineProps({
  size: {
    type: String,
    default: "large",
  },
  remtime: {
    type: String,
    default: "",
  },
  format: {
    type: String,
    default: "YYYY-MM-DD HH:mm",
  },
  valueFormat: {
    type: String,
    default: "YYYY-MM-DD HH:mm",
  },
});

//时间回显
const times = ref("");
watch(
  () => props.remtime,
  (newValue) => {
    console.log("时间回显", newValue);
    if (newValue) {
      times.value = newValue;
      //console. log('时间回显', times.value)
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
