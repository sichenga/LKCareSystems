<template>
  <!-- 床位更换申请审批 -->
  <el-card style="max-width: 100%">
    <div class="title">
      <span><span style="color: #00b1ff">▋</span>老人信息</span>
      <span style="font-size: 18px; color: #ccc">待审批</span>
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
            style="width: 67%"
          >
            <el-form-item label="头像：">
              <el-avatar :size="20" :src="upload + circleUrl" />
            </el-form-item>
            <el-form-item label="身份证号：">
              {{ oldData.idCard }}
            </el-form-item>
            <el-form-item label="房间号：">
              {{ states.houseName }}
            </el-form-item>
            <el-form-item label="姓名：" class="gray">
              {{ oldData.name }}
            </el-form-item>
            <el-form-item label="联系电话：">
              {{ oldData.mobile }}
            </el-form-item>
            <el-form-item label="床位号："> {{ states.begName }} </el-form-item>
            <el-form-item label="性别：" class="gray">
              {{ oldData.gender ? "男" : "女" }}
            </el-form-item>

            <el-form-item label="家庭地址：">
              {{ states.buildingName }}
            </el-form-item>
          </el-form>
        </div>
      </el-form-item>
      <el-form-item style="margin-top: 80px" label="陪同人类型：">
        {{ states.relation }}
      </el-form-item>
      <el-form-item label="陪同人姓名：">{{ states.name }}</el-form-item>
      <el-form-item label="陪同人电话："> {{ states.mobile }} </el-form-item>
      <el-form-item label="陪同人地址：">{{ states.address }}</el-form-item>
      <el-form-item label="外出时间："> {{ states.startTime }} </el-form-item>
      <el-form-item label="计划返回时间：">{{ states.endTime }}</el-form-item>
      <el-form-item label="外出原因："> {{ states.content }} </el-form-item>
    </el-form>
    <div class="title top">
      <span><span style="color: #00b1ff">▋</span>日志</span>
    </div>

    <el-steps direction="vertical" class="stp">
      <el-step>
        <template #icon>
          <el-avatar :size="24" :src="upload + circleUrl" />
        </template>
        <template #description>
          <div>{{ states.startTime }}</div>
          <div style="margin-top: 12px">
            {{ states.elderlyName }} 登记了外出
          </div>
          <div style="margin-top: 12px; font-size: 18px">
            老人的状况不错，可以外出！
          </div>
          <div style="margin-top: 12px">
            <el-image
              style="width: 80px; height: 80px; margin: 20px 20px 0 0"
              :src="upload + states.elderlyPhoto"
              fit="cover"
            />
          </div>
        </template>
      </el-step>
      <el-step class="s" />
      <div class="box"></div>
    </el-steps>
    <el-button
      style="display: block; margin: 0 auto"
      @click="router.push('/care/goout')"
      >返回</el-button
    >
  </el-card>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { goOutList } from "@/service/care/gooutApi";
import { getElderly } from "@/service/old/OldApi";
import { useRoute, useRouter } from "vue-router";
const upload = import.meta.env.VITE_BASE_URL + "/";
const route = useRoute();
const router = useRouter();
const form = reactive({});
const circleUrl = ref("");

const states = ref<any>([]);
//获取单挑外出记录
const DataOutList = async () => {
  let id = Number(route.query.id);
  let res: any = await goOutList(id);
  console.log(res);
  if (res?.code == 10000) {
    states.value = res.data;
    circleUrl.value = res.data.elderlyPhoto;
  }
};
//获取老人
const oldData = ref<any>([]);
const oldList = async () => {
  let res: any = await getElderly(states.value.elderlyId);
  console.log("老人", res);
  if (res?.code == 10000) {
    oldData.value = res.data;
  }
};
onMounted(async () => {
  await DataOutList(); //获取单挑外出记录
  await oldList(); //老人信息
});
</script>
<style lang="less" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.oldinfo {
  width: 100%;
  // height: 150px;
  border: 1px solid #ccc;
  padding: 20px;
}

.demo-form-inline {
  .el-form-item {
    width: 30%;
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

.s {
  display: none;
}

.box {
  height: 180px;
}
</style>
