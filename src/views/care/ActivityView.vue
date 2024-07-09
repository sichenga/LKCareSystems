<template>
  <!-- 院内活动 -->
  <div class="app-container">
    <el-card>
      <ActDialog v-if="isdialog" :id="infoId" @close="close" />
      <el-form :inline="true" :model="params" class="demo-form-inline">
        <el-form-item label="分类" style="width: 250px">
          <el-select v-model="params.type" clearable placeholder="请选择">
            <el-option
              v-for="item in TypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="老人姓名：">
          <el-input v-model="params.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input v-model="params.key" clearable placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="上报时间：">
          <MayDateTimePicker
            :endtime="params.endDate"
            :statetime="params.beginDate"
            @change="handChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" :icon="Search"
            >查询</el-button
          >
          <el-button @click="delde" :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <ActivityDialog v-if="dialogVisible" :id="ids" @close="handClose" />
    <el-card style="margin-top: 15px">
      <el-button
        style="margin-top: 10px; margin-bottom: 10px"
        type="success"
        :icon="Plus"
        @click="add"
        >添加老人活动</el-button
      >
      <el-button
        type="danger"
        :icon="Delete"
        :disabled="!idsA.length"
        @click="handleDeleteAll()"
        >批量删除</el-button
      >
      <!-- 表格 -->
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        autoWidth="340px"
        :isMultiple="true"
        @serve-list-is="serveListIs"
      >
        <template #operate="{ data }">
          <el-button
            text
            type="primary"
            @click="getinfo(data.id)"
            :icon="Tickets"
            >查看详情</el-button
          >
          <el-button text type="primary" @click="compile(data.id)" :icon="Edit"
            >编辑</el-button
          >
          <el-button text type="danger" @click="del(data.id)" :icon="Delete"
            >删除</el-button
          >
        </template>
      </MayTable>
      <Pagination
        :page="params.page"
        :psize="params.pageSize"
        :total="counts"
        @page="handPage"
        @psize="handPsize"
      />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import {
  getDeleteList,
  getPlayList,
  getPlayTypeList,
  getDeleteListAll,
} from "@/service/care/gooutApi";
import type { playList } from "@/service/care/gooutType";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import {
  Delete,
  Edit,
  Plus,
  Refresh,
  Search,
  Tickets,
} from "@element-plus/icons-vue";
const ActivityDialog = defineAsyncComponent(
  () => import("@/components/dialog/care/ActivityDialog.vue")
);
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const MayDateTimePicker = defineAsyncComponent(
  () => import("@/components/timepicker/MayDateTimePicker.vue")
);
const ActDialog = defineAsyncComponent(
  () => import("@/components/dialog/care/ActDialog.vue")
);

const isdialog = ref(false);
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "title",
      label: "标题",
    },
    {
      prop: "addTime",
      label: "上报时间",
    },
    {
      prop: "typeName",
      label: "分类",
    },
    {
      prop: "addAccountName",
      label: "上报人",
    },
    {
      prop: "elderly",
      label: "老人姓名",
    },
  ],
});

const params = reactive<playList>({
  page: 1,
  pageSize: 10,
  name: "", //老人姓名
  beginDate: "", //开始时间yyyy-MM-dd
  endDate: "", //结束时间yyyy-MM-dd
  type: undefined, //分类ID
  key: "", //关键子
});
//院内活动列表
const counts = ref(0);
const getlist = async () => {
  let res: any = await getPlayList(params).catch(() => {});
  console.log(res);

  if (res?.code == 10000) {
    data.tableData = res.data.list;
    counts.value = res.data.counts;
  }
};

// 批量删除
let idsA = ref<any>([]);
const serveListIs = (val: any) => {
  idsA.value = val.map((item: any) => item.id);
};
//批量删除
const handleDeleteAll = async () => {
  let res = await getMessageBox("是否确认删除该数据", "删除后将不可恢复");
  if (res) {
    const del: any = await getDeleteListAll(idsA.value);
    if (del?.code === 10000) {
      ElMessage.success("删除成功");
      getlist();
    }
  } else {
    ElMessage.info("取消删除");
  }
};

// 分页
const handPage = (val: any) => {
  params.page = val;
  getlist();
};
const handPsize = (val: any) => {
  params.pageSize = val;
  getlist();
};
// 时间
const handChange = (val: any) => {
  params.beginDate = val[0];
  params.endDate = val[1];
};
// 关闭弹窗
const close = () => {
  isdialog.value = false;
};
// 搜索
const search = () => {
  params.page = 1;
  getlist();
};

// 查看详情
const infoId = ref(0);
const getinfo = (id: number) => {
  infoId.value = id;
  isdialog.value = true;
};
//活动分类列表
const TypeList = ref<any>([]);
const getPlayType = async () => {
  let res: any = await getPlayTypeList().catch(() => {});
  if (res?.code == 10000) {
    TypeList.value = res.data.list;
  }
};

const ids = ref(0);

const dialogVisible = ref(false);
// 添加
const add = () => {
  ids.value = 0;
  dialogVisible.value = true;
};
// 编辑

const compile = (id: number) => {
  ids.value = id;
  dialogVisible.value = true;
};
const handClose = (val: any) => {
  dialogVisible.value = val;
  if (val == true) {
    dialogVisible.value = false;
    getlist(); //院内活动列表
  }
};
// 删除
const del = async (id: number) => {
  let res = await getMessageBox(
    "是否确认删除此院内活动信息",
    "删除后将不可恢复"
  );
  if (res) {
    let _res: any = await getDeleteList(id);
    if (_res.code == 10000) {
      await getlist(); //院内活动列表
      ElMessage.success("删除成功");
    }
  } else {
    ElMessage.info("取消删除");
  }
};
// 重置

const delde = () => {
  params.page = 1;
  params.name = "";
  params.beginDate = "";
  params.endDate = "";
  params.type = undefined;
  params.key = "";
  getlist(); //院内活动列表
};

onMounted(() => {
  getlist(); //院内活动列表
  getPlayType(); //活动分类
});
</script>
<style lang="less" scoped></style>
