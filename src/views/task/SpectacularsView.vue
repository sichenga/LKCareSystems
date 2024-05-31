<template>
  <el-card>
    <!-- 任务看板 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="负责人">
        <el-input
          v-model="formInline.user"
          placeholder="请输入执行人姓名"
          clearable
        />
      </el-form-item>
      <el-form-item label="任务状态">
        <el-select
          v-model="formInline.region"
          placeholder="请选择"
          style="width: 240px"
        >
          <el-option
            v-for="item in statelist"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin-top: 10px">
    <!-- 选项 -->
    <div class="taskoption">
      <div
        :class="{ item: true, select: istask === index }"
        v-for="(item, index) in tasklist"
        :key="index"
        @click="change(index)"
      >
        <span
          >{{ item.name }}
          <span style="margin-left: 5px">({{ item.num }})</span></span
        >
      </div>
      <!-- 展示 -->
    </div>
    <div class="tasklist">
      <el-card
        class="itemtask"
        v-for="(item, index) in data.teskdata"
        :key="index"
        @click="taskinfo"
      >
        <div class="title">
          <span>{{ item.name }}</span>
          <el-avatar :size="35" :src="circleUrl" />
        </div>
        <span
          class="state"
          :style="item.state === 2 ? 'color:#78f7f9' : 'color:red'"
          >{{ item.statename }}</span
        >
        <span class="time">截至日期：2020-02-02：16：00</span>
      </el-card>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import Teskboard from "@/database/Teskboard.json";
import { useRouter } from "vue-router";
const router = useRouter();
const formInline = reactive({
  user: "",
  region: "",
  date: "",
});
const circleUrl = ref("https://s21.ax1x.com/2024/05/08/pkVm8qH.jpg");
const istask = ref(0);
const statelist = ref([
  { label: "未开始", value: "0" },
  { label: "进行中", value: "1" },
  { label: "已完成", value: "2" },
]);
const tasklist = [
  {
    name: "全部",
    num: 100,
  },
  {
    name: "进行中",
    num: 80,
  },
  {
    name: "已完成",
    num: 10,
  },
  {
    name: "逾期未完成",
    num: 10,
  },
];
const data = reactive({
  teskdata: [] as any,
});
// 选择标签
const change = (index: number) => {
  istask.value = index;
};
// 数据
const tesklist = () => {
  setTimeout(() => {
    data.teskdata = Teskboard;
    console.log(data.teskdata);
  }, 500);
};
// 跳转详情
const taskinfo = () => {
  router.push("/task/details/1");
};
onMounted(() => {
  tesklist();
});
</script>
<style lang="less" scoped>
.taskoption {
  width: 100%;
  height: 50px;
  display: flex;

  .item {
    width: 125px;
    height: 100%;
    padding-left: 10px;
    padding-right: 10px;
    // background-color: aqua;
    border-radius: 0 10px 0 0;
    border: 1px solid #ccc;
    line-height: 50px;
    text-align: center;
    font-size: 12px;
    // 变小手
    cursor: pointer;
  }
}

.tasklist {
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;

  .itemtask {
    width: 340px;
    height: 170px;
    margin-right: 15px;
    margin-bottom: 15px;
    background-color: #ececec;
    // 变小手
    cursor: pointer;
    padding-bottom: 15px;

    :deep(.el-card__body) {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
    }

    .state {
      font-size: 14px;
    }

    .time {
      font-size: 12px;
      color: #ccc;
    }
  }
}

// 选择
.select {
  color: #70c3ff;
}
</style>
