<template>
  <div>
    <!-- 护工管理 -->
    <el-card style="max-width: 100%">
      <el-form
        ref="Refcarer"
        :inline="true"
        :model="states"
        class="demo-form-inline"
      >
        <el-form-item label="护工姓名:" prop="name">
          <el-input v-model="states.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="联系方式:" prop="mobile">
          <el-input v-model="states.mobile" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="所属岗位:" prop="roleId">
          <el-select
            v-model="states.roleId"
            placeholder="请选择"
            style="width: 240px"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="老人姓名:" prop="name">
          <el-input v-model="states.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="max-width: 100%" class="card">
      <el-button type="primary" @click="isdialog = true">新增</el-button>
      <WorkersDialog @close="close" v-if="isdialog" />

      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        :identifier="identifier"
      >
        <template #operate="{ data }">
          <el-button type="primary" text @click="del(data.id)">删除</el-button>
        </template>
      </MayTable>
      <Pagination
        :total="data.total"
        :page="states.page"
        :psize="states.pageSize"
        @page="getpage"
        @psize="getpsize"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineAsyncComponent, onMounted } from "vue";

import { staffList, carerDelete } from "@/service/staff/StaffApi";
import { RoleList } from "@/service/role/RoleApi";
import type { StaffListParams } from "@/service/staff/StaffType";
import WorkersDialog from "@/components/dialog/config/WorkersDialog.vue";

import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const identifier = "Workers";
const Refcarer = ref();
//岗位 角色
const options: any = ref("");
const data = reactive({
  total: undefined,
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "photo",
      label: "头像",
    },
    {
      prop: "name",
      label: "姓名",
    },
    {
      prop: "mobile",
      label: "联系方式",
    },
    {
      prop: "roles",
      label: "所属岗位",
    },
    {
      prop: "service",
      label: "服务老人",
    },
  ],
});
// 查询
const search = () => {
  states.page = 1;
  getlist();
};
const states = reactive<StaffListParams>({
  page: 1,
  pageSize: 5,
  name: "", //护工姓名
  mobile: "", //联系方式
  idCard: undefined, //身份证号
  departmentId: null, //部门id
  roleId: null, //岗位id
  enable: null, //状态
  carer: 1, //是否是护工1是
});
// 重置
const reset = () => {
  states.page = 1;
  Refcarer.value?.resetFields();
  getlist();
};
// 护工列表
const getlist = async () => {
  let res: any = await staffList(states);
  console.log("列表", res);
  if (res.code === 10000) {
    data.tableData = res.data.list;
    data.total = res.data.counts;
  }
};
//角色
const getRoleList = async () => {
  let res: any = await RoleList();
  if (res.code === 10000) {
    options.value = res.data.list;
  }
};

//弹出框
const isdialog = ref(false);
const close = (val: boolean) => {
  isdialog.value = val;
  if (val) {
    isdialog.value = false;
    getlist(); //护工
  }
};

//删除护工
const del = async (id: number) => {
  let res = await getMessageBox("是否确认删除该护工", "删除后将不可恢复");
  if (res) {
    let item: any = await carerDelete(id);
    if (item?.code === 10000) {
      getlist();
      ElMessage.success("删除成功");
    }
  } else {
    ElMessage.info("取消删除");
  }
};
// 分页
const getpage = (page: number) => {
  states.page = page;
  getlist();
};
const getpsize = (pageSize: number) => {
  states.pageSize = pageSize;
  getlist();
};

onMounted(() => {
  getlist(); //护工
  getRoleList(); //角色
});
</script>

<style lang="less" scoped>
.card {
  margin-top: 20px;
}

.el-button {
  margin-bottom: 20px;
}

.demo-form-inline .el-input {
  --el-input-width: 200px;
}

.demo-form-inline .el-select {
  --el-select-width: 200px;
}
</style>
