<template>
  <!--新增老人  -->
  <div>
    <el-tabs v-model="activeName" type="card" class="demo-tabs">
      <el-card>
        <!--        {{ ruleForm }}-->
        <el-tab-pane label="基本信息" name="first">
          <OldMessage ref="RefOldMessage" />
        </el-tab-pane>
        <el-tab-pane label="健康信息" name="second">
          <OldHealth />
        </el-tab-pane>
        <el-tab-pane label="家属信息" name="third">
          <OldRelation />
        </el-tab-pane>
        <div class="submit">
          <el-button size="large" @click="router.push('/market/elderly')"
            >取消</el-button
          >
          <el-button size="large" type="primary" @click="add"> 保存 </el-button>
        </div>
      </el-card>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, defineAsyncComponent, provide, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
const OldMessage = defineAsyncComponent(
  () => import("@/components/addold/OldMessage.vue")
);
const OldRelation = defineAsyncComponent(
  () => import("@/components/addold/OldRelation.vue")
);
const OldHealth = defineAsyncComponent(
  () => import("@/components/addold/OldHealth.vue")
);
import { addElderly, getElderly, updateElderly } from "@/service/old/OldApi";
import type { AddElderlyRequest } from "@/service/old/OldType";
const route = useRoute();
const router = useRouter();
const activeName = ref("first");
const RefOldMessage = ref();
const ruleForm = reactive<AddElderlyRequest>({
  name: "",
  mobile: "",
  photo: "",
  gender: 1,
  birthday: "",
  nativePlace: "",
  nation: "",
  idCard: "",
  politics: "",
  socialCard: "",
  marriage: null,
  eduLevel: null,
  education: null,
  resident: null,
  address: null,
  begId: undefined,
  state: undefined,
  health: {
    oldillness: [],
    nowillness: [],
    otherillness: "",
    otherCase: "",
  },
  selfCares: [],
  checkups: [],
  family: [],
});

// 隔代传值
provide("ruleForm", ruleForm);
// 增加
const add = async () => {
  // 验证老人信息数据
  let valid = await RefOldMessage.value?.submitForm();
  console.log(valid);
  if (valid) {
    // let obj: any = {}
    // obj.health = {
    //   ...ruleForm.health,
    //   oldillness: ruleForm.health.oldillness.join(',') || '',
    //   nowillness: ruleForm.health.nowillness.join(',') || ''
    // }
    // obj.selfCares = ruleForm.selfCares.filter((item: any) => item !== null)
    let obj = {
      ...ruleForm,
      health: {
        ...ruleForm.health,
        oldillness: ruleForm.health.oldillness.join(",") || "",
        nowillness: ruleForm.health.nowillness.join(",") || "",
      },
      selfCares: ruleForm.selfCares.filter((item: any) => item !== null),
    };
    let res: any;
    if (!ruleForm.id) {
      res = await addElderly(obj);
    } else {
      res = await updateElderly(obj);
    }
    console.log("增加老人", res);
    if (res?.code === 10000) {
      ElMessage.success(ruleForm.id ? "编辑成功" : "新增成功");
      await router.push("/market/elderly");
    }
  } else {
    ElMessage.error("请完善基本信息");
  }
};
// 数据回显
const getedit = async () => {
  let id = route.params?.id;
  if (id) {
    let res: any = await getElderly(Number(id));
    console.log("编辑", res);
    if (res?.code === 10000) {
      Object.assign(ruleForm, res.data);
      ruleForm.health.oldillness = ruleForm.health.oldillness.split(",");
      ruleForm.health.nowillness = ruleForm.health.nowillness.split(",");
      ruleForm.selfCares = ruleForm.selfCares.filter(
        (item: any) => item !== null
      );
      console.log(ruleForm);
    }
  }
};
onMounted(() => {
  getedit();
});
</script>
<style lang="less" scoped>
.submit {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
