<template>
  <div class="app-container">
    <!-- 房间管理 -->
    <el-card style="max-width: 100%">
      <el-form
        ref="refForm"
        :inline="true"
        :model="params"
        class="demo-form-inline"
      >
        <el-form-item label="房间号:" prop="name">
          <el-input
            v-model="params.name"
            clearable
            placeholder="请输入房间号"
          />
        </el-form-item>
        <el-form-item label="楼栋:">
          <MayCascader
            :emitid="params.buildingId"
            :options="options"
            @change="houseselect"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="max-width: 100%; margin-top: 20px">
      <el-button class="btn" type="primary" @click="add">新增房间</el-button>
      <RoomDialog v-if="isdialog" :datail="datail" @close="close" />
      <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
        <template #operate="{ data }">
          <el-button text type="primary" @click="handleEdit(data)"
            >编辑
          </el-button>
          <el-button text type="primary" @click="handleDelete(data.id)"
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
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import RoomDialog from "@/components/dialog/config/RoomDialog.vue";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
//房间列表
import {
  buildingList,
  deleteHouse,
  getHouseList,
} from "@/service/config/ConfigApi";
import type { HouseViewType } from "@/service/config/ConfigType";
import MayCascader from "@/components/cascader/MayCascader.vue";
//删除
import { getMessageBox, TreeData } from "@/utils/utils";

const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
// 获取楼栋列表
const getbuildingList = async () => {
  let res: any = await buildingList().catch(() => {});
  console.log(33, res);
  if (res?.code === 10000) {
    options.value = TreeData(res.data.list);
  }
};
const options = ref<any>([]);
const data = reactive({
  tableData: [] as any,
  total: undefined,
  tableItem: [
    {
      prop: "id",
      label: "序号",
      width: "60",
    },
    {
      prop: "name",
      label: "房间号",
    },
    {
      prop: "buildingName",
      label: "楼层",
    },
    {
      prop: "beds",
      label: "床位数",
    },
    {
      prop: "",
      label: "入住老人",
    },

    {
      prop: "addTime",
      label: "创建时间",
    },
    {
      prop: "addAccountName",
      label: "创建人",
    },
  ],
});

const add = () => {
  isdialog.value = true;
  datail.value = {};
};
//弹出框
const isdialog = ref(false);
const close = (val: any) => {
  isdialog.value = false;
  if (val) {
    getHouselist();
  }
};

const handleDelete = async (id: number) => {
  console.log("删除", id);
  let res = await getMessageBox("是否确认删除该房屋", "删除后将不可恢复");
  console.log(11112, res);
  if (res) {
    const del: any = await deleteHouse(id);
    console.log("删除", del);
    if (del?.code === 10000) {
      ElMessage.success("删除成功");
      getHouselist();
    }
  } else {
    ElMessage.info("取消删除");
  }
};
//房间列表
const params = reactive<HouseViewType>({
  page: 1,
  pageSize: 10,
  name: "",
  buildingId: undefined,
});
// 房间列表
const getHouselist = async () => {
  const res: any = await getHouseList(params);
  console.log("房间列表", res);
  if (res?.code === 10000) {
    data.tableData = res.data.list;
    data.total = res.data.counts;
  }
};
//分页
const page = (val: number) => {
  params.page = val;
  getHouselist();
};
const psize = (val: number) => {
  params.pageSize = val;
  getHouselist();
};

// 选择楼栋
const houseselect = (val: number) => {
  params.buildingId = val;
};
const refForm = ref<FormInstance>();
//查询
const search = () => {
  params.page = 1;
  getHouselist();
};
// 重置
const reset = () => {
  refForm.value?.resetFields();
  params.buildingId = undefined;
  search();
};
//修改
const datail = ref<any>([]);
const handleEdit = (data: any) => {
  isdialog.value = true;
  datail.value = data;
};

onMounted(() => {
  getbuildingList();
  getHouselist();
});
</script>

<style lang="less" scoped>
.btn {
  margin-bottom: 20px;
}
</style>
