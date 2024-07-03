<template>
  <div class="app-container">
    <!-- 医生查房记录 -->
    <!-- dialog写在medicalcare文件夹下 -->
    <el-card style="max-width: 100%">
      <CheckRoowDialog v-if="isdialog" @close="close" :data="roomid" />
      <el-form
        :inline="true"
        :model="params"
        class="demo-form-inline"
        ref="RefChedkRoom"
      >
        <el-form-item label="老人:" prop="name">
          <el-input v-model="params.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="床位:" prop="begId">
          <MayCascader
            :options="data.beddata"
            @change="bedselect"
            :emitid="Number(params.begId)"
          />
        </el-form-item>
        <el-form-item label="时间:" prop="beginDate">
          <MayTimeSelect
            @change="tiemchange"
            :isrange="true"
            :statetime="params.beginDate"
            :endtime="params.endDate"
            :format="'YYYY-MM-DD HH:mm'"
            :valueformat="'YYYY-MM-DD'"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getCheckRoomList">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="max-width: 100%" class="card">
      <!-- 表格 -->
      <div style="margin: 10px 0">
        <el-button type="primary" @click="add">增加</el-button>
      </div>
      <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
        <template #operate="{ data }">
          <el-button type="primary" text @click="emit(data)">编辑</el-button>
          <el-button type="primary" text @click="del(data.id)">删除</el-button>
        </template>
      </MayTable>
      <Pagination
        :total="total"
        :page="params.page"
        :psize="params.pageSize"
        @page="getpage"
        @psize="getpsize"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, defineAsyncComponent } from "vue";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import {
  CheckRoomList,
  CheckRoomDelete,
} from "@/service/medicalcare/MedicalcareApi";
import type { CheckRoomParams } from "@/service/medicalcare/MedicalcareType";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
import MayTimeSelect from "@/components/timepicker/MayDateTimePicker.vue";
import MayCascader from "@/components/cascader/MayCascader.vue";
import { useRouter } from "vue-router";
import { useBuildStroke } from "@/store";
import CheckRoowDialog from "@/components/dialog/medicalcare/CheckRoowDialog.vue";
const RefChedkRoom = ref<FormInstance>();
const getUserInfo = useBuildStroke();
const router = useRouter();
const total = ref(0);
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "addTime",
      label: "记录时间",
    },
    {
      prop: "addAccountName",
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
  ],
  beddata: [] as any,
});
const roomid = ref<any>({});
const params = reactive<CheckRoomParams>({
  page: 1,
  pageSize: 5,
  begId: "",
  beginDate: "",
  endDate: "",
  name: "",
});
// 查房记录
const getlist = async () => {
  let res: any = await CheckRoomList(params);
  console.log("查房记录", res);
  if (res?.code === 10000) {
    total.value = res.data.counts;
    data.tableData = res.data.list;
  }
};

//弹出框
const isdialog = ref(false);
const isdshow = ref(false);
const close = (val: any) => {
  if (val) {
    getlist();
  }
  isdialog.value = false;
  isdshow.value = false;
};
// 查看记录
// const record = (id: any) => {
//   console.log("查看记录", id);
//   router.push(`/medicalcare/check-room/details/${id}`);
// };

// 分页
const getpage = (val: any) => {
  params.page = val;
  getlist();
};
const getpsize = (val: any) => {
  params.pageSize = val;
  getlist();
};

// 查询
const getCheckRoomList = () => {
  params.page = 1;
  getlist();
};
// 重置
const reset = () => {
  params.page = 1;
  RefChedkRoom.value?.resetFields();
  params.beginDate = "";
  params.endDate = "";
  getlist();
};
// 获取床位列表
const bedlist = async () => {
  data.beddata = await getUserInfo.getBuildListData();
  console.log(333333, data.beddata);
};

// 选择时间
const tiemchange = (val: any) => {
  params.beginDate = val[0] || "";
  params.endDate = val[1] || "";
};
// 增加
const add = () => {
  roomid.value = {};
  isdialog.value = true;
};
// 编辑
const emit = (data: any) => {
  roomid.value = data;
  isdialog.value = true;
};
// 删除
const del = async (id: number) => {
  let box = await getMessageBox("是否删除该条数据?", "");
  if (box) {
    let res: any = await CheckRoomDelete(id);
    if (res?.code === 10000) {
      ElMessage.success("删除成功");
      getlist();
    }
  }
};
// 选择床位
const bedselect = (val: any) => {
  console.log(333, val);

  params.begId = val;
};
onMounted(() => {
  getlist();
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
