<template>
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
  <div ref="chartContainer" style="width: 90%; height: 460px"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineProps, watch } from "vue";
import * as echarts from "echarts";
const props = defineProps({
  sellPricelist: {
    type: Array,
    default: () => [],
  },
  wholePricelist: {
    type: Array,
    default: () => [],
  },
  purchasePricelist: {
    type: Array,
    default: () => [],
  },
  timelist: {
    type: Array,
    default: () => [],
  },
});

let chartContainer = ref(null);
const isechaets = ref(true);
let myChart: echarts.ECharts | null = null;
const initChart = () => {
  if (chartContainer.value) {
    if (isechaets.value === true) {
      myChart = echarts.init(chartContainer.value);
    }
    const option: echarts.EChartsOption = {
      xAxis: {
        type: "category",
        data: props.timelist as Array<string>,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: props.sellPricelist as Array<string>,
          type: "line",
          smooth: true,
        },
        {
          data: props.wholePricelist as Array<string>,
          type: "line",
          smooth: true,
        },
        {
          data: props.purchasePricelist as Array<string>,
          type: "line",
          smooth: true,
        },
      ],
    };
    myChart?.setOption(option);
  }
};

watch(
  props,
  (newval) => {
    if (newval) {
      console.log(1111222);
      initChart();
    }
  },
  { deep: true }
);
onMounted(() => {
  initChart();
  isechaets.value = false;
});

defineExpose({
  initChart,
});
</script>

<style scoped></style>
