<template>
  <!-- 资讯登记 -->
  <div class="app-container">
    <el-card class="section" style="margin-top: 15px">
      <el-form
        ref="Refquestion"
        :model="states"
        label-width="100px"
        style="display: flex; align-items: center"
      >
        <el-form-item label="咨询人姓名：" prop="name">
          <el-input
            v-model="states.name"
            placeholder="请输入咨询人姓名"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="老人姓名：" prop="customerName">
          <el-input
            v-model="states.customerName"
            placeholder="请输入老人姓名"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="回访状态：" prop="state">
          <el-select
            v-model="states.state as number"
            placeholder="请选择"
            style="width: 180px"
          >
            <el-option :value="0" label="待回访" />
            <el-option :value="1" label="已回访" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="inquire">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="section" style="margin-top: 15px">
      <div style="margin: 10px 0">
        <el-button type="primary" @click="addRelation">新增咨询</el-button>
      </div>
      <!-- 表格 -->
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        auto-width="380px"
      >
        <template #operate="{ data }">
          <el-button text type="primary" @click="edit(data.id)">编辑</el-button>
          <el-button text type="primary" @click="del(data.id)">删除</el-button>
          <el-button text type="primary" @click="particulars(data.id)"
            >详情</el-button
          >
          <el-button text type="primary" @click="record(data.id)"
            >回访记录</el-button
          >
        </template>
      </MayTable>
      <Pagination
        :page="states.page"
        :psize="states.pageSize"
        :total="total"
        @page="holedpage"
        @pszie="holedpsize"
      />
    </el-card>
    <div class="title-btn" v-if="customerId">
      <el-button @click="$router.go(-1)">返回</el-button>
    </div>
    <AddRelation
      v-if="dialogVisible"
      :customerId="customerId"
      :ids="ids"
      @close="Holedclose"
    />

    <Particulars v-if="dialogVisibles" :editId="editId" @close="Holedcloses" />
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { deleteMarket, getMarketList } from "@/service/market/marketApi";
import type { market } from "@/service/market/marketType";

const route = useRoute();

const customerId = ref<any>(route.query?.id);
// customerId.value = route.query.id;
const Refquestion = ref();
const router = useRouter();
const AddRelation = defineAsyncComponent(
  () => import("@/components/dialog/consult/AddConsult.vue")
);
const Particulars = defineAsyncComponent(
  () => import("@/components/dialog/consult/ParTivulars.vue")
);
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "type",
      label: "咨询类型",
    },
    {
      prop: "customerName",
      label: "老人姓名",
    },
    {
      prop: "source",
      label: "咨询渠道",
    },
    {
      prop: "name",
      label: "咨询人",
    },
    {
      prop: "mobile",
      label: "联系方式",
    },
    {
      prop: "relation",
      label: "与老人关系",
    },
    {
      prop: "addAccountName",
      label: "登记人",
    },
    {
      prop: "visitTime",
      label: "计划回访日期",
      width: "160px",
    },
    {
      prop: "stateName",
      label: "回访状态",
    },
  ],
});

const states = reactive<market>({
  page: 1,
  pageSize: 10,
  name: "", //资讯人姓名
  customerName: "", //老人姓名
  mobile: "", //手机号
  state: null, //0:待回访,1:已回访
  customerId: route.query?.id ? Number(route.query?.id) : null, //潜在客户id
});
// 重置
const reset = () => {
  states.page = 1;
  Refquestion.value?.resetFields();
  getlist();
};
// 查询
const inquire = () => {
  states.page = 1;
  getlist();
};
const total = ref(0);
//资讯登记列表
const getlist = async () => {
  let res: any = await getMarketList(states);
  if (res?.code === 10000) {
    data.tableData = res.data.list;
    total.value = res.data.counts;
  }
};
// 新增资讯
const dialogVisible = ref(false);
const addRelation = () => {
  dialogVisible.value = true;
};

//编辑咨询
const ids = ref<any>(null);
const edit = (id: number) => {
  dialogVisible.value = true;
  ids.value = id;
};
//咨询添加/编辑
const Holedclose = (val: any) => {
  dialogVisible.value = val;
  ids.value = 0;
  if (val) {
    dialogVisible.value = false;
    getlist();
  }
};

//资讯详情
const editId = ref<any>(0);
const dialogVisibles = ref(false);
const particulars = (id: number) => {
  dialogVisibles.value = true;
  editId.value = id;
};
const Holedcloses = (val: any) => {
  dialogVisibles.value = val;
};

//删除资讯
const del = async (id: number) => {
  let res = await getMessageBox("是否确认删除该咨询", "删除后将不可恢复");
  if (res) {
    let res: any = await deleteMarket(id).catch(() => {});
    if (res?.code == 10000) {
      getlist();
      ElMessage.success("删除成功");
    }
  } else {
    ElMessage.info("取消删除");
  }
};

//回访记录
const record = (id: number) => {
  router.push({
    path: "/market/callback",
    query: {
      id: id,
    },
  });
};

// 分页
const holedpage = (val: any) => {
  states.page = val;
  getlist();
};
const holedpsize = (val: any) => {
  states.pageSize = val;
  getlist();
};

onMounted(() => {
  getlist();
});
</script>
<style lang="less" scoped>
.section {
  width: 100%;
  background-color: #fff;
}

.title-text {
  margin: 40px;

  span {
    color: #409eff;
  }
}

.form-size {
  margin: 40px;
}

.title {
  display: flex;
  justify-content: space-between;
  height: 57px;
}

.form-size-box {
  margin-bottom: 120px;
}

.title-btn {
  margin: 40px 720px;

  .el-button {
    width: 100px;
    height: 40px;
  }
}

.button {
  width: 92px;
  height: 40px;
}
.el-form-item {
  margin-bottom: 0;
}
</style>
