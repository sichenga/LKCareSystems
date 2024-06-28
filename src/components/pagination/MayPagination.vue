<template>
  <div class="pagination">
    <el-pagination
      v-model:current-page="data.page"
      v-model:page-size="data.psize"
      :page-sizes="[5, 10, 15, 20]"
      :small="false"
      :background="true"
      :layout="props.layout"
      :total="data.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script lang="ts" setup>
import { reactive, defineProps, watch, defineEmits } from "vue";
import type { PaginationConfig } from "@/Type/pagination";

const emit = defineEmits(["page", "psize"]);

let data = reactive<PaginationConfig>({
  page: 1,
  psize: 10,
  total: 0,
});
const props = defineProps({
  page: {
    type: Number,
    default: 1,
  },
  psize: {
    type: Number,
    default: 5,
  },
  total: {
    type: Number,
    default: 0,
  },
  layout: {
    type: String,
    default: "total,  prev, pager, next,jumper,sizes",
  },
});

watch(
  props,
  (newval) => {
    if (newval) {
      data.page = newval.page;
      data.psize = newval.psize;
      data.total = newval.total;
    }
  },
  { immediate: true }
);
const handleSizeChange = (val: number) => {
  emit("psize", val);
};
const handleCurrentChange = (val: number) => {
  emit("page", val);
};
</script>
<style lang="less" scoped>
.el-pagination {
  margin-top: 20px;
  // justify-content: center;
  align-items: center;
}

.pagination {
  display: flex;
  flex-direction: row-reverse;
}
</style>
