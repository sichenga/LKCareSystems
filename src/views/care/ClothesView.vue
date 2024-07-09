<template>
  <!-- 洗衣错衣 -->
  <div class="app-container">
    <el-card>
      <el-form
        ref="Refclothes"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
      >
        <el-form-item label="发布人：" prop="elderlyName">
          <el-input
            v-model="formInline.elderlyName"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="发布时间：" prop="beginDate">
          <MayDateTimePicker
            @change="timeSelect"
            :statetime="formInline.beginDate"
            :endtime="formInline.endDate"
          />
        </el-form-item>
        <el-form-item label="类型：" prop="type">
          <el-select
            v-model="formInline.type"
            placeholder="请选择"
            style="width: 240px"
          >
            <el-option label="缺衣" :value="'缺衣'" />
            <el-option label="错衣" :value="'错衣'" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="state">
          <el-select
            v-model="formInline.state"
            placeholder="请选择"
            style="width: 240px"
          >
            <el-option :label="'已解决'" :value="'已解决'" />
            <el-option :label="'未解决'" :value="'未解决'" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" :icon="Search"
            >查询</el-button
          >
          <el-button @click="reset" :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 15px">
      <el-button
        type="success"
        @click="add"
        style="margin-bottom: 20px"
        :icon="Plus"
        >添加洗衣错衣</el-button
      >
      <el-button
        style="margin-bottom: 20px"
        type="danger"
        :icon="Delete"
        :disabled="!ids.length"
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
            type="primary"
            text
            @click="particulars(data.id)"
            :icon="Tickets"
            >详情</el-button
          >
          <el-button type="primary" text @click="edit(data.id)" :icon="Edit"
            >编辑</el-button
          >
          <el-button
            type="danger"
            text
            @click="handleDelete(data.id)"
            :icon="Delete"
            >删除</el-button
          >
        </template>
      </MayTable>
      <Pagination
        :total="data.total"
        @page="page"
        @psize="psize"
        :page="formInline.page"
        :pszie="formInline.pageSize"
      />
    </el-card>
    <!-- 详情 -->
    <WashparticularsDialog v-if="isdialog" :id="details" @close="close" />
    <!-- 添加 -->
    <ClothesDialog v-if="dialogVisible" :id="editid" @close="close" />
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import {
  clothesList,
  clothesDelete,
  clothesDeleteAll,
} from "@/service/care/ClothesApi";
import type { ClothesListparams } from "@/service/care/ClothesType";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import MayDateTimePicker from "@/components/timepicker/MayDateTimePicker.vue";
import {
  Delete,
  Edit,
  Plus,
  Refresh,
  Search,
  Tickets,
} from "@element-plus/icons-vue";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const WashparticularsDialog = defineAsyncComponent(
  () => import("@/components/dialog/care/WashparticularsDialog.vue")
);
const ClothesDialog = defineAsyncComponent(
  () => import("@/components/dialog/care/AddClothesDialog.vue")
);
const formInline = reactive<ClothesListparams>({
  page: 1,
  pageSize: 10,
  elderlyName: "",
  beginDate: "",
  type: "",
  state: "",
  endDate: "",
});

// 重置
const Refclothes = ref();
const reset = () => {
  formInline.page = 1;
  Refclothes.value?.resetFields();
  formInline.endDate = "";
  getlist();
};

// 查询
const search = () => {
  formInline.page = 1;
  getlist();
};
// 分页
const page = (val: number) => {
  formInline.page = val;
  getlist();
};
const psize = (val: number) => {
  formInline.pageSize = val;
  getlist();
};
const isdialog = ref(false);
const data = reactive({
  total: undefined,
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "elderlyName",
      label: "发布人",
    },
    {
      prop: "addTime",
      label: "发布时间",
    },
    {
      prop: "type",
      label: "类型",
    },
    {
      prop: "title",
      label: "标题",
    },
    {
      prop: "state",
      label: "状态",
    },
  ],
});

// 错衣缺衣列表
const getlist = async () => {
  const res: any = await clothesList(formInline);
  console.log("错衣缺衣列表", res);
  if (res.code == 10000) {
    data.tableData = res.data.list;
    data.total = res.data.counts;
  }
};

// 批量删除
let ids = ref<any>([]);
const serveListIs = (val: any) => {
  ids.value = val.map((item: any) => item.id);
};
//批量删除
const handleDeleteAll = async () => {
  let res = await getMessageBox("是否确认删除该数据", "删除后将不可恢复");
  if (res) {
    const del: any = await clothesDeleteAll(ids.value);
    if (del?.code === 10000) {
      ElMessage.success("删除成功");
      getlist();
    }
  } else {
    ElMessage.info("取消删除");
  }
};

// 编辑
const editid = ref(0);
const edit = (val: any) => {
  dialogVisible.value = true;
  editid.value = val;
};

// 详情
const details = ref();
const particulars = (id: number) => {
  details.value = id;
  isdialog.value = true;
};

// 添加
const dialogVisible = ref(false);
const add = () => {
  dialogVisible.value = true;
  editid.value = 0;
};

// 删除
const handleDelete = async (id: any) => {
  console.log("删除", id);
  let res = await getMessageBox("是否确认删除该洗衣错衣", "删除后将不可恢复");
  if (res) {
    const res: any = await clothesDelete(id).catch(() => {});
    if (res.code == 10000) {
      ElMessage.success("删除成功");
      getlist();
    } else {
      ElMessage.error(res.msg);
    }
  } else {
    ElMessage.info("取消删除");
  }
};
// 创建时间
const timeSelect = (val: any) => {
  formInline.beginDate = val[0];
  formInline.endDate = val[1];
};

// 关闭弹窗
const close = (val: boolean) => {
  isdialog.value = false;
  dialogVisible.value = false;
  if (val) {
    getlist();
  }
};

onMounted(() => {
  getlist();
});
</script>
<style lang="less" scoped></style>
