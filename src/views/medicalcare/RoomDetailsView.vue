<!-- dialog写在medicalcare文件夹下 -->
<!-- 医生查房记录详情 -->
<template>
  <div>
    <el-card>
      <div class="user_content">
        <!-- 头像 -->
        <el-image
          style="width: 80px; height: 80px"
          :src="upload + form.photo"
        />
        <el-form
          label-width="120px"
          label-position="left"
          style="max-width: 800px; margin-left: 30px"
        >
          <div class="box">
            <div>
              <el-form-item label="老人：">{{ olddata?.name }} </el-form-item>
              <el-form-item label="身份证号："
                >{{ olddata?.idCard }}
              </el-form-item>
              <el-form-item label="床位">{{ form?.begName }}</el-form-item>
            </div>
            <div>
              <el-form-item label="记录人">{{
                form?.addAccountName
              }}</el-form-item>
              <el-form-item label="记录时间">{{ form?.addTime }}</el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </el-card>
    <el-card style="margin-top: 15px">
      <el-form
        label-position="left"
        label-width="auto"
        style="max-width: 600px"
      >
        <el-form-item label="查房记录内容" />
        <el-form-item label="| 基本情况" />
        <el-form-item label="精神"> {{ form.spirit }} </el-form-item>
        <el-form-item label="饮食"> {{ form.diet }} </el-form-item>
        <el-form-item label="睡眠"> {{ form.sleep }} </el-form-item>
        <el-form-item label="大便"> {{ form.shit }} </el-form-item>
        <el-form-item label="小便"> {{ form.urinate }} </el-form-item>
        <el-form-item label="交流"> {{ form.communicate }} </el-form-item>
        <el-form-item label="记忆"> {{ form.memory }} </el-form-item>
        <el-form-item label="| 生命特征" />
        <el-form-item label="体温"> {{ form.temperature }} </el-form-item>
        <el-form-item label="脉搏"> {{ form.pulse }} </el-form-item>
        <el-form-item label="呼吸"> {{ form.breathe }} </el-form-item>
        <el-form-item label="血压"> {{ form.blood }} </el-form-item>
        <el-form-item label="| 医生建议" />
        <el-form-item :label="form.suggest" />
      </el-form>
      <div style="margin-top: 20px; text-align: center">
        <el-button @click="back">返回</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { CheckRoomGet } from "@/service/medicalcare/MedicalcareApi";
import { getElderly } from "@/service/old/OldApi";
const upload = import.meta.env.VITE_BASE_URL;
const router = useRouter();
const route = useRoute();
const url = ref(
  "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
);
const form = ref<any>({});
const olddata = ref<any>({});
// 获取单条查房记录
const getinfo = async () => {
  let id = route.params?.id;
  let res: any = await CheckRoomGet(Number(id));
  console.log("单条查房记录", res);

  if (res?.code === 10000) {
    form.value = res?.data;
    getoldinfo(res?.data.elderlyId);
  }
};
// 获取单条老人列表
const getoldinfo = async (id: number) => {
  let res: any = await getElderly(id);
  console.log("单条老人列表", res);
  if (res?.code === 10000) {
    olddata.value = res.data;
  }
};
// 返回
const back = () => {
  router.push({
    path: "/medicalcare/check-room",
  });
};
onMounted(() => {
  getinfo();
});
</script>
<style lang="less" scoped>
.el-input {
  height: 40px;
}

.el-button {
  height: 40px;
  line-height: 40px;
}

.user_content {
  width: 100%;
  display: flex;
}

.box {
  display: flex;

  div:nth-child(1) {
    margin-right: 100px;
  }
}
</style>
