<template>
  <!-- 任务详情 -->
  <el-card>
    <el-form
      label-width="100px"
      label-position="left"
      style="max-width: 600px"
      class="task-info"
    >
      <el-form-item label="任务名称:"> 晨起 </el-form-item>
      <el-form-item label="任务状态:"> 进行中 </el-form-item>
      <el-form-item label="负责人:"> 张敏 </el-form-item>
      <el-form-item label="任务描述:"> 需要按照规定给老人洗澡111 </el-form-item>
      <el-form-item label="任务时间:"> 8：00-8：30 </el-form-item>
    </el-form>
  </el-card>
  <!-- 老人信息 -->
  <el-card>
    <div class="title">老人信息</div>
    <div class="text">
      <el-avatar :size="70" :src="circleUrl" />
      <el-form
        label-width="100px"
        label-position="left"
        style="max-width: 600px; margin-left: 50px"
      >
        <el-form-item label="姓名:"> 张国锋 </el-form-item>
        <el-form-item label="房间/床位:"> 501/501-01 </el-form-item>
        <el-form-item label="联系电话:"> 17728838393 </el-form-item>
      </el-form>
    </div>
  </el-card>
  <!-- 子任务 -->
  <el-card>
    <div class="title">
      子任务（{{ checkedCities.length }}/{{ cities.length }}）
    </div>
    <el-checkbox-group v-model="checkedCities">
      <el-checkbox
        v-for="city in cities"
        :key="city"
        :label="city"
        :value="city"
      >
        {{ city }}
      </el-checkbox>
    </el-checkbox-group>
  </el-card>
  <!-- 老人信息 -->
  <el-card>
    <div class="title">老人信息</div>
    <el-steps direction="vertical" space="80px" style="margin-top: 20px">
      <el-step>
        <template #description>
          <div>10-20 15:00</div>
          <div>系统创建并分配了晨起的任务给您</div>
        </template>
      </el-step>
    </el-steps>
  </el-card>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const circleUrl = ref(
  "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
);
const checkedCities = ref([]);
const cities = ref(["辅助起床", "辅助洗漱", "辅助如厕", "辅助穿衣"]);
</script>
<style lang="less" scoped>
.el-card {
  width: 100%;
  margin-bottom: 20px;
}
.task-info {
}

.title {
  width: 100%;
  font-size: 16px;
}
.text {
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.el-form-item {
  margin-bottom: 0;
}
</style>
