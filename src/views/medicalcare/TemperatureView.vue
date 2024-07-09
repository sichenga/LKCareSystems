<template>
  <div class="app-container">
    <!-- 体温记录 -->
    <!-- dialog写在medicalcare文件夹下 -->
    <el-card style="max-width: 100%">
      <el-form
        ref="Reftemperature"
        :inline="true"
        :model="params"
        class="demo-form-inline"
      >
        <el-form-item label="老人:" prop="name">
          <el-input v-model="params.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="床位:" prop="begId">
          <!-- <el-select  placeholder="请选择">
            <el-cascader v-model="params.begId" :options="options" @change="handleChange" />
        </el-select> -->
          <MayCascader
            :emitid="Number(params.begId)"
            :options="data.beddata"
            @change="bedselect"
          />
        </el-form-item>
        <el-form-item label="日期:" prop="beginDate">
          <MayDateTimePicker
            :endtime="params.endDate"
            :statetime="params.beginDate"
            @change="timeSelect"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="inquire" :icon="Search"
            >查询</el-button
          >
          <el-button @click="reset" :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <TemperatureDialog v-if="dialogVisible" :data="datas" @close="close" />

    <el-card class="card" style="max-width: 100%">
      <el-button
        style="margin-bottom: 20px"
        type="success"
        @click="add"
        :icon="Plus"
        >新增体温
      </el-button>
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
        autoWidth="220px"
        :isMultiple="true"
        @serve-list-is="serveListIs"
      >
        <template #operate="{ data }">
          <el-button
            size="small"
            text
            type="primary"
            @click="record(data)"
            :icon="Edit"
            >编辑
          </el-button>
          <el-button
            size="small"
            text
            type="danger"
            @click="del(data.id)"
            :icon="Delete"
            >删除
          </el-button>
        </template>
      </MayTable>
      <Pagination
        :page="params.page"
        :psize="params.pageSize"
        :total="counts"
        @page="handlPage"
        @p-size="handlpSize"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { Delete, Edit, Plus, Refresh, Search } from "@element-plus/icons-vue";
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import {
  TemperatureDelete,
  TemperatureList,
  TemperatureDeleteAll,
} from "@/service/medicalcare/MedicalcareApi";
import type { MedicalcareParams } from "@/service/medicalcare/MedicalcareType";
import TemperatureDialog from "@/components/dialog/medicalcare/TemperatureDialog.vue";
import MayCascader from "@/components/cascader/MayCascader.vue";
import MayDateTimePicker from "@/components/timepicker/MayDateTimePicker.vue";
import { useBuildStroke } from "@/store";

const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);

const getUserInfo = useBuildStroke();
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "addTime",
      label: "统计日期",
    },
    {
      prop: "houseName",
      label: "记录人",
    },
    {
      prop: "elderlyName",
      label: "老人姓名",
    },
    {
      prop: "begName",
      label: "床位",
    },
    {
      prop: "val",
      label: "体温",
    },
  ],
  beddata: [] as any,
});
const params = reactive<MedicalcareParams>({
  page: 1,
  pageSize: 10,
  name: "", //老人姓名
  beginDate: "", //开始时间yyyy-MM-dd
  endDate: "", //结束时间
  begId: null, //床位Id
});
//体温列表
let counts = 0;
const getlist = async () => {
  let res: any = await TemperatureList(params);

  if (res?.code === 10000) {
    data.tableData = res.data.list;
    counts = res.data.counts;
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
    const del: any = await TemperatureDeleteAll(ids.value);
    if (del?.code === 10000) {
      ElMessage.success("删除成功");
      getlist();
    }
  } else {
    ElMessage.info("取消删除");
  }
};

// 重置
const Reftemperature = ref();
const reset = () => {
  params.page = 1;
  Reftemperature.value?.resetFields();
  params.endDate = "";
  getlist();
};
//弹出框
const dialogVisible = ref(false);

const close = (val: any) => {
  dialogVisible.value = val;
  if (val == true) {
    dialogVisible.value = false;
    getlist();
  }
};

let datas = ref<any>({});
// 选择日期
const timeSelect = (val: any) => {
  params.beginDate = val[0];
  params.endDate = val[1];
};

// 添加
const add = () => {
  datas.value = {};
  dialogVisible.value = true;
};
// 编辑
const record = (data: any) => {
  datas.value = data;
  dialogVisible.value = true;
};
// 删除
const del = async (id: number) => {
  let res = await getMessageBox("是否确认删除此体温记录", "删除后将不可恢复");
  if (res) {
    let _del: any = await TemperatureDelete(id);
    if (_del?.code == 10000) {
      getlist();
      ElMessage.success("删除成功");
    }
  } else {
    ElMessage.info("取消删除");
  }
};
// 搜索
const inquire = () => {
  params.page = 1;
  getlist();
};
// 分页
const handlPage = (val: any) => {
  params.page = val;
  getlist();
};
const handlpSize = (val: any) => {
  params.pageSize = val;
  getlist();
};
// 获取床位列表
const bedlist = async () => {
  data.beddata = await getUserInfo.getBuildListData();
};
// 选择床位
const bedselect = (val: any) => {
  params.begId = val;
};
onMounted(() => {
  getlist(); //体温列表
  bedlist();
});
</script>

<style lang="less" scoped>
.card {
  margin-top: 20px;
}

.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
