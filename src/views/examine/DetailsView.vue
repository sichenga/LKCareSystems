<template>
  <!-- 床位更换申请审批 /  详情 -->
  <el-card style="max-width: 100%">
    <div class="title">
      <span><span style="color: #00b1ff">▋</span>老人信息</span>
      <span style=" font-size: 18px;color: #ccc">待审批</span>
    </div>
    <el-form
      :model="form"
      label-position="left"
      label-width="130px"
      style="max-width: 100%; margin-top: 30px"
    >
      <el-form-item label="*老人信息" style="align-items: flex-start">
        <div class="oldinfo">
          <el-form
            :inline="true"
            label-position="left"
            label-width="auto"
            class="demo-form-inline"
            style="width: 60%"
          >
            <div class="box">
              <div class="r1">
                <el-form-item label="头像：">
                  <el-avatar :size="20" :src="circleUrl" />
                </el-form-item>
                <el-form-item label="姓名：" class="gray"> 张武 </el-form-item>
                <el-form-item label="性别：" class="gray"> 男 </el-form-item>
              </div>
              <div class="r2">
                <el-form-item label="身份证号："> 293923019912 </el-form-item>
                <el-form-item label="联系电话："> 1882783923 </el-form-item>
                <el-form-item label="家庭地址：">
                  上海市普陀区1000号
                </el-form-item>
              </div>
              <div class="r3">
                <el-form-item label="房间号："> 1楼501室 </el-form-item>
                <el-form-item label="床位号："> 501-1 </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </el-form-item>
      <el-form-item label="*更换床位为"> 605-02 </el-form-item>
      <el-form-item label="*更换原因">
        605-02室友睡觉打呼噜，严重影响睡眠质量，需要更换房间！
      </el-form-item>
    </el-form>
    <div class="title top">
      <span><span style="color: #00b1ff">▋</span>审批流</span>
    </div>
    <el-steps class="mb-4 steps" style="margin-top: 30px" :space="200" simple>
      <el-step title="张晓雅">
        <template #icon>
          <el-avatar :size="30" :src="circleUrl" />
        </template>
      </el-step>
      <el-step title="李梅">
        <template #icon>
          <el-avatar :size="30" :src="circleUrl" />
        </template>
      </el-step>
      <el-step title="汪峰" :icon="Picture">
        <template #icon>
          <el-avatar :size="30" :src="circleUrl" />
        </template>
      </el-step>
    </el-steps>
    <div class="title top">
      <span><span style="color: #00b1ff">▋</span>日志</span>
    </div>

    <el-steps direction="vertical" class="stp">
      <el-step>
        <template #icon>
          <el-avatar :size="24" :src="circleUrl" />
        </template>
        <template #description>
          <div>20200303</div>
          <div>张三 提交了床位更换申请</div>
        </template>
      </el-step>
      <el-step title="Step 2" />
      <el-step title="Step 3" />
    </el-steps>
    <el-form-item class="btn">
      <el-button type="primary" @click="isdialog = true">审批通过</el-button>
      <DetailsDialog @close="close" v-if="isdialog" />
      <el-button @click="refuse = true">审批拒绝</el-button>
      <RefuseDialog @close="closes" v-if="isdialog" />
      <el-button>返回</el-button>
    </el-form-item>
  </el-card>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { Picture } from "@element-plus/icons-vue";
import DetailsDialog from "@/components/dialog/DetailsDialog.vue";
import RefuseDialog from "@/components/dialog/examine/RefuseDialog.vue";
const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});
const circleUrl = ref(
  "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
);

//审批通过
const isdialog = ref(false);
const close = () => {
  isdialog.value = false;
};
//审批拒绝
const refuse = ref(false);
const closes = () => {
  refuse.value = false;
};
</script>
<style lang="less" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.oldinfo {
  width: 100%;

  border: 1px solid #ccc;
  padding: 20px;
}

.demo-form-inline {
  .el-form-item {
  }
}

.gray {
  color: #ccc;
}

.top {
  margin-top: 100px;
}

.steps {
  padding: 0 !important;
  max-width: 100% !important;
}

.stp {
  margin-top: 30px;
}

.btn {
  width: 300px;
  height: 80px;
  margin: 0 auto;
}

.box {
  display: flex;
}
</style>
