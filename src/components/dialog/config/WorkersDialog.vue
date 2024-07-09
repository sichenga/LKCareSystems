<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增护工"
    width="800"
    @close="close"
  >
    <el-form :inline="true" :model="states" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="states.name" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="所属岗位">
        <el-select
          v-model="states.roleId as number"
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
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
    <MayTable
      :identifier="identifier"
      :tableData="data.tableData"
      :tableItem="data.tableItem"
    >
      <template #operate="{ data }">
        <el-button v-if="data.isCarer == 0" type="primary" @click="select(data)"
          >选择
        </el-button>
        <el-button v-else type="danger" @click="select(data)"
          >取消选择
        </el-button>
      </template>
    </MayTable>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="add">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { careradd, staffList, updateList } from "@/service/staff/StaffApi";
import type { StaffListParams } from "@/service/staff/StaffType";
import { RoleList } from "@/service/role/RoleApi";
import { ElMessage } from "element-plus";

const identifier = "Workers";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
//岗位 角色
const options: any = ref("");
//角色
const getRoleList = async () => {
  let res: any = await RoleList().catch(() => {});
  if (res.code === 10000) {
    options.value = res.data.list;
  }
};

const states = reactive<StaffListParams>({
  page: 1,
  pageSize: 10,
  name: "", //护工姓名
  mobile: "", //联系方式
  idCard: undefined, //身份证号
  departmentId: null, //部门id
  roleId: null, //岗位id
  enable: null, //状态
  carer: null, //是否是护工1是
});
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "photo",
      label: "头像",
    },
    {
      prop: "name",
      label: "姓名",
      width: "130",
    },
    {
      prop: "mobile",
      label: "手机号",
      width: "130",
    },
    {
      prop: "departmentName",
      label: "财务部",
    },
    {
      prop: "roles",
      label: "岗位",
      width: "150",
    },
  ],
});
//员工
const getlist = async () => {
  let res: any = await staffList(states);
  console.log(res);
  if (res.code === 10000) {
    data.tableData = res.data.list;
  }
};
// 选择取消选择
//选择的id  oldName.isCarer =1
const selectID: any = ref([]);
const select = async (data: any) => {
  if (data.isCarer == 1) {
    data.isCarer = 0;
    console.log(data);
    let res: any = await updateList(data).catch(() => {});
    if (res.code == 10000) {
      ElMessage.success("取消成功");
    }
  } else {
    data.isCarer = 1;
    selectID.value.push(data.id);
  }
};
// 确定添加 护工
const add = async () => {
  let res: any = await careradd(selectID.value).catch(() => {});
  console.log(res);
  if (res.code == 10000) {
    ElMessage.success("添加成功");
    close(true);
  } else if (res.code == 10001) {
    ElMessage.error("请选择员工");
  }
};
// 查询
const search = () => {
  states.page = 1;
  getlist();
};
onMounted(() => {
  getlist(); //员工
  getRoleList(); //角色
});
//弹框
const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};
</script>

<style lang="less" scoped>
.demo-form-inline .el-input {
  --el-input-width: 150px;
}

.demo-form-inline .el-select {
  --el-select-width: 150px;
}
</style>
