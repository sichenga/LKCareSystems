<template>
  <el-dialog
    v-model="dialogVisible"
    title="添加服务"
    width="500"
    @close="close"
  >
    <MayTable
      :isMultiple="true"
      :isoperate="false"
      :tableData="data.tableData"
      :tableItem="data.tableItem"
      @serve-list-is="serveLists"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="confirm"> 确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  defineAsyncComponent,
  defineEmits,
  onMounted,
  reactive,
  ref,
} from "vue";
import { ConfigNursingServiceList } from "@/service/config/ConfigApi";
import type { NursingServiceList } from "@/service/config/ConfigType";

const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const dialogVisible = ref(true);
const emit = defineEmits(["close", "serveList"]);
// 关闭弹框
const close = (close: boolean = false) => {
  emit("close", close);
};
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "name",
      label: "服务名称",
    },
    {
      prop: "content",
      label: "服务描述",
    },
  ],
});
// 护理列表
const params = reactive<NursingServiceList>({
  page: 1,
  pageSize: 5,
});
const getlist = async () => {
  let res: any = await ConfigNursingServiceList(params);
  if (res?.code === 10000) {
    data.tableData = res.data.list;
  }
};
//确定拿服务数据
const serveList = ref([]);
const confirm = () => {
  if (serveList.value.length) {
    emit("serveList", serveList.value);
    close(true);
  } else {
    close(false);
  }
};
const serveLists = (val: any) => {
  serveList.value = val;
};

onMounted(() => {
  getlist(); //护理列表
});
</script>
<style lang="less" scoped></style>
