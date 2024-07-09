<!--  线 + 柱混合图 -->
<template>
  <el-card>
    <template #header>
      <div class="title">
        出院、入院、预定 统计
        <el-tooltip effect="dark" content="点击下载" placement="bottom">
          <i-ep-download class="download" @click="downloadEchart" />
        </el-tooltip>
      </div>
    </template>

    <div :id="id" :class="className" :style="{ height, width }"></div>
  </el-card>
</template>

<script setup lang="ts">
import {
  getageGroup,
  getDisCount,
  getResCount,
} from "@/service/dashboard/dashboardApi";
import * as echarts from "echarts";

const props = defineProps({
  id: {
    type: String,
    default: "MarketChart",
  },
  className: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "200px",
    required: true,
  },
  height: {
    type: String,
    default: "200px",
    required: true,
  },
});

const options = {
  grid: {
    left: "2%",
    right: "2%",
    bottom: "10%",
    containLabel: true,
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      crossStyle: {
        color: "#999",
      },
    },
  },
  legend: {
    x: "center",
    y: "bottom",
    data: ["入院", "出院", "预定"],
    textStyle: {
      color: "#999",
    },
  },
  xAxis: [
    {
      type: "category",
      data: [],
      axisPointer: {
        type: "shadow",
      },
    },
  ],
  yAxis: [
    // {
    //   type: "value",
    //   min: 0,
    //   max: 10000,
    //   interval: 2000,
    //   axisLabel: {
    //     formatter: "{value} ",
    //   },
    // },
    {
      type: "value",
      min: 0,
      max: 100,
      interval: 20,
      axisLabel: {
        formatter: "{value}",
      },
    },
  ],
  series: [
    {
      name: "入院",
      type: "line",
      data: [],
      barWidth: 20,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#83bff6" },
          { offset: 0.5, color: "#188df0" },
          { offset: 1, color: "#188df0" },
        ]),
      },
    },
    {
      name: "出院",
      type: "line",
      data: [],
      barWidth: 20,
    },
    {
      name: "预定",
      type: "line",
      data: [],
      barWidth: 20,
    },
  ],
};

const downloadEchart = () => {
  // 获取画布图表地址信息
  const img = new Image();
  img.src = chart.value.getDataURL({
    type: "png",
    pixelRatio: 1,
    backgroundColor: "#fff",
  });
  // 当图片加载完成后，生成 URL 并下载
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const link = document.createElement("a");
      link.download = `业绩柱状图.png`;
      link.href = canvas.toDataURL("image/png", 0.9);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };
};
// 获取最近12个月入院数量统计
const getagegroup = async () => {
  const res: any = await getageGroup();
  if (res?.code === 10000) {
    options.series[0].data = res.data.map((item: any) => item.count);
    options.xAxis[0].data = res.data.map((item: any) => item.name);
    // options.series[0].data = res.data.map((item: any) => item.count);
    // options.xAxis[0].data = res.data.map((item: any) => item.name);
  }
};
// 获取最近12个月入院数量统计
const getdiscount = async () => {
  const res: any = await getDisCount();
  if (res?.code === 10000) {
    options.series[1].data = res.data.map((item: any) => item.count);
  }
};
// 获取最近12个月预定数量统计
const getrescount = async () => {
  const res: any = await getResCount();
  if (res?.code === 10000) {
    options.series[2].data = res.data.map((item: any) => item.count);
  }
};
const chart = ref<any>("");
const getApi = async () => {
  await getagegroup();
  await getdiscount();
  await getrescount();
};
onMounted(async () => {
  await getApi();
  // 图表初始化
  chart.value = markRaw(
    echarts.init(document.getElementById(props.id) as HTMLDivElement)
  );

  chart.value.setOption(options);

  // 大小自适应
  window.addEventListener("resize", () => {
    chart.value.resize();
  });
});

onActivated(() => {
  if (chart.value) {
    chart.value.resize();
  }
});
</script>
<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;

  .download {
    cursor: pointer;

    &:hover {
      color: #409eff;
    }
  }
}
</style>
