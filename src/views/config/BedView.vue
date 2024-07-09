<template>
  <!-- 床位管理 -->
  <div class="app-container">
    <div class="card-container">
      <el-card class="left-card" style="max-width: 15%">
        <div class="room-list">
          <p>房间列表</p>
          <el-tree
            :data="treedata"
            :props="defaultProps"
            style="max-width: 600px"
            @node-click="handleNodeClick"
          />
        </div>
      </el-card>
      <el-card class="right-card" style="max-width: 84%">
        <el-button
          type="success"
          :icon="Plus"
          @click="add"
          style="margin-bottom: 15px"
          >新增床位</el-button
        >
        <BerthDialog
          v-if="isdialog"
          :emitdata="emitbeddata"
          :housedata="berdata"
          @close="close"
        />
        <MayTable
          :identifier="identifier"
          :tableData="data.tableData"
          :tableItem="data.tableItem"
          autoWidth="200px"
        >
          <template #operate="{ data }">
            <el-button text type="primary" :icon="Edit" @click="emit(data)"
              >编辑</el-button
            >
            <el-button text type="danger" :icon="Delete" @click="del(data.id)"
              >删除</el-button
            >
          </template>
        </MayTable>
        <Pagination
          :page="params.page"
          :psize="params.pageSize"
          :total="total"
          @page="getpage"
          @psize="getpsize"
        />
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import BerthDialog from "@/components/dialog/config/BerthDialog.vue";
import {
  buildingList,
  delBeds,
  getBedsList,
  getHouseList,
} from "@/service/config/ConfigApi";
import { getMessageBox, TreeData } from "@/utils/utils";
import { ElMessage } from "element-plus";
import type { BedsList, HouseList } from "@/service/config/ConfigType";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
const identifier = "Workers";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);

const defaultProps = {
  children: "children",
  label: "name",
};
// 树形数据
const treedata = ref([]);
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "name",
      label: "床位号",
    },
    {
      prop: "image",
      label: "入住老人",
    },
    {
      prop: "price",
      label: "价格",
    },
    {
      prop: "addAccountName",
      label: "创建人",
    },
    {
      prop: "addTime",
      label: "创建日期",
    },
    {
      prop: "state",
      label: "状态",
    },
  ],
});
const total = ref(0);
const params = reactive<BedsList>({
  page: 1,
  pageSize: 10,
  houseId: 0,
});
// 增加dialog数据
const berdata = ref<HouseList>({});
// 编辑dialog数据
const emitbeddata = ref<HouseList>({});
// 楼栋列表
const getbuildingList = async () => {
  let res: any = await buildingList();
  console.log("楼栋列表", res);
  if (res?.code === 10000) {
    return res.data.list;
  }
};
// 房间列表
const gethouselist = async () => {
  let res: any = await getHouseList();
  console.log("房间列表", res);
  if (res?.code === 10000) {
    return res.data.list.map((item: any) => ({
      ...item,
      pid: item.buildingId,
    }));
  }
};
// 床位列表
const getbedslist = async () => {
  let res: any = await getBedsList(params);
  console.log("床位列表", res);
  if (res?.code === 10000) {
    total.value = res.data.counts;
    data.tableData = res.data.list;
  }
};
// 左侧数据展示
const gethouse = async () => {
  let house = await getbuildingList();
  let beds = await gethouselist();
  console.log(house.concat(beds));
  let tree: any = TreeData([...house, ...beds]);
  console.log(1111, tree);
  treedata.value = tree;
};
// 选择房间
const handleNodeClick = (data: any) => {
  if (!data?.children) {
    console.log(1111, data);
    params.houseId = data?.id;
    berdata.value = data;
    getbedslist();
  }
};

// 新增床位
const add = () => {
  if (!berdata.value?.id) {
    return ElMessage.error("请先选择房间");
  }
  isdialog.value = true;
};

// 修改床位
const emit = (row: any) => {
  console.log(1111, row);
  emitbeddata.value = row;
  isdialog.value = true;
};

//弹出框
const isdialog = ref(false);
const close = (isclose: boolean) => {
  if (isclose == true) {
    getbedslist();
  }
  isdialog.value = false;
  emitbeddata.value = {};
};
//删除
const del = async (id: number) => {
  let res = await getMessageBox("是否确认删除该床位", "删除后将不可恢复");

  if (res) {
    let del: any = await delBeds(id);
    if (del?.code === 10000) {
      ElMessage.success("删除成功");
      getbedslist();
    }
  } else {
    ElMessage.info("取消删除");
  }
};
const getpage = (page: number) => {
  params.page = page;
  getbedslist();
};
const getpsize = (pageSize: number) => {
  params.pageSize = pageSize;
  getbedslist();
};

onMounted(async () => {
  await gethouse();
  await getbedslist();
});
</script>

<style lang="less" scoped>
.card-container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.left-card {
  flex: 1;
}

.right-card {
  flex: 1;
}

.el-button {
  margin-bottom: 20px;
}

:deep(.el-image) {
  border-radius: 50%;
}

.room-list ul {
  list-style-type: none;
  padding: 0;
}

.room-list ul li {
  margin: 20px 40px;
}

.room-list ul li span {
  font-weight: bold;
}

.el-card {
  height: 100%;
}

.el-button {
  margin-bottom: 0;
}
</style>
