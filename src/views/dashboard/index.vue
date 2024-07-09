<template>
  <div class="dashboard-container">
    <!-- github角标 -->
    <!-- <github-corner class="github-corner" /> -->

    <el-card shadow="never">
      <el-row justify="space-between">
        <el-col :span="18" :xs="24">
          <div class="flex h-full items-center">
            <img
              :src="
                userStore.user.model.photo
                  ? baseurl + '/' + userStore.user.model.photo
                  : defImg
              "
              alt=""
              class="w-20 h-20 mr-5 rounded-full"
            />
            <div>
              <p>{{ greetings }}</p>
              <p class="text-sm text-gray">
                {{ tx }}
              </p>
            </div>
          </div>
        </el-col>

        <el-col :span="6" :xs="24">
          <div class="flex h-full items-center justify-around">
            <el-statistic
              v-for="item in statisticData"
              :key="item.key"
              :value="item.value"
            >
              <template #title>
                <div class="flex items-center">
                  <svg-icon :icon-class="item.iconClass" size="20px" />
                  <span class="text-[16px] ml-1">{{ item.title }}</span>
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 数据卡片 -->
    <!-- <el-row :gutter="10" class="mt-3">
      <el-col
        v-for="(item, index) in cardData"
        :key="index"
        :lg="6"
        :sm="12"
        :xs="24"
      >
        <el-card shadow="never">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-[var(--el-text-color-secondary)]">{{
                item.title
              }}</span>
              <el-tag :type="item.tagType">
                {{ item.tagText }}
              </el-tag>
            </div>
          </template>

          <div class="flex items-center justify-between mt-5">
            <div class="text-lg text-right">
              {{ Math.round(item.count) }}
            </div>
            <svg-icon :icon-class="item.iconClass" size="2em" />
          </div>

          <div
            class="flex items-center justify-between mt-5 text-sm text-[var(--el-text-color-secondary)]"
          >
            <span> {{ item.dataDesc }} </span>
            <span> {{ Math.round(item.count * 15) }} </span>
          </div>
        </el-card>
      </el-col>
    </el-row> -->

    <!-- Echarts 图表 -->
    <el-row :gutter="10" class="mt-3">
      <el-col
        v-for="item in chartData"
        :key="item"
        :lg="12"
        :sm="12"
        :xs="24"
        class="mb-2"
      >
        <component
          :is="chartComponent(item)"
          :id="item"
          class="bg-[var(--el-bg-color-overlay)]"
          height="400px"
          width="100%"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import type { EpPropMergeType } from "element-plus/es/utils/vue/props/types";
import { useUserStore } from "@/store/modules/user";
import { computed, ref } from "vue";
import moment from "moment";
// import { TransitionPresets, useTransition } from "@vueuse/core";
import defImg from "@/assets/images/lening.png";
import { getCountList } from "@/service/dashboard/dashboardApi";
defineOptions({
  name: "Dashboard",
  inheritAttrs: false,
});

const userStore = useUserStore();
const date: Date = new Date();

const greetings = computed(() => {
  const hours = date.getHours();
  if (hours >= 6 && hours < 8) {
    return "晨起披衣出草堂，轩窗已自喜微凉🌅！";
  } else if (hours >= 8 && hours < 12) {
    return "上午好，" + userStore.user.model.username + "！";
  } else if (hours >= 12 && hours < 18) {
    return "下午好，" + userStore.user.model.username + "！";
  } else if (hours >= 18 && hours < 24) {
    return "晚上好，" + userStore.user.model.username + "！";
  } else {
    return "偷偷向银河要了一把碎星，只等你闭上眼睛撒入你的梦中，晚安🌛！";
  }
});

let hour: number = parseInt(moment().format("HH"));
let week: number = moment().day();
const tx = ref<string>("");

if (week == 0 || week == 6) {
  if (hour < 6) {
    tx.value = "太晚了，该休息了!!!";
  } else if (hour < 18) {
    tx.value = "周末出行，别忘记带上放松的心情";
  } else if (hour < 22) {
    tx.value = "晚上好!祝你玩的愉快!";
  } else if (hour < 24) {
    tx.value = "夜深了! 要注意身体呀! 祝你做个好梦!";
  }
} else {
  if (hour < 6) {
    tx.value = "太晚了，该休息了!!!";
  } else if (hour < 8) {
    tx.value = "早上好!全新的一天开始了!";
  } else if (hour < 12) {
    tx.value = "上午好!工作辛苦了!";
  } else if (hour < 14) {
    tx.value = "中午好!还在上网吗?";
  } else if (hour < 18) {
    tx.value = "下午好!祝你工作顺利!";
  } else if (hour < 22) {
    tx.value = "晚上好!祝你玩的愉快!";
  } else if (hour < 24) {
    tx.value = "夜深了! 要注意身体呀! 祝你做个好梦!";
  }
}

// const duration = 5000;
// 图片根路径
const baseurl = import.meta.env.VITE_BASE_URL;
// 销售额
// const amount = ref(0);
// const amountOutput = useTransition(amount, {
//   duration: duration,
//   transition: TransitionPresets.easeOutExpo,
// });
// amount.value = 2000;

// // 访客数
// const visitCount = ref(0);
// const visitCountOutput = useTransition(visitCount, {
//   duration: duration,
//   transition: TransitionPresets.easeOutExpo,
// });
// visitCount.value = 2000;

// // IP数
// const dauCount = ref(0);
// const dauCountOutput = useTransition(dauCount, {
//   duration: duration,
//   transition: TransitionPresets.easeOutExpo,
// });
// dauCount.value = 2000;

// // 订单量
// const orderCount = ref(0);
// const orderCountOutput = useTransition(orderCount, {
//   duration: duration,
// transition: TransitionPresets.easeOutExpo,
// });
// orderCount.value = 2000;

// 右上角数量
const statisticData = ref([
  {
    value: 99,
    iconClass: "message",
    title: "机构数",
    key: "message",
  },
  {
    value: 50,
    iconClass: "todolist",
    title: "床位数",
    suffix: "/100",
    key: "upcoming",
  },
  {
    value: 10,
    iconClass: "project",
    title: "老人数",
    key: "project",
  },
]);
// 获取右上角数量统计
const getcountlist = async () => {
  const res: any = await getCountList();
  if (res?.code === 10000) {
    // statisticData.value = res.data;
    statisticData.value[0].value = res.data.companyCounts;
    statisticData.value[1].value = res.data.bedCounts;
    statisticData.value[2].value = res.data.elderlyCounts;
  }
};
onMounted(() => {
  getcountlist();
});
interface CardProp {
  title: string;
  tagType: EpPropMergeType<
    StringConstructor,
    "primary" | "success" | "info" | "warning" | "danger",
    unknown
  >;
  tagText: string;
  count: any;
  dataDesc: string;
  iconClass: string;
}

// // 卡片数量
// const cardData = ref<CardProp[]>([
//   {
//     title: "访客数",
//     tagType: "success",
//     tagText: "日",
//     count: visitCountOutput,
//     dataDesc: "总访客数",
//     iconClass: "visit",
//   },
//   {
//     title: "IP数",
//     tagType: "success",
//     tagText: "日",
//     count: dauCountOutput,
//     dataDesc: "总IP数",
//     iconClass: "ip",
//   },
//   {
//     title: "销售额",
//     tagType: "primary",
//     tagText: "月",
//     count: amountOutput,
//     dataDesc: "总IP数",
//     iconClass: "money",
//   },
//   {
//     title: "订单量",
//     tagType: "danger",
//     tagText: "季",
//     count: orderCountOutput,
//     dataDesc: "总订单量",
//     iconClass: "order",
//   },
// ]);
// 图表数据
const chartData = ref(
  !userStore.user.model.companyId
    ? ["ChinaChart", "BarChart"]
    : ["MarketChart", "PieChart"]
);
const chartComponent = (item: string) => {
  return defineAsyncComponent(() => import(`./components/${item}.vue`));
};
</script>

<style lang="scss" scoped>
.el-form-item {
  align-content: center !important;
}

.dashboard-container {
  position: relative;
  padding: 24px;

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .github-corner {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    border: 0;
  }

  .data-box {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    font-weight: bold;
    color: var(--el-text-color-regular);
    background: var(--el-bg-color-overlay);
    border-color: var(--el-border-color);
    box-shadow: var(--el-box-shadow-dark);
  }

  .svg-icon {
    fill: currentcolor !important;
  }
}
</style>
