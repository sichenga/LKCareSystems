<template>
  <el-card>
    <template #header> 机构分布地图 </template>
    <div
      class="transportMonitoringMap"
      :id="id"
      :class="className"
      :style="{ height, width }"
      ref="echartsRef"
    ></div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted } from "vue";
import * as echarts from "echarts";
import mapData from "../../../assets/json/china.json";
import { getCompanyCount } from "@/service/dashboard/dashboardApi";

defineProps({
  id: {
    type: String,
    default: "pieChart",
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

const echartsRef: Ref = ref(null);
let myChart: any = null;

var points = [
  //这里放标注点的坐标[{name: "北京",value: [116.46, 39.92]}]
  {
    name: "北京市",
    counts: 20,
    value: [116.41995, 40.18994],
  },
  {
    name: "郑州市",
    counts: 30,
    value: [113.665412, 34.757975],
  },
  {
    name: "南宁市",
    value: [108.36637, 22.817746],
  },
  {
    name: "天津市",
    counts: 5,
    value: [117.205126, 39.034933],
  },
  {
    name: "昆明市",
    counts: 6,
    value: [102.81844, 24.906231],
  },
  {
    name: "广州",
    counts: 7,
    value: [113.26453, 23.155008],
  },
];
// 获取机构分布数据

const getompanycount = async () => {
  const res: any = await getCompanyCount();
  console.log(111, res);
  if (res?.code === 10000) {
    points = res.data.map((item: any) => ({
      name: item.name,
      counts: item.count,
      value: item.lngLat.split(","),
    }));
  }
};

onMounted(async () => {
  await getompanycount();
  initChart();
});

let initChart = () => {
  if (!myChart) {
    myChart = echarts.init(echartsRef.value);
  }

  echarts.registerMap("china", mapData as any as string);

  myChart.hideLoading();
  let option = {
    geo: {
      map: "china",
      aspectScale: 0.75, //长宽比
      zoom: 1.1,
      roam: false,
      itemStyle: {
        shadowColor: "rgb(58,115,192)",
        shadowOffsetX: 2,
        shadowOffsetY: 3,
      },
    },
    tooltip: {
      trigger: "item", //类型
      formatter: function (params: any) {
        if (params.data) {
          return `城市：${params.data.name}<br/>机构数：${params.data.counts}`;
        }

        return "";
      },

      //  formatter:'地区:{b}<br/>确诊:{c}'//{a}系列名称,{b}地区名称,{c}合并数值
    },
    //左侧小导航图标
    // visualMap: {
    //   type: "piecewise",
    //   show: true,
    //   x: "left",
    //   y: "bottom",
    //   splitList: [
    //     {
    //       label: "广州10",
    //     },
    //     {
    //       label: "sad22",
    //     },
    //   ],
    //   color: ["#FF0000", "#FF34B3", "#FF7256", "#FF8C69", "#FFAEB9", "#FFD39B"],
    // },
    series: [
      {
        type: "map",
        roam: false,
        mapType: "china",
        label: {
          show: false,
          // textStyle: {
          color: "#ffffff",
          // },
          // show: false,
        },

        itemStyle: {
          borderColor: "rgb(147, 235, 248)",
          borderWidth: 1,
          areaColor: {
            type: "radial",
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [
              {
                offset: 0,
                color: "#409EFF", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#409EFF", // 100% 处的颜色
              },
            ],
            globalCoord: true, // 缺省为 false
          },

          // emphasis: {
          show: false,

          // },
        },
        zoom: 1.1,
        //     roam: false,
        map: "china", //使用
        // data: this.difficultData //热力图数据   不同区域 不同的底色
      },
      {
        // type: "effectScatter",
        type: "scatter",
        coordinateSystem: "geo",
        showEffectOn: "render",
        zlevel: 1,
        rippleEffect: {
          period: 15,
          scale: 4,
          brushType: "fill",
        },
        // hoverAnimation: true,
        label: {
          formatter: "{b}",
          position: "right",
          offset: [-1, 0],
          color: "#000000",
          show: true,
        },
        itemStyle: {
          color: "#FF0000" /* function (value){ //随机颜色
 return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
 }*/,
          shadowBlur: 10,
          shadowColor: "#333",
        },
        symbolSize: 12,
        data: points,
      }, //地图线的动画效果
    ],
  };
  myChart.setOption(option, true);
  myChart.resize();
};
</script>

<style scoped>
el-card {
  display: flex;
  flex-direction: column;
}

.transportMonitoringMap {
  width: 100%;
  height: 100%;
}
</style>
