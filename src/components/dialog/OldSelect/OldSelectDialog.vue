<!-- 选择老人 -->
<template>
  <el-dialog
    v-model="dialogVisible"
    title="选择老人"
    width="680px"
    @close="close"
  >
    <el-form :inline="true" :model="states" class="demo-form-inline">
      <div class="form-size">
        <el-form-item label="姓名:">
          <el-input v-model="states.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="身份证号码:">
          <el-input v-model="states.idCard" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div class="table-container">
      <MayTable
        :identifier="identifier"
        :isMultiple="porps.isMultiple"
        :isoperate="isoperate"
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        autoWidth="100px"
        @serve-list-is="serveListIs"
      >
        <template #operate="{ data }">
          <el-button type="primary" @click="select(data.id)">选择</el-button>
        </template>
      </MayTable>
    </div>
    <!-- <div style="height: 30px"></div> -->
    <Pagination
      :page="states.page"
      :psize="states.pageSize"
      :total="total"
      @page="handlPage"
      @pszie="handlPsize"
      layout="total, prev, pager, next,sizes"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="add"> 确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  defineAsyncComponent,
  defineEmits,
  defineProps,
  onMounted,
  reactive,
  ref,
} from "vue";
import { getElderlyList } from "@/service/old/OldApi";
import { useRouter } from "vue-router";
import type { ListElderlyRequest } from "@/service/old/OldType";

const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);

const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);

const router = useRouter();
const dialogVisible = ref(true);

const porps = defineProps({
  toPath: {
    type: String,
    default: "",
  },
  isMultiple: {
    type: Boolean,
    default: false,
  },
  isoperate: {
    type: Boolean,
    default: true,
  },
});

//唯一标识
const identifier = "ToHospitalDialog";
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "photo",
      label: "头像",
      width: "100px",
    },
    {
      prop: "name",
      label: "姓名",
      width: "100px",
    },
    {
      prop: "gender",
      label: "性别",
    },
    {
      prop: "idCard",
      label: "身份证号",
      width: "200px",
    },
  ],
});

const emit = defineEmits(["close", "id", "serveList"]);

const close = (close: boolean = false) => {
  emit("close", close);
};
const states = reactive<ListElderlyRequest>({
  page: 1,
  pageSize: 5,
  begId: undefined,
  state: undefined,
  name: "", //老人姓名
  idCard: undefined, //身份证号
});
// 老人列表
const total = ref(0);
const getlist = async () => {
  let res: any = await getElderlyList(states).catch(() => {});
  if (res?.code == 10000) {
    total.value = res.data.counts;
    data.tableData = res.data.list;
  }
};
//分页
const handlPage = (val: any) => {
  states.page = val;
  getlist();
};
const handlPsize = (val: any) => {
  states.pageSize = val;
  getlist();
};
//选择老人
const select = (id: number) => {
  if (!porps.toPath) {
    close(false);
    emit("id", id);
  } else {
    router.push({
      path: porps.toPath,
      query: {
        oldId: id,
      },
    });
  }
};
//搜索
const search = () => {
  states.page = 1;
  getlist();
};
// 重置
const reset = () => {
  states.name = "";
  states.idCard = "";
  getlist();
};
// 勾选老人的值
let serve = ref([]);
const serveListIs = (val: any) => {
  console.log("勾选老人值", val);
  serve.value = val;
};
const add = () => {
  emit("serveList", serve.value);
  emit("close", false);
};
onMounted(() => {
  getlist(); //老人列表
});
</script>
<style lang="less" scoped>
.el-input {
  width: 140px;
}

.form-size {
  display: flex;
}
.table-container {
  margin-top: 30px;
}
</style>
