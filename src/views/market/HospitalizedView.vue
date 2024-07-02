<template>
  <!-- <div>入院管理</div> -->
  <div class="app-container">
    <el-card style="max-width: 100%">
      <el-form
        ref="Hospitalised"
        :inline="true"
        :model="states"
        class="demo-form-inline"
      >
        <el-form-item label="老人姓名" prop="name">
          <el-input v-model="states.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="身份证号码" prop="idCard">
          <el-input v-model="states.idCard" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="床位" prop="begId">
          <MayCascader
            :options="data.beddata"
            @change="bedselect"
            :emitid="Number(states.begId)"
          />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="states.state" placeholder="请选择" clearable>
            <el-option label="已入院" value="1" />
            <el-option label="未入院" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sonds">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="max-width: 100%" class="card">
      <el-button
        type="primary"
        @click="isdialog = true"
        style="margin-bottom: 20px"
        >新增入院申请</el-button
      >
      <!-- <ToHospitalDialog v-if="isdialog" @close="close"></ToHospitalDialog> -->
      <OldSelectDialog
        v-if="isdialog"
        @close="close"
        :toPath="'/market/order'"
      />
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        :identifier="identifier"
        autoWidth="400px"
      >
        <template #operate="{ data }">
          <el-button type="primary" text @click="compile(data.id)"
            >编辑</el-button
          >
          <el-button type="primary" text @click="del(data.id)">删除</el-button>
          <el-button type="primary" text @click="details(data.id)"
            >详情</el-button
          >
        </template>
      </MayTable>
      <Pagination
        @page="handPage"
        @psize="handPsize"
        :page="states.page"
        :psize="states.pageSize"
        :total="counts"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, defineAsyncComponent } from "vue";
import { ElMessage } from "element-plus";
import { orderList, orderDelete, orderGet } from "@/service/market/marketApi";
import type { order } from "@/service/market/marketType";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
// const ToHospitalDialog = defineAsyncComponent(
//   () => import('@/components/dialog/market/ToHospitalDialog.vue')
// )
import OldSelectDialog from "@/components/dialog/OldSelect/OldSelectDialog.vue";
const MayCascades = defineAsyncComponent(
  () => import("@/components/cascader/MayCascader.vue")
);
import { getMessageBox } from "@/utils/utils";
import { useBuildStroke } from "@/store";
import { useRouter } from "vue-router";
import MayCascader from "@/components/cascader/MayCascader.vue";
const identifier = "Hospitalized";
const router = useRouter();
const Hospitalised = ref();
const isdialog = ref(false);
const getUserInfo = useBuildStroke();
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "elderlyPhoto",
      label: "头像",
    },
    {
      prop: "sex",
      label: "性别",
    },
    {
      prop: "elderlyName",
      label: "老人姓名",
    },

    {
      prop: "elderlyIdCard",
      label: "身份证号",
    },
    {
      prop: "begName",
      label: "床位",
    },
    {
      prop: "addTime",
      label: "申请时间",
    },
    {
      prop: "startDate",
      label: "入住开始时间",
    },
    {
      prop: "payDays",
      label: "入住时长（月）",
    },
    {
      prop: "state",
      label: "状态",
    },
  ],
  beddata: [] as any,
});
const states = reactive<order>({
  page: 1,
  pageSize: 10,
  name: "", //老人姓名
  mobile: "", //手机号
  idCard: "", //身份证号
  begId: null, //床位号
  state: null, //状态
});
const counts = ref(0);
const getlist = async () => {
  let res: any = await orderList(states);
  console.log("老人列表", res);

  if (res?.code == 10000) {
    data.tableData = res.data.list;
    counts.value = res.data.counts;
  }
};
// 重置
const reset = () => {
  states.page = 1;
  Hospitalised.value?.resetFields();
  getlist();
};
// 查询
const sonds = () => {
  states.page = 1;
  getlist();
};
// 关闭弹窗
const close = () => {
  isdialog.value = false;
};
// 删除
const del = async (id: number) => {
  let res = await getMessageBox("是否确认删除此入住", "删除后将不可恢复");
  if (res) {
    let _res: any = await orderDelete(id);
    if (_res.code == 10000) {
      await getlist();
      ElMessage.success("删除成功");
    }
  } else {
    ElMessage.info("取消删除");
  }
};
//编辑入院老人
const compile = async (id: number) => {
  let res: any = await orderGet(id);
  console.log(res);

  if (res?.code == 10000) {
    await router.push({
      path: "/market/order",
      query: {
        oldId: res.data.elderlyId,
        ids: id,
      },
    });
  }
};
//  入院详情
const details = (id: number) => {
  router.push({
    path: "/market/hospital-details/" + id,
  });
};
// 分页
const handPage = (val: any) => {
  states.page = val;
  getlist();
};
const handPsize = (val: any) => {
  states.pageSize = val;
  getlist();
};

// 获取床位列表
const bedlist = async () => {
  data.beddata = await getUserInfo.getBuildListData();
};
// 选择床位
const bedselect = (val: any) => {
  states.begId = val;
};
onMounted(() => {
  getlist(); //入院列表
  bedlist(); //床位列表
});
</script>

<style lang="less" scoped>
.card {
  margin-top: 20px;
}

.demo-form-inline .el-input {
  --el-input-width: 200px;
}

.demo-form-inline .el-select {
  --el-select-width: 200px;
}
</style>
