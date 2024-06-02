<template>
  <!-- 用药计划设置 -->
  <div class="app-container">
    <el-card>
      <ProjectInfoDialog
        v-if="isdialog"
        :isinfo="isinfo"
        @close="close"
        :drugId="drugId"
      />
      <el-form label-width="auto">
        <el-form-item label="老人"> {{ data.oldinfo?.name }} </el-form-item>
        <el-form-item label="床位">{{ data.oldinfo?.begName }} </el-form-item>
        <el-form-item>
          <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
            <template #operate="{ data }">
              <el-button type="primary" text @click="getinfo(data.id)"
                >设置</el-button
              >
              <el-button type="primary" text @click="stop(data.id)"
                >停止用药</el-button
              >
            </template>
          </MayTable>
        </el-form-item>
      </el-form>
      <div class="button">
        <el-button @click="goback">返回</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
const ProjectInfoDialog = defineAsyncComponent(
  () => import("@/components/dialog/medicalcare/ProjectInfoDialog.vue")
);
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
import { getElderly } from "@/service/old/OldApi";
import type { ElderlyItem } from "@/service/old/OldType";
import { DrugsListForPlan } from "@/service/medicalcare/MedicalcareApi";

const isdialog = ref(false);
const isinfo = ref(true);
const route = useRoute();
const router = useRouter();
const id = route.query?.id;
const drugId = ref(0);
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "name",
      label: "药品名称",
    },
    {
      prop: "counts",
      label: "数量",
    },
    {
      prop: "expTime",
      label: "有效期",
    },
    {
      prop: "sum",
      label: "剂量",
    },
    {
      prop: "remarks",
      label: "服法",
    },
    {
      prop: "plans",
      label: "服药计划",
    },
    {
      prop: "startDate",
      label: "开始时间",
    },
    {
      prop: "endDate",
      label: "结束时间",
    },
  ],
  oldinfo: {} as ElderlyItem,
});
// 获取老人信息
const getOlderInfo = async () => {
  let res: any = await getElderly(Number(id));
  if (res?.code === 10000) {
    data.oldinfo = res.data;
  }
};
// 获取老人用药计划列表
const getlist = async () => {
  let res: any = await DrugsListForPlan(Number(id));
  console.log("用药计划", res);
  if (res?.code === 10000) {
    data.tableData = res.data.list;
  }
};
// 关闭弹窗
const close = (isclose: boolean) => {
  if (isclose === true) {
    getlist();
  }
  isdialog.value = false;
};
// 设置服药计划
const getinfo = (id: number) => {
  drugId.value = id;
  isdialog.value = true;
  isinfo.value = true;
};
// 停止用药
const stop = (id: number) => {
  drugId.value = id;
  isdialog.value = true;
  isinfo.value = false;
};
// 返回
const goback = () => {
  router.push("/medicalcare/medicinelogs");
};
onMounted(() => {
  getOlderInfo();
  getlist();
});
</script>
<style lang="less" scoped>
.button {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
