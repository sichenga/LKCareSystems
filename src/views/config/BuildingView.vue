<template>
  <!-- 楼层管理 -->
  <div class="app-container">
    <el-card style="max-width: 100%">
      <el-button type="primary" @click="addBuild">新增楼层</el-button>
      <FloorDialog
        v-if="isdialog"
        :id="id"
        :list="list"
        :pid="pid"
        @close="close"
      />
      <el-tree
        :data="dataSource"
        :expand-on-click-node="false"
        :props="{ label: 'name', children: 'children' }"
        node-key="id"
        show-checkbox
        style="max-width: 600px"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                :icon="Plus"
                circle
                type="success"
                @click="add(data)"
              />
              <el-button
                :icon="Edit"
                circle
                type="primary"
                @click="modification(data)"
              />
              <el-button
                :icon="Delete"
                circle
                type="danger"
                @click="del(data.id)"
              />
            </span>
          </span>
        </template>
      </el-tree>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import FloorDialog from "@/components/dialog/config/FloorDialog.vue";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { ConfigBuildingList, delBuilding } from "@/service/config/ConfigApi";
import { convertToTree } from "@/utils/treeUtils";
//树形控件
const dataSource = ref<any[]>([]);
// 楼层管理
const buildingList = async () => {
  let res: any = await ConfigBuildingList().catch(() => {});
  console.log("楼层管理", res);

  if (res.code === 10000) {
    dataSource.value = convertToTree(res.data.list);
  }
};

//弹出框
const isdialog = ref(false);
const close = (val: boolean) => {
  if (val) {
    buildingList();
  }
  isdialog.value = false;
};

//删除
const del = async (id: any) => {
  let res = await getMessageBox("是否确认删除该楼层", "删除后将不可恢复");
  if (res) {
    let list: any = await delBuilding(id).catch(() => {});
    if (list.code === 10000) {
      buildingList();
      ElMessage.success("删除成功");
    }
  } else {
    ElMessage.info("取消删除");
  }
};

//添加子楼栋
const pid: any = ref(0);
const add = (data: any) => {
  if (data) {
    id.value = 0;
    pid.value = data.id;
    list.value = {};
  }
  isdialog.value = true;
};
//修改楼栋
const list: any = ref({});
const id: any = ref({});
const modification = (data: any) => {
  if (data) {
    id.value = data.id;
    pid.value = data.pid;
    list.value = data;
  }
  isdialog.value = true;
};
//添加楼栋
const addBuild = () => {
  isdialog.value = true;
  id.value = 0;
  pid.value = 0;
  list.value = {};
};
onMounted(() => {
  buildingList();
});
</script>

<style lang="less" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
:deep(.el-tree-node__content) {
  height: 33px;
  margin-bottom: 5px;
}
</style>
