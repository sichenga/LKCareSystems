<template>
  <!-- //回访记录 -->
  <!-- dialog写在market文件夹下 -->
  <el-card style="margin-top: 15px" class="section">
    <div class="body">
      <div class="body-title">
        <div>咨询类型：{{ params.type }}</div>
        <div>咨询渠道：{{ params.source }}</div>
        <div>咨询人：{{ params.name }}</div>
        <div>联系方式： {{ params.mobile }}</div>
        <div>与老人关系： {{ params.relation }}</div>
      </div>
      <div class="body-title-size">
        <div>登记日期： {{ params.addTime }}</div>
        <div>登记人：{{ params.addAccountName }}</div>
        <div>计划回访日期：{{ params.visitTime }}</div>
        <div>回访状态：{{ params.stateName }}</div>
      </div>
    </div>
  </el-card>
  <el-card style="margin-top: 15px" class="section">
    <div class="title">
      <div><span>▋</span> 回访记录</div>
      <div>
        <el-button type="primary" @click="addVisit">新增回访</el-button>
      </div>
    </div>
    <el-timeline style="width: 500px; margin-top: 50px">
      <el-timeline-item
        v-for="(activity, index) in activities.list"
        :key="index"
        :timestamp="'计划回访日期：' + activity.timestamp"
      >
        <template #dot>
          <el-image :src="image + activity.addAccountPhoto" fit="cover" />
        </template>
        <template #default>
          <div @click="modification(activity)">
            {{ activity.addTime }}
            <div style="height: 15px"></div>
            <div style="color: #a8abb2">
              {{ "回访记录：" + activity.content }}
            </div>
          </div>
          <div class="button-size" @click="del(activity.id)">
            <el-button type="danger">删除</el-button>
          </div>
        </template>
      </el-timeline-item>
    </el-timeline>
  </el-card>
  <div class="title-btn">
    <el-button @click="returnold">返回</el-button>
  </div>
  <!-- 新增回访记录 -->
  <CallbackDlalog v-if="dialogVisible" @close="handlClose" :datas="datas" />
</template>
<script lang="ts" setup>
import { onMounted, reactive, defineAsyncComponent, ref } from "vue";
import {
  getquestionlist,
  followupList,
  followupdelete,
} from "@/service/market/marketApi";
import type { followup } from "@/service/market/marketType";
import { getMessageBox } from "@/utils/utils";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
const route = useRoute();
const router = useRouter();
const CallbackDlalog = defineAsyncComponent(
  () => import("@/components/dialog/market/CallbackDlalog.vue")
);
const image = import.meta.env.VITE_BASE_URL + "/";
//获取单挑咨询
const params = reactive<any>({});
const getlist = async () => {
  let id = Number(route.query.id);
  let res: any = await getquestionlist(id);
  if (res?.code == 10000) {
    Object.assign(params, res.data);
  }
};

const states = reactive<followup>({
  page: 1,
  pageSize: 10,
  questionId: Number(route.query.id),
});

//回访记录字段
const activities = reactive<any>({
  list: [],
});
// 获取回访记录列表
const questionlist = async () => {
  let res: any = await followupList(states);
  if (res?.code == 10000) {
    activities.list = res.data.list.map((item: any) => ({
      id: item.id,
      content: item.content,
      timestamp: item.callbackTime,
      addAccountPhoto: item.addAccountPhoto,
      addTime: item.addTime,
    }));
  }
};

//添加回访记录
const dialogVisible = ref(false);
const addVisit = () => {
  dialogVisible.value = true;
  datas.value = 0;
};
// 修改
const datas = ref<any>([]);
const modification = (data: any) => {
  datas.value = data;
  dialogVisible.value = true;
};
const handlClose = async (val: any) => {
  dialogVisible.value = val;
  if (val) {
    dialogVisible.value = false;
    questionlist(); //咨询回访记录列表
  }
};
// 删除咨询记录
const del = async (id: number) => {
  let res = await getMessageBox("是否删除潜在客户？", "删除后将不可恢复");
  if (res) {
    const res: any = await followupdelete(id);
    console.log("删除", res);
    if (res.code == 10000) {
      questionlist(); //咨询回访记录列表
      ElMessage.success("删除成功");
    } else {
      ElMessage.error(res.msg);
    }
  } else {
    ElMessage.info("取消删除");
  }
};
onMounted(() => {
  getlist(); //获取单挑咨询
  questionlist(); //咨询回访记录列表
});

const returnold = () => {
  router.push("/market/question");
};
</script>
<style lang="less" scoped>
.section {
  width: 100%;
  background-color: #fff;
}

.body {
  display: flex;

  .body-title {
    div {
      margin-top: 10px;
    }
  }

  .body-title-size {
    margin-left: 120px;

    div {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
}

.title {
  margin: 30px;
  display: flex;
  justify-content: space-between;

  span {
    color: #409eff;
  }
}

.title-btn {
  margin: 40px 720px;

  .el-button {
    width: 100px;
    height: 40px;
  }
}

.button {
  width: 92px;
  height: 40px;
}

:deep(.el-image) {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-right: 100px;
}
.button-size {
  position: absolute;
  // margin-left: 100px;
  right: 0;
  top: 25px;
}
</style>
