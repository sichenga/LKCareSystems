<!-- 用药登记详情 -->
<template>
  <div class="app-container">
    <el-card>
      <AddRegInfoDialog
        :remdata="remdata"
        v-if="isdialog"
        @close="close"
        @regdata="regdata"
      />
      <div class="user_content">
        <!-- 头像 -->
        <el-image
          style="width: 80px; height: 80px"
          :src="upload + oldInfo?.photo"
        />
        <el-form
          label-width="120px"
          label-position="left"
          style="max-width: 600px; margin-left: 30px"
        >
          <el-form-item label="老人：">{{ oldInfo?.name }} </el-form-item>
          <el-form-item label="身份证号：">{{ oldInfo?.idCard }} </el-form-item>
          <el-form-item label="床位">{{ oldInfo?.begName }}</el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card style="margin-top: 15px">
      <!-- <div style="margin: 10px 0">
      <el-button type="primary" @click="add">新增</el-button>
    </div> -->
      <!-- 表格 -->
      <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
        <template #operate="{ data }">
          <el-button type="primary" text @click="edit(data)">编辑</el-button>
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
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
import { getElderly } from "@/service/old/OldApi";
import {
  DrugsListForElderly,
  DrugsUpdate,
  DrugsDelete,
} from "@/service/medicalcare/MedicalcareApi";
const AddRegInfoDialog = defineAsyncComponent(
  () => import("@/components/dialog/medicalcare/AddRegInfoDialog.vue")
);
const upload = import.meta.env.VITE_BASE_URL + "/";
// 老人信息
const oldInfo = ref<any>()!;
const total = ref(0);
const params = reactive({
  page: 1,
  pageSize: 5,
});
const isdialog = ref(false);
let id = route.params?.id;
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "addTime",
      label: "登记时间",
    },
    {
      prop: "familyName",
      label: "登记人",
    },
    {
      prop: "counts",
      label: "数量",
    },
    {
      prop: "expTime",
      label: "有效期",
    },
    {
      prop: "sum",
      label: "剂量",
    },
    {
      prop: "remarks",
      label: "剂量",
    },
  ],
  DrugsList: [],
});
// 老人信息
const getOlderInfo = async () => {
  let res: any = await getElderly(Number(id));
  console.log(res);

  if (res?.code === 10000) {
    oldInfo.value = res.data;
    await getlist();
  }
};
// 老人存药记录
const getlist = async () => {
  let res: any = await DrugsListForElderly(Number(id));
  if (res?.code === 10000) {
    total.value = res.data.list.length;
    data.tableData = res.data.list.slice(
      (params.page - 1) * params.pageSize,
      params.page * params.pageSize
    );
    // getPagination(res.oldName.list)
  }
};
// 分页
const getpage = (val: number) => {
  params.page = val;
  getlist();
};
const getpsize = (val: number) => {
  params.pageSize = val;
  getlist();
};
// 编辑
const remdata = ref({});
const edit = (data: any) => {
  remdata.value = data;
  isdialog.value = true;
};
const regdata = async (val: any) => {
  let res: any = await DrugsUpdate(val);
  if (res?.code === 10000) {
    ElMessage.success("编辑成功");
    getlist();
  }
};

// 关闭弹框
const close = () => {
  if (remdata.value) {
    remdata.value = {};
  }
  isdialog.value = false;
};
// 删除
const del = async (id: number) => {
  let res = await getMessageBox("是否确认删除该角色", "删除后将不可恢复");
  console.log(11112, res);
  if (res) {
    let res: any = await DrugsDelete(id);
    if (res?.code === 10000) {
      ElMessage.success("删除成功");
      getlist();
    }
  } else {
    ElMessage.info("取消删除");
  }
};

onMounted(() => {
  getOlderInfo();
});
</script>
<style lang="less" scoped>
.el-input {
  height: 40px;
}
.el-button {
  height: 40px;
  line-height: 40px;
}
.user_content {
  width: 100%;
  display: flex;
}
</style>
