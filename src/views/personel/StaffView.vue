<template>
  <div>
    <!-- 员工管理 -->
    <!-- 查询 -->
    <div class="app-container">
      <el-card>
      <el-form
        ref="Refstaff"
        :inline="true"
        :model="states"
        class="demo-form-inline"
      >
        <el-form-item label="员工姓名：" prop="name">
          <el-input
            v-model="states.name"
            placeholder="请输入员工姓名"
            clearable
          />
        </el-form-item>
        <el-form-item label="联系方式:" prop="mobile">
          <el-input
            v-model="states.mobile"
            placeholder="请输入联系方式"
            clearable
          />
        </el-form-item>
        <el-form-item label="身份证号：" prop="idCard">
          <el-input
            v-model="states.idCard"
            placeholder="请输入身份证号"
            clearable
          />
        </el-form-item>
        <el-form-item label="所属部门：" prop="departmentId">
          <el-select
            v-model="states.departmentId"
            placeholder="请选择所属部门"
            clearable
          >
            <el-option
              v-for="item in departmentData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属岗位：" prop="roleId">
          <el-select
            v-model="states.roleId"
            placeholder="请选择所属岗位"
            clearable
          >
            <el-option
              v-for="item in Roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="enable">
          <el-select v-model="states.enable" placeholder="请选择状态" clearable>
            <el-option label="是" :value="1" />
            <el-option label="否" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="table">
      <el-button style="margin-bottom: 20px" type="primary" @click="add"
        >新增</el-button
      >
      <!-- 表格 -->
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        :identifier="identifier"
      >
        <template #operate="{ data }">
          <el-button type="primary" size="small" link @click="handleEdit(data)"
            >编辑</el-button
          >
          <el-button type="primary" size="small" link>
            <span @click="enable(data, data.enable ? 0 : 1)">{{
              !data.enable ? "启用" : "禁用"
            }}</span>
          </el-button>
          <el-button
            type="primary"
            size="small"
            link
            @click="handleDelete(data.id)"
            >删除</el-button
          >
        </template>
      </MayTable>
      <!-- 分页 -->
      <Pagination
        @page="Holdepage"
        @psize="Holdepsize"
        :page="states.page"
        :psize="states.pageSize"
        :total="total"
      />
    </el-card>
  </div>
    
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import {
  staffList,
  delstaff,
  departmentList,
  updateList,
} from "@/service/staff/StaffApi";
import type { StaffListParams } from "@/service/staff/StaffType";
import { RoleList } from "@/service/role/RoleApi";
const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const Refstaff = ref();
const identifier = "StaffView";
const data = reactive({
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
      width: "150px",
    },
    {
      prop: "idCard",
      label: "身份证号",
      width: "150px",
    },
    {
      prop: "departmentId",
      label: "所属部门",
    },
    {
      prop: "companyId",
      label: "所属岗位",
    },
    {
      prop: "adminUserName",
      label: "账号",
    },
    {
      prop: "adminPwd",
      label: "密码",
    },
    {
      prop: "addAccountName",
      label: "创建人",
    },
  ],
});

const states = ref<StaffListParams>({
  page: 1,
  pageSize: 5,
  name: "", //员工姓名
  mobile: "", //联系方式
  idCard: "", //身份证号
  departmentId: null, //部门id
  roleId: null, //岗位id
  enable: null, //状态
});
const total = ref(0);
//员工列表
const getlist = async () => {
  let res: any = await staffList(states.value);
  console.log(res);

  if (res.code == 10000) {
    data.tableData = res.data.list;
    total.value = res.data.counts;
  }
};
// 分页
const Holdepsize = (val: any) => {
  states.value.pageSize = val;
  getlist();
};
const Holdepage = (val: any) => {
  states.value.page = val;
  getlist();
};
// 添加
const add = () => {
  router.push("/personel/staff/add");
};
// 编辑
const handleEdit = (data: any) => {
  router.push({
    path: "/personel/staff/add",
    query: {
      id: data.id,
    },
  });
};

//  禁用
const enable = async (data: any, isenble: number) => {
  let staffdata = JSON.parse(JSON.stringify(data));
  staffdata.enable = isenble;

  if (data.enable) {
    let res = await getMessageBox(
      "是否确认禁用该员工",
      "禁用后该员工将不可正常使用系统功能"
    );
    if (res) {
      let update: any = await updateList(staffdata);
      console.log(update);
      if (update.code == 10000) {
        getlist();
        ElMessage.success("禁用成功");
      }
    }
  }
  // if(oldName.enable){

  // }
};

// 重置
const reset = () => {
  Refstaff.value?.resetFields();
  getlist();
};

// 删除
const handleDelete = async (id: any) => {
  let res = await getMessageBox("是否确认删除该员工", "删除后将不可恢复");
  if (res) {
    let reIs: any = await delstaff(id);
    if (reIs.code == 10000) {
      ElMessage.success("删除成功");
      getlist();
    }
  } else {
    ElMessage.info("取消删除");
  }
};

//查询
const onSubmit = () => {
  states.value.page = 1;
  getlist();
};

//所属部门
const departmentData: any = ref([]);
const partmentList = async () => {
  let res: any = await departmentList();
  if (res.code === 10000) {
    departmentData.value = res.data.list;
  }
};
//所属岗位
const Roles: any = ref([]);
const RoleListData = async () => {
  let res: any = await RoleList();
  if (res.code) {
    Roles.value = res.data.list;
  }
};
onMounted(() => {
  getlist(); //员工列表
  partmentList(); //所属部门
  RoleListData(); //所属岗位
});
</script>

<style scoped lang="less">
.el-form {
  margin-top: 15px;
}
.el-card {
  width: 100%;
}
.table {
  margin-top: 20px;
}
</style>
<style>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
