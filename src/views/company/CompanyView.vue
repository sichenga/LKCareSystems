<template>
  <div class="app-container">
    <!-- 分机构列表 -->
    <el-card>
      <el-form :inline="true" :model="params" class="demo-form-inline">
        <el-form-item label="机构名称：">
          <el-input v-model="params.key" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="管理姓名">
          <el-input v-model="params.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button :icon="Search" type="primary" @click="serch"
            >查询</el-button
          >
          <el-button :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 10px">
      <div style="margin: 10px 0">
        <el-button :icon="Plus" type="success" @click="SondAdd">新增</el-button>
        <el-button
          :icon="Delete"
          type="danger"
          @click="delAll"
          :disabled="data.ids.length <= 0"
          >批量删除</el-button
        >
        <organizationDialog v-if="isdialog" :id="editId" @close="close" />
      </div>
      <!-- 表格 -->
      <MayTable
        :isMultiple="true"
        autoWidth="200px"
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        @serve-list-is="serveListIs"
      >
        <template #operate="scope">
          <el-button
            :icon="Edit"
            text
            type="primary"
            @click="amend(scope.data.id)"
            >编辑
          </el-button>
          <el-button
            :icon="Delete"
            text
            type="danger"
            @click="del(scope.data.id)"
            >删除
          </el-button>
        </template>
      </MayTable>
      <Pagination
        :page="params.page"
        :pszie="params.page"
        :total="data.total"
        @page="page"
        @psize="psize"
      />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { Delete, Edit, Plus, Search, Refresh } from "@element-plus/icons-vue";
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import type { companylistParams } from "@/service/Organization/OrganizationType";
import {
  companydelete,
  companyget,
  companylist,
  deleteAll,
} from "@/service/Organization/OrganizationApi";
import { useUserStore } from "@/store";
import organizationDialog from "@/components/dialog/company/organizationDialog.vue";

const userStore = useUserStore();
const isdialog = ref(false);
const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const data = reactive({
  ids: [] as any,
  total: undefined,
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "name",
      label: "机构名称",
    },
    {
      prop: "address",
      label: "区域",
    },
    {
      prop: "adminName",
      label: "管理员姓名",
    },
    {
      prop: "adminMobile",
      label: "联系电话",
    },
    {
      prop: "adminUserName",
      label: "管理员账号",
    },
    {
      prop: "adminPwd",
      label: "管理员密码",
    },
  ],
});
//弹出框
const close = (val: boolean) => {
  isdialog.value = val;
  if (val) {
    isdialog.value = false;
    getcompanylist();
  }
};
const serveListIs = (val: any) => {
  const ids = val.map((item: any) => item.id);
  data.ids = ids;
};
//添加
const editId = ref(0);
const SondAdd = () => {
  console.log(userStore.user.model?.type);
  switch (userStore.user.model?.type) {
    case 1:
      router.push("/company/add");
      break;
    case 2:
      isdialog.value = true;
      editId.value = 0;
      break;
    default:
      break;
  }
};
//删除
const del = async (id: any) => {
  console.log("删除", id);
  let res = await getMessageBox("是否确认删除该机构", "删除后将不可恢复");
  console.log(res);
  switch (userStore.user.model?.type) {
    case 1:
      if (res) {
        const res: any = await companydelete(id).catch(() => {});
        if (res.code == 10000) {
          ElMessage.success("删除成功");
          getcompanylist();
        } else {
          ElMessage.error(res.msg);
        }
      }
      break;
    case 2:
      if (res) {
        const res: any = await companydelete(id).catch(() => {});
        if (res.code == 10000) {
          ElMessage.success("删除成功");
          getcompanylist();
        } else {
          ElMessage.error(res.msg);
        }
      }
      break;
    default:
      break;
  }
};
// 批量删除
const delAll = async () => {
  let res = await getMessageBox("是否确认批量删除该机构", "删除后将不可恢复");
  if (!res) return ElMessage.info("取消删除");
  const del: any = await deleteAll(data.ids);
  if (del?.code === 10000) {
    ElMessage.success("删除成功");
    await getcompanylist();
  }
};
//修改
const amend = async (id: any) => {
  console.log("修改", id);
  let res = await companyget(id);
  console.log("修改", res);
  switch (userStore.user.model?.type) {
    case 1:
      router.push(`/company/edit/${id}`);
      break;
    case 2:
      isdialog.value = true;
      editId.value = id;
      break;
    default:
      break;
  }
};

//定义页数
const params = reactive<companylistParams>({
  page: 1,
  pageSize: 10,
  key: "",
  name: "",
});
//分页
const page = (val: number) => {
  params.page = val;
  getcompanylist();
};
const psize = (val: number) => {
  params.pageSize = val;
  getcompanylist();
};
//请求列表
const getcompanylist = async () => {
  const res: any = await companylist(params);
  console.log("列表", res);
  if (res.code === 10000) {
    data.tableData = res.data.list;
    data.total = res.data.counts;
  }
};

//查询
const serch = () => {
  getcompanylist();
  params.page = 1;
};

onMounted(() => {
  getcompanylist();
});
</script>
<style lang="less" scoped></style>
