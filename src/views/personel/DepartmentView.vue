<template>
  <!-- 部门管理 -->
  <el-card class="box-card">
    <el-button type="primary" @click="add">添加部门</el-button>
    <DepartmentTree
      v-if="isdialog"
      @close="close"
      :deppid="deppid"
      :depid="depid"
      :depname="depname"
    />
    <el-tree
      class="tree"
      style="max-width: 400px"
      :data="dataSource"
      show-checkbox
      node-key="id"
      :expand-on-click-node="false"
      :props="{ children: 'children', label: 'name' }"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="success" @click="add(data)" :icon="Plus" circle />
            <el-button type="primary" @click="emit(data)" :icon="Edit" circle />
            <el-button
              type="danger"
              @click="remove(data)"
              :icon="Delete"
              circle
            />
          </span>
        </span>
      </template>
    </el-tree>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineAsyncComponent } from "vue";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import { TreeData } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { getMessageBox } from "@/utils/utils";
import { departmentList, delDepartment } from "@/service/staff/StaffApi";
import type { DepartmentListParams } from "@/service/staff/StaffType";

const DepartmentTree = defineAsyncComponent(
  () => import("@/components/dialog/personel/AddDepartmentDialog.vue")
);
const depid = ref<number>(0);
const deppid = ref<number>(0);
const depname = ref<string>("");
const isdialog = ref(false);
// 部门列表
const dataSource = ref<DepartmentListParams[]>([]);
const getlist = async () => {
  let res: any = await departmentList().catch(() => {});
  console.log("部门列表", res);
  if (res?.code === 10000) {
    dataSource.value = TreeData(res.data.list);
  }
};
onMounted(() => {
  getlist();
});
// 增加部门
const add = (data: DepartmentListParams) => {
  console.log(1111, data);

  if (data?.id) {
    deppid.value = data.id;
  }
  isdialog.value = true;
};
// 修改部门
const emit = (data: DepartmentListParams) => {
  console.log(22222, data);
  depid.value = data.id;
  depname.value = data.name;
  if (data.pid) {
    deppid.value = data.pid;
  }
  isdialog.value = true;
};
// 删除部门
const remove = async (data: DepartmentListParams) => {
  console.log(data);
  let obj = {
    text1: "",
    text2: "",
  };
  if (!data.children) {
    obj.text1 = "是否确认删除该部门";
    obj.text2 = "删除后将不可恢复";
  } else {
    obj.text1 = "该部门关联了若干员工";
    obj.text2 = "不支持删除操作";
  }
  let res: any = await getMessageBox(obj.text1, obj.text2, "删除确认");
  console.log(res);
  if (res && !data.children) {
    const res: any = await delDepartment(data.id);
    if (res.code === 10000) {
      await getlist();
      ElMessage.success("删除成功");
    } else {
      ElMessage.error(res.msg);
    }
  }
};
// 关闭弹窗
const close = (isrefresh: boolean) => {
  if (isrefresh === true) {
    getlist();
  }
  depid.value = 0;
  depname.value = "";
  deppid.value = 0;
  isdialog.value = false;
};
</script>

<style scoped lang="less">
.box-card {
  width: 100%;
  height: 100%;
}

.tree {
  margin-top: 50px;
}

.custom-tree-node {
  width: 400px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  span:last-child {
    margin-left: 15px;
  }
}
</style>
